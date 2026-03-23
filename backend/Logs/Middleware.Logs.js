// backend/Logs/Middleware.Logs.js

// Middleware de log básico que não faz nada.
// Isso evita que o servidor quebre se o arquivo de log estiver vazio.
const logMiddleware = (req, res, next) => {
  next(); // Passa a requisição para o próximo middleware
};

export default logMiddleware;