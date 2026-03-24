import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import VariaveisFrontend from './Config/Variaveis.Frontend.js';
import { registrar } from './config/EndpointRegistry.js';

/**
 * Calcula a duração em milissegundos.
 * Usa performance.now() para alta precisão no ambiente do navegador.
 * @param {number} start - O tempo de início registrado com performance.now().
 * @returns {number} A duração em milissegundos.
 */
function getDurationInMilliseconds(start) {
  if (!start) {
    return 0;
  }
  return performance.now() - start;
}

const ClienteBackend = axios.create({
    baseURL: VariaveisFrontend.apiBaseUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Interceptor de Requisição
ClienteBackend.interceptors.request.use(
    (config) => {
        const traceId = uuidv4();
        config.startTime = performance.now(); // Usando performance.now() para precisão
        config.headers['x-trace-id'] = traceId;

        // Registra o endpoint que está sendo chamado a partir do Frontend.
        registrar('Frontend', [`${config.method.toUpperCase()} ${config.url}`]);

        // Log de início da requisição no formato especificado.
        console.log(`${new Date().toISOString()} [info] [traceId: ${traceId}]: Request Start: ${config.method.toUpperCase()} ${config.url}`);

        const token = localStorage.getItem('userToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        
        return config;
    },
    (error) => {
        // Erro na configuração da requisição, antes do envio.
        const traceId = error.config?.headers['x-trace-id'] || uuidv4();
        const duration = getDurationInMilliseconds(error.config?.startTime);
        console.log(`${new Date().toISOString()} [error] [traceId: ${traceId}]: Request Setup Error: ${error.config?.method.toUpperCase()} ${error.config?.url} - ${error.message} [${duration.toFixed(2)}ms]`);
        return Promise.reject(error);
    }
);

// Interceptor de Resposta
ClienteBackend.interceptors.response.use(
    (response) => {
        const duration = getDurationInMilliseconds(response.config.startTime);
        const traceId = response.config.headers['x-trace-id'];
        
        // Log de fim da requisição com sucesso.
        console.log(`${new Date().toISOString()} [info] [traceId: ${traceId}]: Request End: ${response.config.method.toUpperCase()} ${response.config.url} - ${response.status} [${duration.toFixed(2)}ms]`);
        
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        const duration = getDurationInMilliseconds(originalRequest?.startTime);
        const traceId = originalRequest?.headers['x-trace-id'] || 'UNKNOWN_TRACE_ID';

        // Log de erro no formato especificado.
        console.log(`${new Date().toISOString()} [error] [traceId: ${traceId}]: Request Error: ${originalRequest?.method.toUpperCase()} ${originalRequest?.url} - ${error.response?.status || 'NO RESP'} [${duration.toFixed(2)}ms]`);

        // Preserva a lógica de renovação do token.
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise(function(resolve, reject) {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers['Authorization'] = 'Bearer ' + token;
                    // A requisição será reenviada, passando pelo interceptor de request novamente.
                    return ClienteBackend(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;
            
            console.log(`${new Date().toISOString()} [info] [traceId: ${traceId}]: Token expirado. Tentando renovar...`);

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                const { data } = await ClienteBackend.post('/auth/refresh', { refreshToken });
                
                const novoToken = data.token;
                localStorage.setItem('userToken', novoToken);
                ClienteBackend.defaults.headers.common['Authorization'] = 'Bearer ' + novoToken;
                originalRequest.headers['Authorization'] = 'Bearer ' + novoToken;
                
                console.log(`${new Date().toISOString()} [info] [traceId: ${traceId}]: Token renovado com sucesso.`);
                processQueue(null, novoToken);

                // Reenvia a requisição original com o novo token.
                return ClienteBackend(originalRequest);
            } catch (refreshError) {
                console.log(`${new Date().toISOString()} [error] [traceId: ${traceId}]: Falha ao renovar o token. Deslogando usuário.`);
                processQueue(refreshError, null);

                localStorage.removeItem('userToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
                window.dispatchEvent(new Event('authChange'));
                
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default ClienteBackend;