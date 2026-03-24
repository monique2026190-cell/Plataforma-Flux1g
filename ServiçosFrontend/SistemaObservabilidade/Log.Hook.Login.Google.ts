
import { createLogger } from './Sistema.Mensageiro.Cliente.Backend.ts';

const logger = createLogger('Hook.Login.Google');

const LogLoginGoogle = {
  inicioFluxo: () => {
    logger.info('Início do fluxo de autenticação com Google.');
  },
  callbackRecebido: (code: string) => {
    logger.info('Callback do Google recebido.', { code: code.substring(0, 15) + '...' });
  },
  loginSucesso: (userId: string, isNewUser: boolean) => {
    logger.info('Login com Google bem-sucedido.', { userId, isNewUser });
  },
  loginFalha: (error: Error, stage: string) => {
    logger.error('Falha no processo de login com Google.', {
      estagio: stage,
      errorMessage: error.message,
      stack: error.stack,
    });
  },
};

export default LogLoginGoogle;
