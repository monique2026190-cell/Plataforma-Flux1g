
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

  private static log(level: LogLevel, module: string, message: any, data: any = null, traceId?: string) {
    const levelNumber = NIVEIS_DE_LOG[level];
    if (!LogProvider.ativo || levelNumber < LogProvider.levelMinimo) {
      return;
    }

    let finalModule = module;
    let finalMessage = message;
    let finalData = data;

    // Lida com o uso incorreto do LogProvider, onde módulo e mensagem são trocados.
    if (typeof finalMessage === 'object' && finalMessage !== null && finalMessage.contexto) {
        finalMessage = finalModule; // O módulo original é a mensagem
        finalModule = message.contexto; // A propriedade 'contexto' é o módulo
        
        // Limpa o objeto de dados se ele foi usado apenas para o contexto
        const { contexto, ...rest } = message;
        if (Object.keys(rest).length > 0) {
          finalData = { ...(finalData || {}), ...rest };
        }
    } else if (typeof finalMessage !== 'string') {
        finalMessage = String(finalMessage);
    }

    // Mantém a integração com o rastreador de erros críticos
    if (level === 'ERROR' || level === 'FATAL') {
        const error = finalData instanceof Error ? finalData : new Error(finalMessage);
        rastreadorDeEventos.trackCriticalError(error, { module: finalModule, traceId, extraData: finalData });
    }

    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      env: VariaveisFrontend.mode || 'development',
      module: finalModule,
      traceId,
      message: finalMessage,
      data: mascararDados(finalData),
    };

    // Imprime o objeto JSON estruturado no console
    const logFunction = console[level.toLowerCase() as 'info'] || console.log;
    logFunction(JSON.stringify(logEntry, null, 2));
    
    // Envia o log para o backend
    this.enviarLogParaBackend(logEntry);
  }

  private static async enviarLogParaBackend(logEntry: LogEntry) {
    try {
      await fetch('/api/log/frontend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logEntry),
      });
    } catch (error) {
      console.error('Falha ao enviar log para o backend:', error);
    }
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
