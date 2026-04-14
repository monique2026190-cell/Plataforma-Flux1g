import { criarLogger } from './Comunicacao.Backend.Observabilidade';
import VariaveisFrontend from '../../SistemaFlux/Variaveis.Frontend';

const logger = criarLogger('Infra.ResponseHandler');

const chavesSensiveis = ['password', 'token', 'authorization', 'cookie', 'senha', 'refreshToken', 'secret'];

const mascararLog = (obj: any): any => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof FormData) return '[FormData]';
    if (Array.isArray(obj)) return `[Array(${obj.length})]`;
    try {
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

function handleSessionExpiration(context: any, error: Error) {
    logger.error(`Sessão expirada: ${error.message}. O usuário será desconectado.`);
    context.processarFila(error, null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refreshToken');
    window.dispatchEvent(new CustomEvent('auth-expired'));
}

async function handleTokenRefresh(context: any, originalRequest: { endpoint: string, opcoes: RequestInit }): Promise<any> {
    if (context.estaAtualizandoToken) {
        return new Promise((resolver, rejeitar) => {
            context.filaRequisicoes.push({ resolver, rejeitar });
        }).then((token: string) => {
            const newHeaders = new Headers(originalRequest.opcoes.headers);
            newHeaders.set('Authorization', `Bearer ${token}`);
            return context.requisicao(originalRequest.endpoint, { ...originalRequest.opcoes, headers: newHeaders }, true);
        });
    }

    context.estaAtualizandoToken = true;

    try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            throw new Error('Refresh token não encontrado no armazenamento local.');
        }

        const urlBase = VariaveisFrontend.API_BASE_URL || '/api';
        const refreshEndpoint = VariaveisFrontend.REFRESH_TOKEN_ENDPOINT || '/auth/refresh';
        const refreshUrl = `${urlBase}${refreshEndpoint.startsWith('/') ? '' : '/'}${refreshEndpoint}`;

        logger.info('Iniciando a renovação do token de acesso.');
        const refreshResponse = await fetch(refreshUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken })
        });

        if (!refreshResponse.ok) {
            const errorData = await refreshResponse.json().catch(() => ({ message: 'O servidor recusou a renovação do token.' }));
            throw new Error(errorData.message || 'Falha na renovação do token.');
        }

        const { token: novoToken, refreshToken: novoRefreshToken } = await refreshResponse.json();
        localStorage.setItem('auth_token', novoToken);
        if (novoRefreshToken) {
            localStorage.setItem('refreshToken', novoRefreshToken);
        }

        logger.info('Token renovado com sucesso.');
        context.processarFila(null, novoToken);

        const newHeaders = new Headers(originalRequest.opcoes.headers);
        newHeaders.set('Authorization', `Bearer ${novoToken}`);
        return await context.requisicao(originalRequest.endpoint, { ...originalRequest.opcoes, headers: newHeaders }, true);

    } catch (error: any) {
        handleSessionExpiration(context, error);
        throw error;
    } finally {
        context.estaAtualizandoToken = false;
    }
}

export async function processarResposta(
    context: any, 
    response: Response, 
    url: string, 
    startTime: number, 
    originalRequest: { endpoint: string, opcoes: RequestInit }, 
    isRetry: boolean
): Promise<any> {
    const duration = (performance.now() - startTime).toFixed(2);

    if (response.status === 401 && !isRetry) {
        logger.warn(`Requisição não autorizada (401) para ${url}. Tentando renovar o token.`);
        return handleTokenRefresh(context, originalRequest);
    }

    const text = await response.text();
    let data = null;
    try {
        data = text ? JSON.parse(text) : null;
    } catch (e) {
        data = { rawResponse: text };
    }

    if (!response.ok) {
        logger.error(`Erro na resposta: ${response.status} ${url}`, { 
            duracao: `${duration}ms`, 
            resposta: mascararLog(data) 
        });
        const error = new Error(data?.mensagem || data?.message || `Erro de servidor com status ${response.status}`);
        (error as any).response = { data, status: response.status };
        throw error;
    }

    logger.info(`Resposta com sucesso: ${response.status} ${url}`, { duracao: `${duration}ms` });
    return data;
}
