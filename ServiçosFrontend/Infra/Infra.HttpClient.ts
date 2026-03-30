import { v4 as uuidv4 } from 'uuid';
import LoggerParaInfra from '../SistemaObservabilidade/Log.Infra';

const logger = new LoggerParaInfra('HttpClient');

class HttpClient {
    private isRefreshing = false;
    private failedQueue: { resolve: (value: any) => void; reject: (reason?: any) => void; }[] = [];

    private processQueue(error: any, token: string | null = null) {
        this.failedQueue.forEach(prom => {
            if (error) {
                prom.reject(error);
            } else {
                prom.resolve(token);
            }
        });
        this.failedQueue = [];
    }

    public async customFetch(endpoint: string, options: RequestInit = {}, isRetry = false): Promise<any> {
        const headers = new Headers(options.headers || { 'Content-Type': 'application/json' });
        headers.set('x-trace-id', uuidv4());

        const token = localStorage.getItem('userToken');
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }

        const config: RequestInit = { ...options, headers };

        try {
            logger.info(`Iniciando requisição: ${config.method || 'GET'} ${endpoint}`);
        } catch (e) {
            console.warn('Falha ao registrar log de infra:', e);
        }
        const url = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
        const response = await fetch(url, config);

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

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: response.statusText }));
            logger.error(`Erro na requisição para ${endpoint}`, { status: response.status, data: errorData });
            const error = new Error(errorData.message || `Requisição falhou com status ${response.status}`);
            (error as any).response = { data: errorData, status: response.status };
            throw error;
        }

        return response.json();
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
