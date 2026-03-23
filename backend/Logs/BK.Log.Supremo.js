
import { v4 as uuidv4 } from 'uuid';
import LogProvider from './Log.Provider.js';
import { LogLayers } from './Log.Layers.js';

/**
 * @file BK.Log.Supremo.js
 * @description Ponto de entrada centralizado para o sistema de observabilidade do backend.
 * Fornece o middleware para rastreamento de requisições e exporta loggers para cada camada da aplicação.
 */

// --- Middleware de Log de Requisição ---

const requestLoggerMiddleware = (req, res, next) => {
    // 1. Gera ou utiliza um traceId existente
    const traceId = req.headers['x-flux-trace-id'] || uuidv4();
    req.traceId = traceId; // Anexa o traceId ao objeto req para uso posterior

    // Expõe o traceId na resposta para o frontend
    res.setHeader('X-Flux-Trace-ID', traceId);

    const startTime = process.hrtime();

    // 2. Log de INBOUND
    LogProvider.info(LogLayers.HTTP_API, `INBOUND - ${req.method} ${req.originalUrl}`, {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        headers: req.headers,
    }, traceId);

    // 3. Monitora o fim da requisição para logar o OUTBOUND
    res.on('finish', () => {
        const diff = process.hrtime(startTime);
        const durationMs = (diff[0] * 1e3) + (diff[1] * 1e-6);

        LogProvider.info(LogLayers.HTTP_API, `OUTBOUND - ${req.method} ${req.originalUrl}`, {
            statusCode: res.statusCode,
            durationMs: parseFloat(durationMs.toFixed(2)),
        }, traceId);
    });

    next();
};

// --- Loggers por Camada ---

const createLayerLogger = (layer) => ({
    info: (message, data, traceId) => LogProvider.info(layer, message, data, traceId),
    warn: (message, data, traceId) => LogProvider.warn(layer, message, data, traceId),
    error: (message, error, data, traceId) => LogProvider.error(layer, message, error, data, traceId),
    query: (query, params, durationMs, traceId) => LogProvider.info(layer, 'Database Query', { query, params, durationMs }, traceId)
});

const Log = {
    // O middleware principal
    requestLoggerMiddleware,
    
    // Loggers para cada camada
    controller: createLayerLogger(LogLayers.CONTROLLER),
    service: createLayerLogger(LogLayers.SERVICE),
    database: createLayerLogger(LogLayers.DATABASE),
    auth: createLayerLogger(LogLayers.AUTH),
    cache: createLayerLogger(LogLayers.CACHE),
    system: createLayerLogger(LogLayers.SYSTEM),
    security: createLayerLogger(LogLayers.SECURITY),
    external: createLayerLogger(LogLayers.EXTERNAL_API),
};

export default Log;
