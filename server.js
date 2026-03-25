
// --- IMPORTS ---
import http from 'http';
import { fileURLToPath } from 'url';
import path from 'path';
import dotenv from 'dotenv';
import express from 'express';

import { setupErrorHandlers } from './backend/config/Processo.ErrorHandler.js';
import { configureExpress } from './backend/config/Processo.Express.js';
import { configureSocket } from './backend/config/Processo.Socket.js';
import initDatabase from './backend/database/Database.Init.js'; // Alterado aqui
import logger from './backend/config/logger.js';

// --- CONFIGURAÇÃO INICIAL ---
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
setupErrorHandlers();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;

// --- INICIALIZAÇÃO DA APLICAÇÃO CORE ---
logger.info('--- Inicializando o Servidor ---');

if (!process.env.JWT_SECRET) {
    logger.error('ERRO FATAL: A variável de ambiente JWT_SECRET não está definida. O servidor não pode iniciar.');
    process.exit(1);
}

const app = express();
const httpServer = http.createServer(app);
const io = configureSocket(httpServer);

configureExpress(app, io);

// --- INICIALIZAÇÃO DO SERVIDOR ---
const startApp = async () => {
    logger.info("Iniciando a aplicação...");
    try {
        await initDatabase(); // Alterado aqui

        httpServer.listen(PORT, '0.0.0.0', () => {
            logger.info(`Servidor iniciado com sucesso na porta ${PORT}`);
        });

    } catch (error) {
        logger.error(`Falha crítica durante a inicialização da aplicação: ${error.message}`);
        process.exit(1);
    }
};

startApp();
