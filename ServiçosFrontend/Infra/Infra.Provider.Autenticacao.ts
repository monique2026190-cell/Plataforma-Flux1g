
import backend from '../Cliente.Backend.js'; 
import { ENDPOINTS_AUTH } from '../EndPoints/EndPoints.Auth';
import LoggerParaInfra from '../SistemaObservabilidade/Log.Infra';
import { IPerfilParaCompletar } from '../ServiçoDeAutenticação/Processo.Completar.Perfil';

// Interface para os dados que chegam do login social
interface ILoginSocialData {
  nome: string;
  email: string;
  googleId: string;
  avatarUrl?: string;
  tokenProvider: string;
}

const logger = new LoggerParaInfra('Provider.Autenticacao');

class InfraProviderAutenticacao {
  
  async completarPerfil(perfilData: IPerfilParaCompletar): Promise<any> {
    try {
      // CORREÇÃO: Alterado de backend.post para backend.put para corresponder à API
      const response = await backend.put(ENDPOINTS_AUTH.PROFILE, perfilData);
      return response;
    } catch (error) {
      logger.error("Erro ao completar o perfil", error);
      throw error;
    }
  }

  async lidarComLoginSocial(dadosLogin: ILoginSocialData): Promise<any> {
    try {
      const response = await backend.post(ENDPOINTS_AUTH.LOGIN_GOOGLE, dadosLogin);
      return response.data;
    } catch (error) {
      logger.error("Erro ao lidar com login social", error);
      throw error;
    }
  }
}

export const infraProviderAutenticacao = new InfraProviderAutenticacao();
