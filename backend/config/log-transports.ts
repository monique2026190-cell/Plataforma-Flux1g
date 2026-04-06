
import winston from 'winston';
import path from 'path';

const transports: winston.transport[] = [
    new winston.transports.Console(),
    new winston.transports.File({ filename: path.resolve('./logs/error.log'), level: 'error' }),
    new winston.transports.File({ filename: path.resolve('./logs/combined.log') })
];

export default transports;
