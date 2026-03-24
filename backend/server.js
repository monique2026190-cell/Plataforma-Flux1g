
// --- IMPORTS ---
// Módulos principais do Node.js
import fs from 'fs';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';

// Módulos de terceiros
import dotenv from 'dotenv';
import express from 'express';
import { Server } from 'socket.io';

// Módulos internos da aplicação
import { run as runMigrations } from '../scripts/executar-migracoes.js';
import { setupMiddlewares } from './config/Sistema.Middleware.js';
import { db, auditorDoPostgreSQL } from './database/Sistema.Banco.Dados.js';
import apiRoutes from './RotasBackend/Rotas.js';
import { extrairTodasAsRotas } from './util/rota-extractor.js';
import { registrarRotas as registrarRotasDeAuditoria } from './Logs/BK.Log.Supremo.js';

// --- CONFIGURAÇÃO INICIAL ---
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;

// --- CONFIGURAÇÃO DO LOGGER GLOBAL ---
/**
 * Configura um sistema de log global que escreve a saída do console para um arquivo (logs/app.log)
 * e trata exceções não capturadas e rejeições de promessas para garantir que nenhum erro passe despercebido.
 */
const setupGlobalLogger = () => {
    const logDir = path.join(__dirname, '..', 'logs');
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
    }
    const logFile = fs.createWriteStream(path.join(logDir, 'app.log'), { flags: 'a' });
    const logTimestamp = () => `[${new Date().toISOString()}]`;

    const wrapConsoleMethod = (method, prefix) => {
        const originalMethod = console[method];
        console[method] = (...args) => {
            const message = args.map(arg => {
                if (arg instanceof Error) return arg.stack;
                if (typeof arg === 'object' && arg !== null) return JSON.stringify(arg, null, 2);
                return String(arg);
            }).join(' ');
            logFile.write(`${logTimestamp()} [${prefix}] ${message}\n`);
            originalMethod.apply(console, args);
        };
    };

    wrapConsoleMethod('log', 'LOG');
    wrapConsoleMethod('error', 'ERROR');
    wrapConsoleMethod('warn', 'WARN');
    wrapConsoleMethod('info', 'INFO');

    process.on('uncaughtException', (err, origin) => {
        console.error(`Exceção Não Capturada: ${err.message}`, { stack: err.stack, origin });
        fs.writeSync(logFile.fd, `${logTimestamp()} [FATAL] Uncaught Exception: ${err.stack}\n`);
        process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
        console.error('Rejeição de Promise Não Tratada:', reason);
        fs.writeSync(logFile.fd, `${logTimestamp()} [FATAL] Unhandled Rejection: ${String(reason)}\n`);
    });

    console.log('--- Sistema de Log em Arquivo Inicializado ---');
};

// --- INICIALIZAÇÃO DA APLICAÇÃO CORE ---
setupGlobalLogger(); // Ativa o logger antes de qualquer outra coisa

// Validação crítica de variáveis de ambiente
if (!process.env.JWT_SECRET) {
    console.error('ERRO FATAL: A variável de ambiente JWT_SECRET não está definida. O servidor não pode iniciar.');
    process.exit(1);
}

const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: true,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin', 'Cache-Control', 'X-Flux-Client-ID', 'X-Flux-Trace-ID', 'X-Admin-Action', 'X-Protocol-Version'],
    }
});

// --- CONFIGURAÇÃO DE MIDDLEWARES ---
// Aplica middlewares de segurança, parsing de corpo, CORS, etc.
setupMiddlewares(app, io);

// --- CONFIGURAÇÃO DE ROTAS ---
// Rotas da API principal
app.use('/api', apiRoutes);

// Servir arquivos estáticos do frontend (pasta 'dist')
const distPath = path.resolve(process.cwd(), 'dist');
app.use(express.static(distPath));

// Handler para rotas de API não encontradas (deve vir após as rotas da API)
app.use('/api', (req, res) => {
    (req.logger || console).warn('NOT_FOUND_API', { path: req.path, method: req.method });
    res.status(404).json({ error: 'Endpoint da API não encontrado.', traceId: req.traceId });
});

// Handler catch-all para servir o `index.html` do frontend (deve ser um dos últimos)
app.get('*', (req, res) => {
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        console.warn('FRONTEND_BUILD_MISSING', { path: req.path });
        res.status(404).send('Build do frontend não encontrado. Verifique se o arquivo index.html existe na pasta /dist.');
    }
});

// --- AUDITORIA DE ENDPOINTS ---
// Executa após a configuração de todas as rotas para registrá-las.
try {
    const rotasDoApp = extrairTodasAsRotas(app);
    registrarRotasDeAuditoria(rotasDoApp);
    console.log(`[AUDITORIA] ${rotasDoApp.length} endpoints registrados para auditoria.`);
} catch (e) {
    console.warn("[AUDITORIA] Falha ao registrar rotas para auditoria.", e);
}

// --- MANIPULADOR DE ERRO GLOBAL ---
// Este deve ser o último middleware a ser registrado
app.use((err, req, res, next) => {
    const logger = req.logger || console;
    const traceId = req.traceId || 'untraced-error';

    const errorInfo = (err instanceof Error)
        ? { message: err.message, stack: err.stack }
        : { message: 'Ocorreu um erro inesperado.', details: err };

    logger.error('GLOBAL_UNHANDLED_ERROR', { 
        error: errorInfo, 
        path: req.path, 
        method: req.method, 
        traceId 
    });

    if (res.headersSent) {
        return next(err);
    }

    res.status(500).json({
        error: 'Ocorreu um erro inesperado no servidor.',
        message: errorInfo.message,
        traceId: traceId
    });
});

// --- INICIALIZAÇÃO DO SERVIDOR ---
const startApp = async () => {
    console.log("Iniciando a aplicação...");
    try {
        await runMigrations();
        console.log('Migrações do banco de dados aplicadas com sucesso.');

        await db.init();
        console.log('Sistema de banco de dados inicializado com sucesso.');

        // Inicia o auditor do banco de dados para verificações de rotina
        setTimeout(() => {
            auditorDoPostgreSQL.inspectDatabases();
        }, 5000);

        httpServer.listen(PORT, '0.0.0.0', () => {
            console.log(`Servidor iniciado com sucesso na porta ${PORT} no ambiente ${process.env.NODE_ENV || 'development'}.`);
        });

    } catch (error) {
        console.error('Falha crítica durante a inicialização da aplicação.', error);
        process.exit(1);
    }
};

startApp();
