import { createLogger } from './Comunicacao.Backend.Observabilidade';
import VariaveisFrontend from '../../SistemaFlux/Variaveis.Frontend.js';
import { processarResposta } from './Comunicacao.Backend.Respostas';

const logger = createLogger('Infra.HttpClient');

const safeJsonStringify = (obj: any): string => {
    try {
        return JSON.stringify(obj, (key, value) =>
            value instanceof Error ? { message: value.message, stack: value.stack } : value
        );
    } catch (e) {
        return '[Erro na serialização]';
    }
};

class HttpClient {
    public isRefreshing = false;
    public failedQueue: { resolve: (value: any) => void; reject: (reason?: any) => void; }[] = [];

    public processQueue(error: any, token: string | null = null) {
        this.failedQueue.forEach(prom => {
            if (error) prom.reject(error);
            else prom.resolve(token);
        });
        this.failedQueue = [];
    }

    public async customFetch(endpoint: string, options: RequestInit = {}, isRetry = false): Promise<any> {
        const startTime = performance.now();
        
        const baseUrl = VariaveisFrontend.API_BASE_URL || '/api';
        let url = endpoint;
        if (!endpoint.startsWith('http') && !endpoint.startsWith(baseUrl)) {
            const separator = (baseUrl.endsWith('/') || endpoint.startsWith('/')) ? '' : '/';
            url = `${baseUrl}${separator}${endpoint}`;
        }

        const headers: Record<string, string> = {};
        if (!(options.body instanceof FormData)) {
            headers['Content-Type'] = 'application/json';
        }

        if (options.headers) {
            const extraHeaders = new Headers(options.headers);
            extraHeaders.forEach((valor, chave) => { headers[chave] = valor; });
        }

        const token = localStorage.getItem('auth_token');
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const config: RequestInit = { ...options, headers };

        logger.info(`Request: ${config.method || 'GET'} ${url}`, { url, method: config.method || 'GET' });

        try {
            const response = await fetch(url, config);
            // Delegar o processamento da resposta para o módulo de respostas
            return await processarResposta(this, response, url, startTime, { endpoint, options }, isRetry);
        } catch (error: any) {
            // Trata erros de conexão que ocorrem antes de receber uma resposta
            if (!(error.response)) {
                logger.error(`Connection Failed: ${url}`, { error: error.message });
            }
            throw error;
        }
    }

    public get<T = any>(url: string, config?: any): Promise<T> {
        return this.customFetch(url, { ...config, method: 'GET' });
    }

    public post<T = any>(url: string, data?: any, config?: any): Promise<T> {
        const body = (data instanceof FormData || typeof data === 'string') ? data : safeJsonStringify(data);
        return this.customFetch(url, { ...config, method: 'POST', body });
    }

    public put<T = any>(url: string, data?: any, config?: any): Promise<T> {
        const body = (data instanceof FormData || typeof data === 'string') ? data : safeJsonStringify(data);
        return this.customFetch(url, { ...config, method: 'PUT', body });
    }

    public delete<T = any>(url: string, config?: any): Promise<T> {
        return this.customFetch(url, { ...config, method: 'DELETE' });
    }
}

export const httpClient = new HttpClient();
console.log('[SISTEMA] Módulo Comunicacao.Backend.Requisicoes inicializado com sucesso.');
