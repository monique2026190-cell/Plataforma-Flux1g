
import fs from 'fs';
import path from 'path';

const logDirectory = path.resolve(process.cwd(), 'logs');

// Garante que o diretório de logs exista
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
}

/**
 * Gera uma representação formatada do stack trace a partir de um objeto de Erro.
 * @param {Error} [error] - Um erro opcional para extrair o stack trace.
 * @returns {string} - Uma string contendo o stack trace formatado.
 */
function gerarTraceDePilha(error) {
  if (!error || !error.stack) {
    return '🔍 Trace:\n  → Stack trace não disponível.';
  }

  const stackLines = error.stack.split('\n');
  const formattedTrace = stackLines
    .slice(1)
    .map(line => {
      const trimmedLine = line.trim();
      const match = trimmedLine.match(/^at (?:(.*?) \()?.*[\\/]([^\\/:]+):\d+:\d+\)?$/);
      if (match) {
        const functionName = match[1] || 'anônima';
        const fileName = match[2];
        return `  → ${fileName}:${functionName}()`;
      }
      return `  → ${trimmedLine}`;
    })
    .join('\n');

  return `🔍 Trace:\n${formattedTrace}`;
}

/**
 * Cria uma instância de logger que escreve logs estruturados em um arquivo.
 * @param {string} fileName - O nome do arquivo de log.
 * @returns Um objeto logger com métodos para diferentes níveis de log.
 */
const createLogger = (fileName) => {
    const logFile = path.join(logDirectory, fileName);

    /**
     * Escreve uma entrada de log formatada no arquivo.
     * @param {string} level - O nível do log (info, warn, error, etc.).
     * @param {object} logData - O objeto com os dados estruturados do log.
     */
    const writeLog = (level, logData) => {
        const { camada, componente, arquivo, mensagem, dados, error } = logData;
        const timestamp = new Date().toLocaleString('pt-BR', { timeZone: 'UTC' });

        let logMessage = '\n';
        if (camada) logMessage += `🏠 ${camada}\n`;
        if (componente) logMessage += `  📂 ${componente}\n`;
        if (arquivo) logMessage += `    📄 ${arquivo}\n`;
        
        const indent = '      ';
        logMessage += `${indent}🕒 ${timestamp} - ${level.toUpperCase()}\n`;
        logMessage += `${indent}  ✉️ Mensagem: ${mensagem}\n`;

        if (dados) {
            for (const [key, value] of Object.entries(dados)) {
                logMessage += `${indent}  - ${key}: ${JSON.stringify(value, null, 2)}\n`;
            }
        }
        
        if (error) {
            logMessage += `${indent}  🔥 Erro: ${error.message}\n`;
            if (error.code) {
                logMessage += `${indent}    - Código: ${error.code}\n`;
            }
            if (error.data) {
                logMessage += `${indent}    - Dados do Erro: ${JSON.stringify(error.data, null, 2)}\n`;
            }
            const trace = gerarTraceDePilha(error);
            const indentedTrace = trace.split('\n').map(line => `${indent}  ${line}`).join('\n');
            logMessage += `${indentedTrace}\n`;
        }

        fs.appendFileSync(logFile, logMessage);
    };

    return {
        info: (logData) => writeLog('info', logData),
        warn: (logData) => writeLog('warn', logData),
        error: (logData) => writeLog('error', logData),
        debug: (logData) => writeLog('debug', logData),
        success: (logData) => writeLog('success', logData),
    };
};

// Cria e exporta loggers específicos para cada contexto
export const backendLogger = createLogger('backend.log');
export const frontendLogger = createLogger('frontend.log');
export const databaseLogger = createLogger('database.log');
export const securityLogger = createLogger('security.log');

// Logger padrão para uso geral
export default createLogger('application.log');
