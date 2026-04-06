
import cors from 'cors';
import helmet from 'helmet';
import { Express } from 'express';

export const configurarSeguranca = (app: Express): void => {
    // Configurações de segurança
    app.use(helmet({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false,
        crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
        referrerPolicy: { policy: "no-referrer-when-downgrade" }
    }));

    app.use(cors({
        origin: true,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'Cache-Control', 'X-Flux-Client-ID', 'X-Flux-Trace-ID', 'X-Admin-Action', 'X-Protocol-Version', 'x-trace-id'],
        exposedHeaders: ['X-Flux-Trace-ID']
    }));

    // Confia no primeiro proxy (necessário para ambientes como Heroku, Render, etc.)
    app.set('trust proxy', 1);
};
