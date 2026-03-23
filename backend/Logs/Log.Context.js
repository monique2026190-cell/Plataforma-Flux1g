
import { createNamespace } from 'cls-hooked';

const session = createNamespace('request-session');

const contextMiddleware = (req, res, next) => {
  session.run(() => {
    session.set('traceId', req.traceId);
    next();
  });
};

const getTraceId = () => {
  if (session && session.active) {
    return session.get('traceId');
  }
  return undefined;
};

export { contextMiddleware, getTraceId };
