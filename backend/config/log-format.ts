
import winston from 'winston';

const { combine, timestamp, printf, colorize } = winston.format;

const getEmoji = (level: string): string => {
    const lowerLevel = level.toLowerCase();
    if (lowerLevel.includes('error')) return '🔴';
    if (lowerLevel.includes('warn')) return '🟡';
    if (lowerLevel.includes('info')) return '🟢';
    if (lowerLevel.includes('http')) return '🔵';
    if (lowerLevel.includes('debug')) return '🟣';
    return '⚪️';
};

const logFormat = combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    colorize({ all: true }),
    printf(info => {
        const { level, message, timestamp, modulo, arquivo, stack, ...extra } = info;
        const emoji = getEmoji(level);
        const levelUpper = level.toUpperCase();
        const mod = modulo || 'SYSTEM';
        const file = arquivo || '-';

        const header = `${emoji} ${levelUpper} | ${mod} | ${file}`;

        let body = `[${timestamp}] ${message}`;

        const extraData = Object.entries(extra).reduce((acc, [key, value]) => {
            if (value !== undefined && value !== null && key !== 'level' && key !== 'message' && key !== 'timestamp' && key !== 'splat') {
                acc[key] = value;
            }
            return acc;
        }, {} as {[key: string]: any});

        if (Object.keys(extraData).length > 0) {
            body += ` | ${JSON.stringify(extraData)}`;
        }

        if (stack) {
            body += `\nStack: ${stack}`;
        }

        return `${header}\n${body}\n`;
    })
);

export default logFormat;
