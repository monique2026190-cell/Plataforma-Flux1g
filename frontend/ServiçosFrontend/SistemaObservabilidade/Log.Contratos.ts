
// ServiçosFrontend/SistemaObservabilidade/Log.Contratos.ts

import { createLogger } from '../Comunicacao/Comunicacao.Backend.Observabilidade';

/**
 * Cria uma instância de logger para um arquivo de contrato (schema Zod) específico.
 * Este logger é projetado para padronizar o registro de eventos de validação de dados.
 * 
 * @param contractName - O nome do contrato ou schema que está usando o logger.
 * @returns Um objeto logger com métodos para registrar sucessos e falhas de validação.
 */
export const createContractLogger = (contractName: string) => {
    // Cria um logger base, passando o nome do contrato como o "módulo".
    const logger = createLogger(`Contrato-${contractName}`);

    return {
        /**
         * Log para uma validação bem-sucedida de dados contra o schema.
         * @param method - O nome do método/função onde a validação ocorreu.
         * @param data - Os dados que foram validados com sucesso.
         */
        logValidationSuccess: (method: string, data?: any) => {
            logger.info(`[Validation Success] Dados no método '${method}' validados com sucesso.`, data);
        },

        /**
         * Log para uma falha de validação de dados contra o schema.
         * @param method - O nome do método/função onde a validação falhou.
         * @param error - O objeto de erro capturado (ex: ZodError).
         * @param data - Os dados que falharam na validação.
         */
        logValidationError: (method: string, error: any, data?: any) => {
            logger.error(`[Validation Failure] Erro de validação no método '${method}'.`, {
                error,
                invalidData: data,
            });
        },
    };
};
