
import path from 'path';
import { fileURLToPath } from 'url';
import logger from './logger.js';

interface LogMeta {
    [key: string]: any;
    error?: Error;
}

interface Logger {
    info: (message: string, meta?: LogMeta) => void;
    warn: (message: string, meta?: LogMeta) => void;
    error: (message: string, meta?: LogMeta) => void;
    debug: (message: string, meta?: LogMeta) => void;
}

const createServerLogger = (moduleUrl: string): Logger => {
    let componentName = 'Servidor';
    try {
        if (typeof moduleUrl === 'string' && moduleUrl) {
            const filePath = fileURLToPath(moduleUrl);
            componentName = path.basename(filePath, path.extname(filePath));
        }
    } catch (e) {
        console.error('Erro ao extrair nome do componente do módulo URL:', e);
    }

    const log = (level: 'info' | 'warn' | 'error' | 'debug', message: string, meta: LogMeta = {}) => {
        const logObject: { [key: string]: any; } = {
            componente: componentName,
            ...meta,
        };

        const errorInstance = meta instanceof Error ? meta : (meta?.error instanceof Error ? meta.error : null);
        if (errorInstance) {
            logObject.stack = errorInstance.stack;
            if (!message.includes(errorInstance.message)) {
                message = `${message}: ${errorInstance.message}`;
            }
            if (meta.error === errorInstance) {
                delete logObject.error;
            }
        }

        if (typeof logger[level] === 'function') {
            logger[level](message, logObject);
        } else {
            logger.warn(`[Logger] Nível de log inválido '${level}'. Usando 'info' como fallback.`, {
                originalMessage: message,
                originalMeta: logObject,
            });
            logger.info(message, logObject);
        }
    };

    return {
        info: (message: string, meta?: LogMeta) => log('info', message, meta),
        warn: (message: string, meta?: LogMeta) => log('warn', message, meta),
        error: (message: string, meta?: LogMeta) => log('error', message, meta),
        debug: (message: string, meta?: LogMeta) => log('debug', message, meta),
    };
};

export default createServerLogger;
