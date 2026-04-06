
import path from 'path';
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

const createControllerLogger = (filePath: string): Logger => {
    const fileName = path.basename(filePath);
    const moduleName = fileName.replace('.ts', '');

    const log = (level: 'info' | 'warn' | 'error' | 'debug', message: string, meta: LogMeta = {}) => {
        const logObject: { [key: string]: any; } = {
            modulo: moduleName,
            arquivo: fileName,
            ...meta
        };

        if (meta instanceof Error) {
            logObject.stack = meta.stack;
            logObject.errorMessage = meta.message;
        } else if (meta?.error instanceof Error) {
            logObject.stack = meta.error.stack;
            logObject.errorMessage = meta.error.message;
        }

        if (typeof logger[level] === 'function') {
            logger[level](message, logObject);
        } else {
            logger.warn(`[Logger] Nível de log inválido '${level}' utilizado. Usando 'info' como fallback.`, {
                originalMessage: message,
                originalMeta: logObject
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

export default createControllerLogger;
