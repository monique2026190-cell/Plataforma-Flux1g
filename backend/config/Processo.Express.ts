
import express, { Request, Response, NextFunction, Express } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRoutes from '../RotasBackend/Rotas.js';
import { setupMiddlewares } from './Sistema.Middleware.js';
import createServerLogger from './Log.Servidor.js';

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

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const distPath = path.resolve(__dirname, '..', '..');

    app.use(express.static(distPath));

    app.use('/api', (req: CustomRequest, res: Response) => {
        logger.warn('Endpoint da API não encontrado (404)', {
            componente: 'API',
            dados: { path: req.path, method: req.method, traceId: req.traceId }
        });
        res.status(404).json({ error: 'Endpoint da API não encontrado.', traceId: req.traceId });
    });

    app.get('*', (req: Request, res: Response) => {
        const indexPath = path.join(distPath, 'index.html');
        res.sendFile(indexPath, (err) => {
            if (err) {
                logger.warn('Erro ao tentar enviar o index.html.', {
                    componente: 'Servidor Web',
                    dados: { path: req.path, resolvedDistPath: distPath },
                    error: err ? { message: err.message, stack: err.stack } : 'Erro desconhecido'
                });
                res.status(404).send('Build do frontend não encontrado. Verifique se o arquivo index.html existe na pasta /dist.');
            }
        });
    });

    app.use((err: CustomError, req: CustomRequest, res: Response, next: NextFunction) => {
        const traceId = req.traceId || 'untraced-error';
        let publicMessage = 'Ocorreu um erro inesperado no servidor.';
        let logMessage = (err instanceof Error) ? err.message : 'Ocorreu um erro inesperado.';
        let statusCode = 500;

        if (err.code === '23502' || (err.message && err.message.includes('violates not-null constraint'))) {
            statusCode = 400; // Bad Request
            publicMessage = 'Falha ao processar a requisição: um campo obrigatório não foi preenchido.';
            logMessage = `Violação de NOT NULL na coluna '${err.column}' da tabela '${err.table}'.`;
        }

        logger.error(`Erro não tratado em uma rota do Express: ${logMessage}`, {
            componente: 'API',
            dados: { path: req.path, method: req.method, traceId },
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
