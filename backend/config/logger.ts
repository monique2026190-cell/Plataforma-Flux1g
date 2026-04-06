
import winston from 'winston';
import logFormat from './log-format.js';
import transports from './log-transports.js';

const logger = winston.createLogger({
    level: 'http', // Alterado de 'info' para 'http' para permitir logs do Morgan
    format: logFormat,
    transports: transports
});

export default logger;
