
// backend/config/Sistema.Middleware.js

import { configurarSeguranca } from './Middleware.Seguranca.js';
import { configurarOtimizacao } from './Middleware.Otimizacao.js';
import { configurarSocket } from './Middleware.Socket.js';
import morgan from 'morgan';
import logger from './logger.js'; // Importando nosso logger customizado

// Stream para o Morgan usar o Winston
const stream = {
    write: (message) => {
        // Teste para ver se o Morgan está enviando dados, conforme sua sugestão.
        console.log("MORGAN:", message.trim());
        logger.http(message.trim(), { modulo: 'HTTP' });
    },
};

// Habilitar tokens para o corpo da requisição no Morgan
morgan.token('body', (req) => {
    // Não logar o corpo em requisições GET para não poluir o log
    if (req.method === 'GET') {
        return "";
    }
    return JSON.stringify(req.body);
});

// Formato de log customizado para o Morgan
const morganFormat = ':method :url :status :res[content-length] - :response-time ms :body';

export const setupMiddlewares = (app, io) => {
    // Aplica o middleware de log de requisições (Morgan)
    app.use(morgan(morganFormat, { stream }));

    // Aplica as configurações de segurança
    configurarSeguranca(app);

    // Aplica as configurações de otimização e parsing
    configurarOtimizacao(app);

    // Anexa o 'io' do Socket.IO a cada requisição
    app.use(configurarSocket(io));
};
