
/**
 * @file Log.Hook.Login.Google.ts
 * @description Módulo de logging especializado para o hook `useLoginGoogle`.
 */

import { createLogger } from './Log.Provider';

// Cria uma instância de logger específica para este módulo
const logger = createLogger('Hook.Login.Google');

/**
 * @namespace LogLoginGoogle
 * @description Agrupa funções de log para o fluxo de login com Google.
 */
const LogLoginGoogle = {
  /**
   * Registra o início do fluxo de autenticação com Google.
   */
  inicioFluxo: () => {
    logger.info('Início do fluxo de autenticação com Google.');
  },

  /**
   * Registra o recebimento do callback do Google após a autenticação.
   * @param {string} code - O código de autorização recebido.
   */
  callbackRecebido: (code: string) => {
    logger.info('Callback do Google recebido com sucesso.', { code });
  },

  /**
   * Registra o sucesso do login via Google.
   * @param {string} userId - O ID do usuário que realizou o login.
   * @param {boolean} isNewUser - Indica se é um novo usuário.
   */
  loginSucesso: (userId: string, isNewUser: boolean) => {
    // O método `success` não existe mais; usamos `info` com dados que indicam o sucesso.
    logger.info('Login com Google realizado com sucesso.', {
      userId,
      novoUsuario: isNewUser,
      status: 'sucesso'
    });
  },

  /**
   * Registra a falha no processo de login via Google.
   * @param {Error} error - O objeto de erro capturado.
   * @param {string} [stage='desconhecido'] - O estágio em que a falha ocorreu.
   */
  loginFalha: (error: Error, stage: string = 'desconhecido') => {
    logger.error(`Falha no processo de login com Google.`, {
      estagio: stage,
      errorMessage: error.message,
      stack: error.stack,
    });
  },
};

export default LogLoginGoogle;
