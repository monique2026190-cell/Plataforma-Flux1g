import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { registrar } from './EndpointRegistry';

export function criarClienteServico(servico, baseURL) {
  const cliente = axios.create({ baseURL });

  cliente.interceptors.request.use(req => {
    const traceId = uuidv4();
    req.headers['x-trace-id'] = traceId;
    req.startTime = process.hrtime();

    // Registra o endpoint que está sendo chamado.
    // O ideal é que o serviço de destino faça esse registro,
    // mas o cliente pode fazer para garantir a auditoria.
    registrar(servico, [`${req.method.toUpperCase()} ${req.url}`]);

    console.log(`${new Date().toISOString()} [info] [traceId: ${traceId}]: Request Start: ${req.method.toUpperCase()} ${req.url}`);
    return req;
  });

  cliente.interceptors.response.use(res => {
    const duration = getDurationInMilliseconds(res.config.startTime);
    const traceId = res.config.headers['x-trace-id'];
    console.log(`${new Date().toISOString()} [info] [traceId: ${traceId}]: Request End: ${res.config.method.toUpperCase()} ${res.config.url} - ${res.status} [${duration.toFixed(2)}ms]`);
    return res;
  }, err => {
    const duration = getDurationInMilliseconds(err.config?.startTime || process.hrtime());
    const traceId = err.config?.headers['x-trace-id'] || uuidv4();
    console.log(`${new Date().toISOString()} [error] [traceId: ${traceId}]: Request Error: ${err.config?.method.toUpperCase()} ${err.config?.url} - ${err.response?.status || 'NO RESP'} [${duration.toFixed(2)}ms]`);
    return Promise.reject(err);
  });

  return cliente;
}

function getDurationInMilliseconds(start) {
  if (!start) {
    return 0;
  }
  const NS_PER_SEC = 1e9;
  const NS_TO_MS = 1e-6;
  const diff = process.hrtime(start);
  return (diff[0] * NS_PER_SEC + diff[1]) * NS_TO_MS;
}
