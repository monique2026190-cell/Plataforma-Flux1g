import { createLogger } from './Comunicacao.Backend.Observabilidade';
import VariaveisFrontend from '../../SistemaFlux/Variaveis.Frontend.js';

// Diagnóstico de carregamento de módulo (visível no console do navegador e logs do Render)
console.log('[SISTEMA] Módulo Comunicacao.Backend.Requisicoes carregando...');

// Criando o logger via fábrica direta para evitar dependências circulares com Log.Infra
const logger = createLogger('Infra.HttpClient');

const chavesSensiveis = ['password', 'token', 'authorization', 'cookie', 'senha', 'refreshToken', 'secret'];

/**
 * Serialização segura de objetos para evitar erros no JSON.stringify.
 */
const safeJsonStringify = (obj: any): string => {
    try {
        return JSON.stringify(obj, (key, value) =>
            value instanceof Error ? { message: value.message, stack: value.stack } : value
        );
    } catch (e) {
        return '[Erro na serialização]';
    }
};

/**
 * Mascaramento leve de objetos para log.
 */
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
        const startTime = performance.now();
        
        // --- DIAGNÓSTICO DE URL ---
        const baseUrl = VariaveisFrontend.API_BASE_URL || '/api';
        
        let url = endpoint;
        // Se o endpoint não começar com http(s) nem com o baseUrl, nós o prefixamos
        if (!endpoint.startsWith('http') && !endpoint.startsWith(baseUrl)) {
            const separator = (baseUrl.endsWith('/') || endpoint.startsWith('/')) ? '' : '/';
            url = `${baseUrl}${separator}${endpoint}`;
        }

        // Diagnostic log: ajuda a identificar se a URL está sendo construída corretamente
        console.log(`[HTTP CLIENT] Preparando requisição: ${options.method || 'GET'} para ${url}`);

        // --- CONSTRUÇÃO DOS HEADERS (Estratégia Simples) ---
        const headers: Record<string, string> = {
            'Content-Type': 'application/json'
        };

        // Adiciona headers extras das opções
        if (options.headers) {
            const extraHeaders = new Headers(options.headers);
            extraHeaders.forEach((valor, chave) => {
                headers[chave] = valor;
            });
        }

        const token = localStorage.getItem('auth_token');
        if (token) headers['Authorization'] = `Bearer ${token}`;

        // Se for FormData, deixamos o navegador definir o Content-Type
        if (options.body instanceof FormData) {
            delete headers['Content-Type'];
        }

        const config: RequestInit = { ...options, headers };

        // --- Log Simples de Requisição ---
        try {
            logger.info(`Request: ${config.method || 'GET'} ${url}`, {
                url,
                method: config.method || 'GET',
                headers: mascararLog(headers)
            });
        } catch (e) {}

        try {
            const response = await fetch(url, config);
            const duration = (performance.now() - startTime).toFixed(2);

            if (response.status === 401 && !isRetry) {
                if (this.isRefreshing) {
                    return new Promise((resolve, reject) => {
                        this.failedQueue.push({ resolve, reject });
                    }).then(newToken => {
                        headers['Authorization'] = `Bearer ${newToken}`;
                        return this.customFetch(endpoint, { ...options, headers }, true);
                    });
                }

                this.isRefreshing = true;
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
                    this.processQueue(null, newToken);
                    
                    headers['Authorization'] = `Bearer ${newToken}`;
                    return await this.customFetch(endpoint, { ...options, headers }, true);
                } catch (error) {
                    logger.error('Sessão expirada. Redirecionando para login.', error);
                    this.processQueue(error, null);
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('refreshToken');
                    window.dispatchEvent(new Event('authChange'));
                    return Promise.reject(error);
                } finally {
                    this.isRefreshing = false;
                }
            }

            // Tratamento de resposta vazia ou não JSON
            const text = await response.text();
            let data = null;
            try {
                data = text ? JSON.parse(text) : null;
            } catch (e) {
                data = { raw: text };
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

        } catch (error: any) {
            if (!(error instanceof Error && (error as any).response)) {
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
