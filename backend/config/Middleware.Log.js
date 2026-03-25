
import { backendLogger } from './Sistema.Escritor.Logs.js';

export const configurarLog = (app) => {
    app.use((req, res, next) => {
        const start = Date.now();

        res.on('finish', () => {
            const duration = Date.now() - start;
            const { method, url, ip, headers, body, query, params } = req;
            const { statusCode, statusMessage } = res;

            const logData = {
                camada: 'Backend',
                componente: 'API',
                arquivo: 'Middleware.Log.js',
                mensagem: `Requisição ${method} ${url} finalizada com status ${statusCode}`,
                dados: {
                    request: {
                        method,
                        url,
                        ip: ip || req.socket.remoteAddress,
                        userAgent: headers['user-agent'],
                        headers,
                        body,
                        query,
                        params,
                    },
                    response: {
                        statusCode,
                        statusMessage,
                    },
                    performance: {
                        durationMs: duration,
                    },
                },
            };

            if (statusCode >= 500) {
                backendLogger.error(logData);
            } else if (statusCode >= 400) {
                backendLogger.warn(logData);
            } else {
                backendLogger.info(logData);
            }
        });

        next();
    });
};
