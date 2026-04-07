import { createLogger } from './Comunicacao.Backend.Observabilidade';

const logger = createLogger('Infra.ResponseHandler');

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

export async function processarResposta(context: any, response: Response, url: string, startTime: number, originalOptions: any, isRetry: boolean): Promise<any> {
    const duration = (performance.now() - startTime).toFixed(2);

    // Lógica de renovação de token para erro 401
    if (response.status === 401 && !isRetry) {
        if (context.isRefreshing) {
            return new Promise((resolve, reject) => {
                context.failedQueue.push({ resolve, reject });
            }).then(newToken => {
                const newHeaders = { ...originalOptions.headers, Authorization: `Bearer ${newToken}` };
                return context.customFetch(originalOptions.endpoint, { ...originalOptions.options, headers: newHeaders }, true);
            });
        }

        context.isRefreshing = true;
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) throw new Error('Refresh token não encontrado.');
            
            const refreshResponse = await fetch('/api/auth/refresh', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken })
            });

            if (!refreshResponse.ok) throw new Error('Falha na renovação do token.');
            
            const { token: newToken } = await refreshResponse.json();
            localStorage.setItem('auth_token', newToken);
            context.processQueue(null, newToken);
            
            const newHeaders = { ...originalOptions.headers, Authorization: `Bearer ${newToken}` };
            return await context.customFetch(originalOptions.endpoint, { ...originalOptions.options, headers: newHeaders }, true);
        } catch (error) {
            logger.error('Sessão expirada. Redirecionando para login.', error);
            context.processQueue(error, null);
            localStorage.removeItem('auth_token');
            localStorage.removeItem('refreshToken');
            window.dispatchEvent(new Event('authChange'));
            return Promise.reject(error);
        } finally {
            context.isRefreshing = false;
        }
    }

    const text = await response.text();
    let data = null;
    try {
        data = text ? JSON.parse(text) : null;
    } catch (e) {
        data = { raw: text }; // Se não for JSON, retorna o texto bruto
    }
    
    if (!response.ok) {
        logger.error(`Response Error: ${response.status} ${url}`, { 
            duration: `${duration}ms`, 
            data: mascararLog(data) 
        });
        const error = new Error(data?.mensagem || data?.message || `Erro ${response.status}`);
        (error as any).response = { data, status: response.status };
        throw error;
    }

    logger.info(`Response Success: ${response.status} ${url}`, { duration: `${duration}ms` });
    return data;
}
