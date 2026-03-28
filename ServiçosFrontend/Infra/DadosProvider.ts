
import { infraProvider } from './Infra.Provider.Usuario';
import { ENDPOINTS_AUTH } from '../EndPoints/EndPoints.Auth';
import LoggerParaInfra from '../SistemaObservabilidade/Log.Infra';

const logger = new LoggerParaInfra('DadosProvider.Autenticacao');

interface ILoginSocialData {
  nome: string;
  email: string;
  googleId: string;
  avatarUrl?: string;
  tokenProvider: string;
}

class C_DadosProvider {

  async login(email: string, senha: string): Promise<any> {
    try {
      const response = await infraProvider.post(ENDPOINTS_AUTH.LOGIN, { email, senha });
      return response.data; // Acessa .data se o infraProvider retornar o objeto de resposta completo
    } catch (error: any) {
      logger.error("Erro no login", error);
      // O infraProvider já loga o erro, mas podemos relançar ou tratar aqui
      throw error;
    }
  }

  async completarPerfil(perfilData: any): Promise<any> {
    try {
      const response = await infraProvider.put(ENDPOINTS_AUTH.PROFILE, perfilData);
      return { sucesso: true, mensagem: "Perfil completado com sucesso!", usuarioAtualizado: response.data };
    } catch (error: any) {
      return { sucesso: false, mensagem: error.response?.data?.message || "Falha na comunicação com o servidor." };
    }
  }

  async lidarComLoginSocial(dadosLogin: ILoginSocialData): Promise<any> {
    try {
      const response = await infraProvider.post(ENDPOINTS_AUTH.LOGIN_GOOGLE, dadosLogin);
      return response.data;
    } catch (error) {
      logger.error("Erro ao lidar com login social", error);
      throw error;
    }
  }

  async criarUsuario(dadosUsuario: any): Promise<any> {
    try {
      // Usando o post genérico do infraProvider. 
      // Se houver validação específica, o ideal seria usar um método como infraProvider.postUsuario
      const response = await infraProvider.post(ENDPOINTS_AUTH.REGISTER, dadosUsuario);
      return response.data; // Supondo que a resposta de sucesso esteja em .data
    } catch (error: any) {
      return { sucesso: false, mensagem: error.response?.data?.message || "Falha ao criar usuário." };
    }
  }

  async buscarUsuarioPorId(id: string): Promise<any> {
    try {
      // Este método já estava usando o provider correto
      const response = await infraProvider.get(ENDPOINTS_AUTH.USER_BY_ID(id));
      return { sucesso: true, dados: response.data };
    } catch (error: any) {
      return { sucesso: false, mensagem: error.response?.data?.message || "Falha ao buscar usuário." };
    }
  }

  async buscarUsuarioPorEmail(email: string): Promise<any> {
    try {
       // Este endpoint não existe no ENDPOINTS_AUTH, o ideal seria adicioná-lo lá.
       // Por agora, vou manter a URL, mas usando o infraProvider.
      const response = await infraProvider.get(`/api/v1/users?email=${email}`);
      const usuario = response.data && response.data.length > 0 ? response.data[0] : null;
      return { sucesso: true, dados: usuario };
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
          return { sucesso: true, dados: null };
      }
      return { sucesso: false, mensagem: error.response?.data?.message || "Falha ao buscar usuário por e-mail." };
    }
  }
}

export const DadosProvider = new C_DadosProvider();
