import VariaveisFrontend from '../../SistemaFlux/Variaveis.Frontend.js';

// --- ESTRUTURA E TIPOS ---

type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';

const NIVEIS_DE_LOG: Record<LogLevel, number> = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  FATAL: 4,
};

export interface ILogger {
  info(message: string, ...data: any[]): void;
  warn(message: string, ...data: any[]): void;
  error(message: string, ...data: any[]): void;
  debug?(message: string, ...data: any[]): void;
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  env: string;
  module: string;
  traceId?: string;
  message: string;
  data?: any;
}

// --- FÁBRICA DE LOGGER (Exportada no topo para evitar problemas de dependência circular) ---

export const criarLogger = (module: string) => ({
  log: (message: any, data?: any) => performLog('INFO', module, message, data),
  info: (message: any, data?: any) => performLog('INFO', module, message, data),
  warn: (message: any, data?: any) => performLog('WARN', module, message, data),
  error: (message: any, error?: any) => performLog('ERROR', module, message, error),
  debug: (message: any, data?: any) => performLog('DEBUG', module, message, data),
});

// --- LÓGICA DE MASCARAMENTO ---

const chavesSensiveis = ['token', 'password', 'senha', 'authorization', 'secret', 'apiKey', 'clientSecret'];

const mascararDados = (data: any): any => {
  if (typeof data !== 'object' || data === null) return data;
  if (Array.isArray(data)) return data.map(mascararDados);

  return Object.keys(data).reduce((acc, key) => {
    if (chavesSensiveis.some(chaveSensivel => new RegExp(chaveSensivel, 'i').test(key))) {
      acc[key] = '[MASCARADO]';
    } else {
      acc[key] = mascararDados(data[key]);
    }
    return acc;
  }, {} as Record<string, any>);
};

// --- SERIALIZAÇÃO ---

const safeJsonStringify = (obj: any): string => {
  try {
    return JSON.stringify(obj, (key, value) => 
      value instanceof Error ? { message: value.message, stack: value.stack } : value, 2);
  } catch (e) {
    return '[Falha na serialização do objeto]';
  }
};

// --- NÚCLEO DO SERVIÇO DE LOG ---

const performLog = (level: LogLevel, module: string, message: any, data: any = null, traceId?: string) => {
  const levelNumber = NIVEIS_DE_LOG[level];
  // Respeita o nível de log configurado (ex: não logar DEBUG em produção)
  if (levelNumber < (NIVEIS_DE_LOG.INFO)) return;

  const messageAsString = typeof message === 'object' && message !== null ? safeJsonStringify(message) : String(message);

  const logEntry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    env: VariaveisFrontend.mode || 'development',
    module,
    traceId,
    message: messageAsString,
    data: mascararDados(data),
  };

  // Loga no console do navegador para depuração imediata
  const logFunction = console[level.toLowerCase() as 'info'] || console.log;
  logFunction(safeJsonStringify(logEntry));
  
  // Envia o log para o backend de forma assíncrona
  enviarLogParaBackend(logEntry);
};

const enviarLogParaBackend = async (logEntry: LogEntry) => {
  try {
    await fetch('/api/log/frontend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: safeJsonStringify(logEntry),
    });
  } catch (error) {
    console.error('Falha ao enviar log para o backend:', error);
  }
};

// --- INTERFACE PÚBLICA LEGADA ---

const LogProvider = {
  info: (module: string, message: any, data: any = null, traceId?: string) => performLog('INFO', module, message, data, traceId),
  warn: (module: string, message: any, data: any = null, traceId?: string) => performLog('WARN', module, message, data, traceId),
  error: (module: string, message: any, error: any = null, traceId?: string) => performLog('ERROR', module, message, error, traceId),
  fatal: (module: string, message: any, error: any = null, traceId?: string) => performLog('FATAL', module, message, error, traceId),
  debug: (module: string, message: any, data: any = null, traceId?: string) => performLog('DEBUG', module, message, data, traceId),
};

export default LogProvider;
