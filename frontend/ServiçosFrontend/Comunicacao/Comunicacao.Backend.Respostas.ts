import { criarLogger } from './Comunicacao.Backend.Observabilidade';

const logger = criarLogger('Infra.ResponseHandler');

// --- Funções de Mascaramento de Log (sem alteração) ---
const chavesSensiveis = ['password', 'token', 'authorization', 'cookie', 'senha', 'refreshToken', 'secret'];

const mascararLog = (obj: any): any => {
    try {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof FormData) return '[FormData]';
        if (Array.isArray(obj)) return `[Array(${obj.length})]`;
        
        const clone: any = {};
        for (const key in obj) {
            if (chavesSensiveis.some(k => key.toLowerCase().includes(k))) {
                clone[key] = '[MASCARADO]';
            } else {
                const val = obj[key];
                clone[key] = (typeof val === 'object' && val !== null) ? '[Object]' : val;
            }
        }
        return clone;
    } catch (e) {
        return '[Erro ao mascarar log]';
    }
};

/**
 * Lida com a expiração final da sessão do usuário.
 * Esta função é chamada quando a renovação do token falha ou é impossível.
 * @param context - O contexto da API, contendo a fila de requisições.
 * @param error - O erro que causou a expiração da sessão.
 */
function handleSessionExpiration(context: any, error: Error) {
    logger.error('Sessão expirada ou falha na renovação. Redirecionando para login.', error);
    context.processQueue(error, null); // Notifica as requisições em espera sobre a falha
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refreshToken');
    window.dispatchEvent(new Event('authChange')); // Dispara um evento global para a UI reagir (ex: redirecionar)
    return Promise.reject(new Error('Sessão expirada. Por favor, faça login novamente.'));
}

/**
 * Gerencia todo o fluxo de renovação do token de acesso quando uma requisição retorna 401.
 * @param context - O contexto da API, para gerenciar estado e filas.
 * @param originalOptions - As opções da requisição original que falhou.
 */
async function handleTokenRefresh(context: any, originalOptions: any): Promise<any> {
    // Se uma renovação já está em andamento, enfileira a requisição para ser executada depois.
    if (context.isRefreshing) {
        return new Promise((resolve, reject) => {
            context.failedQueue.push({ resolve, reject });
        }).then(newToken => {
            // Tenta novamente a requisição original com o novo token
            const newHeaders = { ...originalOptions.headers, Authorization: `Bearer ${newToken}` };
            return context.customFetch(originalOptions.endpoint, { ...originalOptions.options, headers: newHeaders }, true);
        });
    }

    context.isRefreshing = true;

    try {
        const refreshToken = localStorage.getItem('refreshToken');

        // Caso crítico: Não há refreshToken. A sessão está perdida.
        if (!refreshToken) {
            return handleSessionExpiration(context, new Error('Refresh token não encontrado no localStorage.'));
        }

        // Tenta renovar o token de acesso fazendo uma chamada à API.
        const refreshResponse = await fetch('/api/auth/refresh', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken })
        });

        // Se a API recusar o refreshToken (expirado, inválido), encerra a sessão.
        if (!refreshResponse.ok) {
            return handleSessionExpiration(context, new Error('Falha na renovação do token. O servidor recusou o refresh token.'));
        }

        const { token: newToken } = await refreshResponse.json();
        localStorage.setItem('auth_token', newToken);

        // Processa a fila de requisições que estavam aguardando o novo token.
        context.processQueue(null, newToken);

        // Re-executa a requisição original que falhou, agora com o novo token.
        const newHeaders = { ...originalOptions.headers, Authorization: `Bearer ${newToken}` };
        return await context.customFetch(originalOptions.endpoint, { ...originalOptions.options, headers: newHeaders }, true);

    } catch (error: any) {
        // Se qualquer outro erro ocorrer (ex: rede), encerra a sessão por segurança.
        return handleSessionExpiration(context, error);
    } finally {
        context.isRefreshing = false;
    }
}

/**
 * Processa a resposta de uma chamada da API, lidando com erros e renovação de token.
 */
export async function processarResposta(context: any, response: Response, url: string, startTime: number, originalOptions: any, isRetry: boolean): Promise<any> {
    const duration = (performance.now() - startTime).toFixed(2);

    // Se a resposta for 401 (Não Autorizado) e não for uma tentativa repetida, delega para o handleTokenRefresh.
    if (response.status === 401 && !isRetry) {
        return handleTokenRefresh(context, originalOptions);
    }

    const text = await response.text();
    let data = null;
    try {
        data = text ? JSON.parse(text) : null;
    } catch (e) {
        data = { raw: text }; // Se não for JSON, encapsula o texto bruto.
    }
    
    // Se a resposta não for "ok" (ex: 404, 500), registra o erro e lança uma exceção.
    if (!response.ok) {
        logger.error(`Response Error: ${response.status} ${url}`, { 
            duration: `${duration}ms`, 
            data: mascararLog(data) 
        });
        const error = new Error(data?.mensagem || data?.message || `Erro ${response.status}`);
        (error as any).response = { data, status: response.status };
        throw error;
    }

    // Se tudo correu bem, registra o sucesso e retorna os dados.
    logger.info(`Response Success: ${response.status} ${url}`, { duration: `${duration}ms` });
    return data;
}
