
import ClienteBackend from '../Cliente.Backend.js'; 
import { ENDPOINTS_AUTH } from '../EndPoints/EndPoints.Auth';
import { IPerfilParaCompletar } from '../ServiçoDeAutenticação/Processo.Completar.Perfil';

// Interface para os dados que chegam do login social
interface ILoginSocialData {
  nome: string;
  email: string;
  googleId: string;
  avatarUrl?: string;
  tokenProvider: string;
}

class InfraProviderAutenticacao {
  
  async completarPerfil(perfilData: IPerfilParaCompletar): Promise<any> {
    try {
      const response = await ClienteBackend.post(ENDPOINTS_AUTH.PROFILE, perfilData);
      return response;
    } catch (error) {
      console.error("Erro no provedor de infraestrutura ao completar o perfil:", error);
      throw error;
    }
  }

  async lidarComLoginSocial(dadosLogin: ILoginSocialData): Promise<any> {
    try {
      // Este endpoint (LOGIN_GOOGLE) é um exemplo. Ele deve corresponder ao que seu backend espera.
      const response = await ClienteBackend.post(ENDPOINTS_AUTH.LOGIN_GOOGLE, dadosLogin);
      return response.data; // Retornando diretamente os dados da resposta (ex: token da sessão, dados do usuário)
    } catch (error) {
      console.error("Erro no provedor de infraestrutura ao lidar com login social:", error);
      throw error;
    }
  }
}

export const infraProviderAutenticacao = new InfraProviderAutenticacao();
