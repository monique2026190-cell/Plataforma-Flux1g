
import express, { Request, Response, NextFunction, Express } from 'express';
import path from 'path';
import apiRoutes from '../RotasBackend/Rotas.js';
import { setupMiddlewares } from './Sistema.Middleware.js';
import createServerLogger from './Log.Servidor.js';
import fs from 'fs';

// Add a type for the error object to satisfy TypeScript
interface CustomError extends Error {
    code?: string;
    column?: string;
    table?: string;
}

// Add a type for the request object to satisfy TypeScript
interface CustomRequest extends Request {
    traceId?: string;
}

export function configureExpress(app: Express, io: any) {
    const logger = createServerLogger(import.meta.url);

    setupMiddlewares(app, io);

    app.use('/api', apiRoutes);

    const distPath = path.join(process.cwd(), 'dist');

    // Debugging: Log paths for verification
    logger.info(`Serving static files from: ${distPath}`);
    if (!fs.existsSync(distPath)) {
        logger.error('Dist directory does not exist!', { path: distPath });
    } else {
        logger.info('Dist directory found.');
        const indexPath = path.join(distPath, 'index.html');
        if (!fs.existsSync(indexPath)) {
            logger.error('index.html does not exist in dist directory!', { path: indexPath });
        } else {
            logger.info('index.html found in dist directory.');
        }
    }

    app.use(express.static(distPath));

    app.get('*', (req: Request, res: Response) => {
        const indexPath = path.join(distPath, 'index.html');
        res.sendFile(indexPath, (err) => {
            if (err) {
                logger.warn('Error sending index.html.', {
                    component: 'WebServer',
                    data: { path: req.path, resolvedDistPath: distPath },
                    error: err
                });
                res.status(404).send('Frontend build not found. Check if index.html exists in the correct folder.');
            }
        });
    });

    app.use((err: CustomError, req: CustomRequest, res: Response, next: NextFunction) => {
        const traceId = req.traceId || 'untraced-error';
        let publicMessage = 'An unexpected server error occurred.';
        let logMessage = (err instanceof Error) ? err.message : 'An unexpected error occurred.';
        let statusCode = 500;

        if (err.code === '23502' || (err.message && err.message.includes('violates not-null constraint'))) {
            statusCode = 400; // Bad Request
            publicMessage = 'Failed to process request: a required field was not filled.';
            logMessage = `NOT NULL violation in column '${err.column}' of table '${err.table}'.`;
        }

        logger.error(`Unhandled error in an Express route: ${logMessage}`, {
            component: 'API',
            data: { path: req.path, method: req.method, traceId },
            error: err
        });

        if (res.headersSent) {
            return next(err);
        }

        res.status(statusCode).json({
            error: publicMessage,
            traceId
        });
    });
}
