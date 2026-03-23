
import { LogLayers } from './Log.Layers.js';

/**
 * @file Log.Provider.js
 * @description Provedor central para a criação e formatação de logs estruturados em JSON.
 */

class LogProvider {

    /**
     * O método principal que formata e emite o log.
     * @param {string} level - O nível do log (ex: 'info', 'warn', 'error').
     * @param {string} layer - A camada do sistema onde o log foi gerado.
     * @param {string} message - A mensagem descritiva do log.
     * @param {object} data - Um objeto contendo todos os dados contextuais (ex: { userId, durationMs }).
     * @param {string} traceId - O ID de rastreamento que conecta todos os logs de uma mesma requisição.
     */
    log(level, layer, message, data = {}, traceId) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            traceId: traceId || 'system-process', // Fallback para processos que não são de uma requisição HTTP
            level,
            layer,
            message,
            ...data,
        };

        // Usamos JSON.stringify para garantir que o log seja uma linha única e estruturada,
        // facilitando a análise por outras ferramentas.
        console.log(JSON.stringify(logEntry));
    }

    /**
     * Loga uma mensagem informativa.
     */
    info(layer, message, data, traceId) {
        this.log('info', layer, message, data, traceId);
    }

    /**
     * Loga um aviso.
     */
    warn(layer, message, data, traceId) {
        this.log('warn', layer, message, data, traceId);
    }

    /**
     * Loga um erro, incluindo detalhes do objeto de erro.
     * @param {Error} error - O objeto de erro capturado.
     */
    error(layer, message, error, data, traceId) {
        const errorData = {
            ...data,
            error: {
                message: error.message,
                stack: error.stack,
                name: error.name,
            },
        };
        this.log('error', layer, message, errorData, traceId);
    }
}

export default new LogProvider();
