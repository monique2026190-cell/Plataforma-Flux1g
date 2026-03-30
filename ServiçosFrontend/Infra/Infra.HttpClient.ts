import LoggerParaInfra from '../SistemaObservabilidade/Log.Infra';

const logger = new LoggerParaInfra('HttpClient');

// Palavras-chave para mascaramento de dados sensíveis
const chavesSensiveis = ['password', 'token', 'authorization', 'cookie', 'senha', 'refreshToken'];

const mascararDados = (obj: any): any => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (Array.isArray(obj)) return obj.map(mascararDados);
    return Object.keys(obj).reduce((acc, key) => {
        if (chavesSensiveis.some(k => key.toLowerCase().includes(k))) {
            acc[key] = '[MASCARADO]';
        } else {
            acc[key] = mascararDados(obj[key]);
        }
        return acc;
    }, {} as any);
};

class HttpClient {
    private isRefreshing = false;
    private failedQueue: { resolve: (value: any) => void; reject: (reason?: any) => void; }[] = [];

    private processQueue(error: any, token: string | null = null) {
        this.failedQueue.forEach(prom => {
            if (error) prom.reject(error);
            else prom.resolve(token);
        });
        this.failedQueue = [];
    }

    public async customFetch(endpoint: string, options: RequestInit = {}, isRetry = false): Promise<any> {
        const traceId = crypto.randomUUID ? crypto.randomUUID() : 'no-uuid-support';
        const headers = new Headers(options.headers || { 'Content-Type': 'application/json' });
        headers.set('x-trace-id', traceId);

        const token = localStorage.getItem('userToken');
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }

        const config: RequestInit = { ...options, headers };
        const startTime = performance.now();
        const url = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

        try {
            const requestLog = {
                method: config.method || 'GET',
                url: url,
                headers: Object.fromEntries(headers.entries()),
                body: config.body ? JSON.parse(config.body as string) : undefined
            };
            logger.info(`Request: ${requestLog.method} ${requestLog.url}`, mascararDados(requestLog));
        } catch (e) {
            // Silently ignore log errors to avoid breaking the request
        }

        try {
            const response = await fetch(url, config);
            const duration = performance.now() - startTime;

            if (response.status === 401 && !isRetry) {
                if (this.isRefreshing) {
                    return new Promise((resolve, reject) => {
                        this.failedQueue.push({ resolve, reject });
                    }).then(newToken => {
                        headers.set('Authorization', `Bearer ${newToken}`);
                        return this.customFetch(endpoint, { ...options, headers }, true);
                    });
                }
                this.isRefreshing = true;
                try {
                    const refreshToken = localStorage.getItem('refreshToken');
                    if (!refreshToken) throw new Error('Nenhum refresh token disponível.');
                    
                    const refreshResponse = await fetch(`/api/auth/refresh`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ refreshToken })
                    });

                    if (!refreshResponse.ok) throw new Error('Falha ao renovar o token.');
                    const { token: newToken } = await refreshResponse.json();
                    localStorage.setItem('userToken', newToken);
                    this.processQueue(null, newToken);
                    headers.set('Authorization', `Bearer ${newToken}`);
                    return await this.customFetch(endpoint, { ...options, headers }, true);
                } catch (error) {
                    logger.error('Erro ao renovar o token, deslogando usuário.', error);
                    this.processQueue(error, null);
                    localStorage.removeItem('userToken');
                    localStorage.removeItem('refreshToken');
                    window.dispatchEvent(new Event('authChange'));
                    return Promise.reject(error);
                } finally {
                    this.isRefreshing = false;
                }
            }

            const data = await response.json().catch(() => null);
            
            if (!response.ok) {
                logger.error(`Response Error: ${response.status} ${url}`, { duration, status: response.status, data: mascararDados(data) });
                const error = new Error(data?.message || `Requisição falhou com status ${response.status}`);
                (error as any).response = { data, status: response.status };
                throw error;
            }

            logger.info(`Response Success: ${response.status} ${url}`, { duration, status: response.status, data: mascararDados(data) });
            return data;
        } catch (error: any) {
            if (!(error instanceof Error && (error as any).response)) {
                logger.error(`Network Error: ${url}`, { error: error.message });
            }
            throw error;
        }
    }

    public get<T = any>(url: string, config?: any): Promise<T> {
        return this.customFetch(url, { ...config, method: 'GET' });
    }

    public post<T = any>(url: string, data?: any, config?: any): Promise<T> {
        const body = data ? JSON.stringify(data) : null;
        return this.customFetch(url, { ...config, method: 'POST', body });
    }

    public put<T = any>(url: string, data?: any, config?: any): Promise<T> {
        const body = data ? JSON.stringify(data) : null;
        return this.customFetch(url, { ...config, method: 'PUT', body });
    }

    public delete<T = any>(url: string, config?: any): Promise<T> {
        return this.customFetch(url, { ...config, method: 'DELETE' });
    }
}

export const httpClient = new HttpClient();

