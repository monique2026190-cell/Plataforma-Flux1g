import winston from 'winston';
import path from 'path';

const { combine, timestamp, printf, colorize, align } = winston.format;

const logFormat = combine(
    colorize({ all: true }),
    timestamp({
        format: 'YYYY-MM-DD hh:mm:ss.SSS A',
    }),
    align(),
    printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
);

const logger = winston.createLogger({
    level: 'info',
    format: logFormat,
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: path.resolve('./logs/error.log'), level: 'error' }),
        new winston.transports.File({ filename: path.resolve('./logs/combined.log') })
    ]
});

export default logger;