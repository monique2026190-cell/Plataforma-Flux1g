import express from 'express';
import logger from '../config/logger.js';

const router = express.Router();

const allowedLevels = ['error', 'warn', 'info', 'http', 'debug'];

const frontendLogger = logger.child({
    modulo: 'FRONTEND',
    arquivo: 'logs.frontend.route.js'
});

router.post('/', (req, res) => {
    try {
        const logData = req.body;

        if (!logData || typeof logData !== 'object') {
            return res.status(400).send({ status: 'Payload inválido' });
        }

        const level =
            logData.level && allowedLevels.includes(logData.level.toLowerCase())
                ? logData.level.toLowerCase()
                : 'info';

        frontendLogger.log({
            level: level,
            message: logData.mensagem || 'Log do frontend recebido',
            dados: {
                ...logData,
                ip: req.ip,
                userAgent: req.headers['user-agent'],
                endpoint: req.originalUrl
            }
        });

        res.status(202).send({ status: 'Log recebido' });

    } catch (e) {
        const error = e instanceof Error ? e : new Error(String(e));
        logger.error('Erro ao processar log do frontend', {
            dados: { error: error.message }
        });

        res.status(500).send({ status: 'Erro ao registrar log' });
    }
});

export default router;
