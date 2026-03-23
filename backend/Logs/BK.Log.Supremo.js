
import { contextMiddleware, getTraceId } from './Log.Context.js';
import logger from './Provedor.Log.js';

const Log = {
  createLogger: (name) => logger.child({ name }),
  contextMiddleware,
  getTraceId,
  info: logger.info.bind(logger),
  warn: logger.warn.bind(logger),
  error: logger.error.bind(logger),
  debug: logger.debug.bind(logger),
  fatal: logger.fatal.bind(logger),
};

export default Log;
