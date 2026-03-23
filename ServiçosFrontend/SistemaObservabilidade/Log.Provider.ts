
import VariaveisFrontend from '../Config/Variaveis.Frontend';
import { rastreadorDeEventos } from './Rastreador.Eventos.js';

// --- ESTRUTURA E TIPOS ---

type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';

const NIVEIS_DE_LOG: Record<LogLevel, number> = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  FATAL: 4,
};

interface LogEntry {
  // Metadados
  timestamp: string;
  level: LogLevel;
  env: string;
  module: string; // "contexto" anterior
  traceId?: string; // "requestId" anterior
  
  // Conteúdo
  message: string;
  
  // Dados estruturados (payload, erro, etc.)
  data?: any;
}

// --- LÓGICA DE MASCARAMENTO (Mantida do original) ---

const chavesSensiveis = ['token', 'password', 'senha', 'authorization', 'secret', 'apiKey', 'clientSecret'];

const mascararDados = (data: any): any => {
  if (typeof data !== 'object' || data === null) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(mascararDados);
  }

  return Object.keys(data).reduce((acc, key) => {
    if (chavesSensiveis.some(chaveSensivel => new RegExp(chaveSensivel, 'i').test(key))) {
      acc[key] = '[MASCARADO]';
    } else {
      acc[key] = mascararDados(data[key]);
    }
    return acc;
  }, {} as Record<string, any>);
};

// --- SERVIÇO DE LOG ESTRUTURADO ---

class LogProvider {
  static ativo: boolean = true;
  static levelMinimo: number = NIVEIS_DE_LOG.DEBUG;

  private static log(level: LogLevel, module: string, message: string, data: any = null, traceId?: string) {
    const levelNumber = NIVEIS_DE_LOG[level];
    if (!LogProvider.ativo || levelNumber < LogProvider.levelMinimo) {
      return;
    }

    // Mantém a integração com o rastreador de erros críticos
    if (level === 'ERROR' || level === 'FATAL') {
        const error = data instanceof Error ? data : new Error(message);
        rastreadorDeEventos.trackCriticalError(error, { module, traceId, extraData: data });
    }

    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      env: VariaveisFrontend.mode || 'development',
      module,
      traceId,
      message,
      data: mascararDados(data),
    };

    // Imprime o objeto JSON estruturado no console
    const logFunction = console[level.toLowerCase() as 'info'] || console.log;
    logFunction(JSON.stringify(logEntry, null, 2));
  }

  // --- INTERFACE PÚBLICA (Mantida do original para compatibilidade) ---

  static info(module: string, message: string, data: any = null, traceId?: string) {
    this.log('INFO', module, message, data, traceId);
  }

  static warn(module: string, message: string, data: any = null, traceId?: string) {
    this.log('WARN', module, message, data, traceId);
  }

  static erro(module: string, message: string, error: any = null, traceId?: string) {
    this.log('ERROR', module, message, error, traceId);
  }

  static fatal(module: string, message: string, error: any = null, traceId?: string) {
    this.log('FATAL', module, message, error, traceId);
  }

  static debug(module: string, message: string, data: any = null, traceId?: string) {
    this.log('DEBUG', module, message, data, traceId);
  }
}

export default LogProvider;
