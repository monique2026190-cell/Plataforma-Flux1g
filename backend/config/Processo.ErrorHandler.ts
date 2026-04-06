
import createServerLogger from './Log.Servidor.js';
import { exit } from 'process';

export function setupErrorHandlers(): void {
    const logger = createServerLogger(import.meta.url);

    process.on('uncaughtException', (err: Error, origin: NodeJS.UncaughtExceptionOrigin) => {
        logger.error(`Exceção Não Capturada: ${err.message}`, {
            componente: 'Core',
            dados: { origin },
            error: err
        });
        // Aguarda o log ser escrito antes de encerrar
        setTimeout(() => exit(1), 1000); 
    });

    process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
        const isError = reason instanceof Error;
        const message = isError ? reason.message : 'Rejeição de Promise Não Tratada com motivo não-Erro.';

        logger.error(`Rejeição de Promise Não Tratada: ${message}`.trim(), {
            componente: 'Core',
            dados: { reason: String(reason) },
            error: isError ? reason : undefined
        });
    });
}
