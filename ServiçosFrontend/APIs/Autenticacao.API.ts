
import clienteBackend from '../Cliente.Backend.js';
import { ILoginEmailParams } from '../Contratos/Contrato.Autenticacao';
import { IRegistroParams } from '../ServiçoDeAutenticação/Processo.Registrar';
import { IPerfilParaCompletar } from '../ServiçoDeAutenticação/Processo.Completar.Perfil';
import { ENDPOINTS_AUTH } from '../EndPoints/EndPoints.Auth';
import { createApiLogger } from '../SistemaObservabilidade/Log.API';

const logger = createApiLogger('AutenticacaoAPI');

export const AutenticacaoAPI = {

  loginComEmail: async (params: ILoginEmailParams): Promise<any> => {
    const method = 'loginComEmail';
    logger.logRequest(method, params);
    try {
      const response = await clienteBackend.post(ENDPOINTS_AUTH.LOGIN, params);
      logger.logSuccess(method, response);
      return response;
    } catch (error) {
      logger.logFailure(method, error, params);
      throw error;
    }
  },

  registrar: async (params: IRegistroParams): Promise<any> => {
    const method = 'registrar';
    logger.logRequest(method, params);
    try {
      const response = await clienteBackend.post(ENDPOINTS_AUTH.REGISTER, params);
      logger.logSuccess(method, response);
      return response;
    } catch (error) {
      logger.logFailure(method, error, params);
      throw error;
    }
  },

  completarPerfil: async (usuarioId: string, dadosPerfil: IPerfilParaCompletar): Promise<any> => {
    const method = 'completarPerfil';
    const requestData = { usuarioId, ...dadosPerfil };
    logger.logRequest(method, requestData);
    try {
      const response = await clienteBackend.post(ENDPOINTS_AUTH.ME, requestData);
      logger.logSuccess(method, response);
      return response;
    } catch (error) {
      logger.logFailure(method, error, requestData);
      throw error;
    }
  },

  loginComProvedorSocial: async (params: { provedor: string, token: string, email: string, nome: string }): Promise<any> => {
    const method = 'loginComProvedorSocial';
    logger.logRequest(method, params);
    try {
      const response = await clienteBackend.post(ENDPOINTS_AUTH.GOOGLE, params);
      logger.logSuccess(method, response);
      return response;
    } catch (error) {
      logger.logFailure(method, error, params);
      throw error;
    }
  }
};
