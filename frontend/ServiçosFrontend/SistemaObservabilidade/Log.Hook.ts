// ServiçosFrontend/SistemaObservabilidade/Log.Hook.ts

import { criarLogger } from '../Comunicacao/Comunicacao.Backend.Observabilidade';
import VariaveisFrontend from '../Config/Variaveis.Frontend';

// Definindo uma interface para o contexto do usuário para consistência
interface UserContext {
    userId?: string;
    userName?: string;
    role?: string;
}

/**
 * Utilitário de log específico para React Hooks.
 * Ajuda a rastrear o ciclo de vida dos hooks, mudanças de estado e efeitos.
 * 
 * @param hookName - O nome do hook (ex: 'useAuth', 'useFeed').
 * @returns Um objeto com métodos de log decorados para hooks.
 */
export const createHookLogger = (hookName: string) => {
    const logger = criarLogger(`Hook-${hookName}`);

    const buildLogObject = (functionName: string, type: string, message: string, userContext?: UserContext) => ({
        hook: hookName,
        function: functionName,
        type,
        message,
        timestamp: new Date().toISOString(),
        user: userContext || 'anonymous',
    });

    return {
        /**
         * Log para rastrear quando um hook é montado ou uma função interna é chamada.
         */
        logEntry: (functionName: string, params?: any, userContext?: UserContext) => {
            const logObject = {
                ...buildLogObject(functionName, 'entry', `[Entry] Chamada em ${functionName}`, userContext),
                params: params || null,
            };
            logger.info(logObject.message, logObject);
        },

        /**
         * Log para rastrear o resultado de uma operação dentro de um hook.
         */
        logSuccess: (functionName: string, result?: any, userContext?: UserContext) => {
            const logObject = {
                ...buildLogObject(functionName, 'success', `[Success] Concluído em ${functionName}`, userContext),
                result: result || null,
            };
            logger.info(logObject.message, logObject);
        },

        /**
         * Log para capturar erros específicos dentro de um hook.
         */
        logError: (functionName: string, error: any, contextData?: any, userContext?: UserContext) => {
            const logObject = {
                ...buildLogObject(functionName, 'error', `[Error] Erro em '${functionName}': ${error?.message || 'Erro desconhecido'}`, userContext),
                error: {
                    message: error?.message || 'Erro sem mensagem.',
                    name: error?.name || 'UnknownError',
                    stack: error?.stack || 'Stack trace não disponível.',
                    ...(typeof error === 'object' && error !== null ? error : { details: error }),
                },
                contextData: contextData || null,
            };
            logger.error(logObject.message, logObject);
        },
        
        /**
         * Log para depuração, útil para rastrear valores em desenvolvimento.
         */
        logDebug: (functionName: string, message: string, debugData?: any, userContext?: UserContext) => {
            if (VariaveisFrontend.mode === 'development') {
                const logObject = {
                    ...buildLogObject(functionName, 'debug', `[Debug] ${functionName}: ${message}`, userContext),
                    debugData: debugData || null,
                };
                logger.debug(logObject.message, logObject);
            }
        },
    };
};

/**
 * Hook customizado de log para rastrear montagem e desmontagem (opcional).
 */
export const useHookTracker = (hookName: string, userContext?: UserContext) => {
    const logger = createHookLogger(hookName);

    // Nota: Como este arquivo não pode importar React diretamente sem ser um .tsx/.ts num ambiente React,
    // este helper assume que o projeto tem as tipagens necessárias ou será usado em arquivos .tsx.
    
    return {
        trackMount: () => {
             if (VariaveisFrontend.mode === 'development') {
                logger.logDebug('lifecycle', 'Hook montado');
             }
        },
        trackUnmount: () => {
             if (VariaveisFrontend.mode === 'development') {
                logger.logDebug('lifecycle', 'Hook desmontado');
             }
        },
        logger
    };
};
