// ServiçosFrontend/Comunicacao/Comunicacao.Backend.Requisicoes.ts

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
        // Gera um ID de rastreio para correlação entre logs de frontend e backend
        const traceId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2);
        
        // --- GESTÃO DE HEADERS ---
        const headers = new Headers();
        // Define o tipo de conteúdo padrão como JSON
        headers.set('Content-Type', 'application/json');
        // Adiciona o trace-id
        headers.set('x-trace-id', traceId);

        // Mescla headers passados nas opções (podem ser um objeto simples ou um objeto Headers)
        if (options.headers) {
            const extraHeaders = new Headers(options.headers);
            extraHeaders.forEach((valor, chave) => {
                headers.set(chave, valor);
            });
        }

        // Adiciona o token de autorização, se existir
        const token = localStorage.getItem('userToken');
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }

        const config: RequestInit = { ...options, headers };
        const startTime = performance.now();
        const url = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

        // --- LOG DE REQUISIÇÃO (Frontend) ---
        try {
            const requestLog = {
                method: config.method || 'GET',
                url: url,
                headers: Object.fromEntries(headers.entries()),
                // Exibe o corpo sem tentar fazer parse (evita crash se já for um objeto ou se for FormData)
                body: config.body || null
            };
            logger.info(`Request: ${requestLog.method} ${requestLog.url}`, mascararDados(requestLog));
        } catch (e) {
            // Silenciosamente ignora falhas de log para não interromper a requisição principal
        }

        try {
            const response = await fetch(url, config);
            const duration = (performance.now() - startTime).toFixed(2);

            // --- TRATAMENTO DE RENOVAÇÃO DE TOKEN (401 Unauthorized) ---
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

            // --- PROCESSAMENTO DA RESPOSTA ---
            const data = await response.json().catch(() => null);
            
            if (!response.ok) {
                logger.error(`Response Error: ${response.status} ${url}`, { 
                    duration: `${duration}ms`, 
                    status: response.status, 
                    data: mascararDados(data) 
                });
                const error = new Error(data?.mensagem || data?.message || `Requisição falhou com status ${response.status}`);
                (error as any).response = { data, status: response.status };
                throw error;
            }

            logger.info(`Response Success: ${response.status} ${url}`, { 
                duration: `${duration}ms`, 
                status: response.status, 
                data: mascararDados(data) 
            });
            return data;

        } catch (error: any) {
            // Captura erros de rede (DNS falhou, timeout, CORS bloqueado, etc)
            if (!(error instanceof Error && (error as any).response)) {
                logger.error(`Network or Parsing Error: ${url}`, { error: error.message || error });
            }
            throw error;
        }
    }

    public get<T = any>(url: string, config?: any): Promise<T> {
        return this.customFetch(url, { ...config, method: 'GET' });
    }

    public post<T = any>(url: string, data?: any, config?: any): Promise<T> {
        // Se já for uma string ou FormData, usa diretamente. Caso contrário, stringifica.
        const body = (typeof data === 'string' || data instanceof FormData) ? data : JSON.stringify(data);
        return this.customFetch(url, { ...config, method: 'POST', body });
    }

    public put<T = any>(url: string, data?: any, config?: any): Promise<T> {
        const body = (typeof data === 'string' || data instanceof FormData) ? data : JSON.stringify(data);
        return this.customFetch(url, { ...config, method: 'PUT', body });
    }

    public delete<T = any>(url: string, config?: any): Promise<T> {
        return this.customFetch(url, { ...config, method: 'DELETE' });
    }
}

export const httpClient = new HttpClient();
