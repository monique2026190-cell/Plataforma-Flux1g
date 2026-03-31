
import { authStateManager, IAuthState, Usuario } from '../Estados/Manager.Estado.Autenticacao';
import { dadosProviderSessao } from '../Infra/Dados.Provider.Sessao';
import { createApplicationServiceLogger } from '../SistemaObservabilidade/Log.Aplication';
import VariaveisFrontend from '../Config/Variaveis.Frontend';

const logger = createApplicationServiceLogger('AutenticacaoApplicationService');

export interface LoginEmailParams {
  email: string;
  senha: string;
}

// Tipo local para Usuario (替代 authStateManager)
interface UsuarioLocal {
  id: string;
  nome?: string;
  email?: string;
  apelido?: string;
  urlFoto?: string;
  perfilCompleto?: boolean;
}

class AutenticacaoApplicationService {
  async loginComEmail(params: LoginEmailParams): Promise<void> {
    logger.logOperationStart('loginComEmail', { email: params.email });

    try {
      const resposta = await dadosProviderSessao.login(params.email, params.senha);

      if (resposta.sucesso) {
        const usuario: UsuarioLocal = {
          id: resposta.dados.user.id,
          nome: resposta.dados.user.name || resposta.dados.user.nome,
          email: resposta.dados.user.email,
          apelido: resposta.dados.user.nickname || resposta.dados.user.apelido,
          urlFoto: resposta.dados.user.photo_url || resposta.dados.user.urlFoto,
          perfilCompleto: resposta.dados.user.profile_completed || resposta.dados.user.perfilCompleto,
        };
        logger.logOperationSuccess('loginComEmail', { userId: usuario.id });
      } else {
        throw new Error(resposta.mensagem || 'Erro ao fazer login');
      }
    } catch (error: any) {
      const mensagemErro = error.message || 'Erro ao fazer login. Tente novamente.';
      logger.logOperationError('loginComEmail', error);
      throw error;
    }
  }

  async iniciarLoginComGoogle(): Promise<void> {
    logger.logOperationStart('iniciarLoginComGoogle');

    const clientId = VariaveisFrontend.googleClientId;
    const redirectUri = `${window.location.origin}/auth/google/callback`;

    const scope = 'email profile openid';
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.append('client_id', clientId);
    authUrl.searchParams.append('redirect_uri', redirectUri);
    authUrl.searchParams.append('response_type', 'id_token');
    authUrl.searchParams.append('scope', scope);
    authUrl.searchParams.append('nonce', crypto.randomUUID());

    window.location.href = authUrl.toString();
  }

  private decodificarJwt(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      logger.logWarn('Erro ao decodificar JWT', { error });
      return null;
    }
  }

  async finalizarLoginComGoogle(idToken: string): Promise<string> {
    logger.logOperationStart('finalizarLoginComGoogle');
    authStateManager.setProcessando(true);
    authStateManager.setErro(null);

    try {
      const payload = this.decodificarJwt(idToken);
      
      if (!payload) {
        throw new Error('Token inválido');
      }

      const googleId = payload.sub;
      const email = payload.email;
      const nome = payload.name;
      const avatarUrl = payload.picture;

      const resposta = await dadosProviderSessao.lidarComLoginSocial({
        tokenProvider: 'google',
        googleId,
        email,
        nome: nome || '',
        avatarUrl: avatarUrl || '',
      });

      if (resposta.sucesso) {
        const usuario: Usuario = {
          id: resposta.dados.user.id,
          nome: resposta.dados.user.name || resposta.dados.user.nome,
          email: resposta.dados.user.email,
          apelido: resposta.dados.user.nickname || resposta.dados.user.apelido,
          urlFoto: resposta.dados.user.photo_url || resposta.dados.user.urlFoto,
          perfilCompleto: resposta.dados.user.profile_completed || resposta.dados.user.perfilCompleto,
        };

        authStateManager.loginSucesso(usuario, resposta.dados.token);
        logger.logOperationSuccess('finalizarLoginComGoogle', { userId: usuario.id });

        return resposta.dados.redirect || 'Feed';
      } else {
        throw new Error(resposta.mensagem || 'Erro ao fazer login com Google');
      }
    } catch (error: any) {
      const mensagemErro = error.message || 'Erro ao fazer login com Google. Tente novamente.';
      authStateManager.setErro(mensagemErro);
      authStateManager.setProcessando(false);
      logger.logOperationError('finalizarLoginComGoogle', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    logger.logOperationStart('logout');
    authStateManager.logout();
    window.location.href = '/login';
  }
}

export const servicoDeAplicacaoDeAutenticacao = new AutenticacaoApplicationService();
