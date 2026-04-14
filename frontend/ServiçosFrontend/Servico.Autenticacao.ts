
import { dadosProviderUsuario } from './Infra/Dados.Provider.Usuario';
import { IUsuario, IUsuarioLogin } from '../../types/types.usuario';

// --- Serviço de Gerenciamento de Tokens ---
class ServicoToken {
  private readonly AUTH_TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';

  getAuthToken(): string | null {
    return localStorage.getItem(this.AUTH_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  setTokens(authToken: string, refreshToken: string): void {
    localStorage.setItem(this.AUTH_TOKEN_KEY, authToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  removeTokens(): void {
    localStorage.removeItem(this.AUTH_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }
}

const servicoToken = new ServicoToken();

// --- Serviço do Método Google (sem alterações) ---
class ServicoMetodoGoogle {
  async obterInformacoesDoUsuario(accessToken: string): Promise<any> {
    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!response.ok) throw new Error('Falha ao buscar informações do usuário no Google.');
    return response.json();
  }
}

const servicoMetodoGoogle = new ServicoMetodoGoogle();

// --- Serviço Principal de Autenticação ---

const CACHED_USER_KEY = 'authUser';

class ServicoAutenticacao {

  private _salvarUsuarioNoCache(usuario: IUsuario) {
    try {
      localStorage.setItem(CACHED_USER_KEY, JSON.stringify(usuario));
    } catch (error) {
      console.error("Erro ao salvar usuário no cache:", error);
    }
  }

  private _limparCacheDoUsuario() {
    localStorage.removeItem(CACHED_USER_KEY);
  }

  private async _processarRespostaDeLogin(resposta: any): Promise<{ usuario: IUsuario, token: string }> {
    if (resposta.sucesso && resposta.dados?.user && resposta.dados?.token && resposta.dados?.refreshToken) {
      const { user: usuario, token, refreshToken } = resposta.dados;
      servicoToken.setTokens(token, refreshToken);
      this._salvarUsuarioNoCache(usuario);
      return { usuario, token };
    } else {
      throw new Error(resposta.mensagem || 'Resposta de autenticação inválida do servidor.');
    }
  }

  possibilidade1ObterUsuarioDoCache(): IUsuario | null {
    try {
      const cachedUser = localStorage.getItem(CACHED_USER_KEY);
      return cachedUser ? JSON.parse(cachedUser) : null;
    } catch (error) {
      console.error("Erro ao obter usuário do cache:", error);
      this._limparCacheDoUsuario();
      return null;
    }
  }

  async possibilidade1LoginComEmail(credenciais: IUsuarioLogin): Promise<{ usuario: IUsuario, token: string }> {
    const resposta = await dadosProviderUsuario.login(credenciais);
    return this._processarRespostaDeLogin(resposta);
  }

  async possibilidade1LidarComLoginGoogle(tokenResponse: any): Promise<{ usuario: IUsuario, token: string }> {
    const accessToken = tokenResponse.access_token;
    const userInfo = await servicoMetodoGoogle.obterInformacoesDoUsuario(accessToken);
    const dadosLogin = { email: userInfo.email, googleId: userInfo.sub, tokenProvider: accessToken };
    const resposta = await dadosProviderUsuario.lidarComLoginSocial(dadosLogin);
    return this._processarRespostaDeLogin(resposta);
  }

  possibilidade1Logout(): void {
    servicoToken.removeTokens();
    this._limparCacheDoUsuario();
    window.dispatchEvent(new Event('authChange')); // Notificar a UI para reagir
  }

  async possibilidade1VerificarSessao(): Promise<IUsuario | null> {
    const token = servicoToken.getAuthToken();
    if (!token) {
      this._limparCacheDoUsuario();
      return null;
    }

    try {
      const resposta = await dadosProviderUsuario.verificarSessao();
      if (resposta.sucesso && resposta.dados?.user) {
        const usuario = resposta.dados.user;
        // Se a verificação de sessão retornar novos tokens, atualize-os.
        if (resposta.dados.token && resposta.dados.refreshToken) {
          servicoToken.setTokens(resposta.dados.token, resposta.dados.refreshToken);
        }
        this._salvarUsuarioNoCache(usuario);
        return usuario;
      } else {
        this.possibilidade1Logout();
        return null;
      }
    } catch (error) {
      console.error("Erro ao verificar sessão, fazendo logout forçado:", error);
      this.possibilidade1Logout();
      return null; // Retornar nulo após logout forçado
    }
  }

  async possibilidade1CompletarPerfil(idUsuario: string, dadosPerfil: FormData): Promise<IUsuario> {
    const resposta = await dadosProviderUsuario.completarPerfilInicial(idUsuario, dadosPerfil);
    if (resposta.sucesso && resposta.dados?.user) {
      const usuarioAtualizado = resposta.dados.user;
      this._salvarUsuarioNoCache(usuarioAtualizado);
      return usuarioAtualizado;
    } else {
      throw new Error(resposta.mensagem || 'Falha ao completar o perfil.');
    }
  }

  async possibilidade1VerificarStatusPerfil(): Promise<any> {
    return dadosProviderUsuario.verificarStatusPerfil();
  }
}

export const servicoAutenticacao = new ServicoAutenticacao();
