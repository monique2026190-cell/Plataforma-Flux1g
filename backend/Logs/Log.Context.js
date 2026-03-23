
import { createNamespace } from 'cls-hooked';

// Cria um namespace para a sessão da requisição, garantindo que o contexto não vaze entre requisições.
const session = createNamespace('request-session');

/**
 * Middleware para ser usado com Express.
 * Ele cria um contexto para cada requisição usando 'cls-hooked'.
 * Isso permite que o 'traceId' (e outros dados da requisição) seja acessível
 * em qualquer parte da aplicação que for executada durante o ciclo de vida desta requisição.
 */
const contextMiddleware = (req, res, next) => {
  session.run(() => {
    // Armazena o traceId no contexto da requisição atual.
    // O traceId deve ser previamente gerado e anexado ao objeto 'req' por um middleware anterior.
    session.set('traceId', req.traceId);
    next();
  });
};

/**
 * Retorna o 'traceId' do contexto da requisição atual.
 * Se chamado fora de um contexto de requisição (p.ex., durante a inicialização), retornará undefined.
 * @returns {string | undefined} O ID de rastreamento da requisição atual.
 */
const getTraceId = () => {
  if (session && session.active) {
    return session.get('traceId');
  }
  return undefined;
};

// Exporta o middleware e a função para obter o traceId.
export { contextMiddleware, getTraceId };
