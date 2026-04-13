
import { dadosProviderUsuario } from './Infra/Dados.Provider.Usuario';
import { IUsuario, IUsuarioLogin } from '../../types/types.usuario';

// --- Dependência Interna: Serviço de Sessão ---
class ServicoSessao {
  private readonly CHAVE_TOKEN = 'auth_token';

  getToken(): string | null {
    return localStorage.getItem(this.CHAVE_TOKEN);
  }

  setToken(token: string): void {
    localStorage.setItem(this.CHAVE_TOKEN, token);
  }

  removeToken(): void {
    localStorage.removeItem(this.CHAVE_TOKEN);
  }
}

const servicoSessao = new ServicoSessao();

// --- Dependência Interna: Serviço do Método Google ---
class ServicoMetodoGoogle {
  async obterInformacoesDoUsuario(accessToken: string): Promise<any> {
    const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`);
    if (!response.ok) {
      throw new Error('Falha ao buscar informações do usuário no Google.');
    }
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
    try {
      localStorage.removeItem(CACHED_USER_KEY);
    } catch (error) {
      console.error("Erro ao limpar cache do usuário:", error);
    }
  }

  possibilitaObterUsuarioDoCache(): IUsuario | null {
    try {
      const cachedUser = localStorage.getItem(CACHED_USER_KEY);
      return cachedUser ? JSON.parse(cachedUser) : null;
    } catch (error) {
      console.error("Erro ao obter usuário do cache:", error);
      this._limparCacheDoUsuario();
      return null;
    }
  }

  async possibilitaLoginComEmail(credenciais: IUsuarioLogin): Promise<{ usuario: IUsuario, token: string }> {
    const resposta = await dadosProviderUsuario.login(credenciais);
    if (resposta.sucesso && resposta.dados?.user) {
      const { user: usuario, token } = resposta.dados;
      if (token) {
        servicoSessao.setToken(token);
      }
      this._salvarUsuarioNoCache(usuario);
      return { usuario, token };
    } else {
      throw new Error(resposta.mensagem || 'Falha no login');
    }
  }

  async possibilitaLidarComLoginGoogle(tokenResponse: any): Promise<{ usuario: IUsuario, token: string }> {
    const accessToken = tokenResponse.access_token;
    const userInfo = await servicoMetodoGoogle.obterInformacoesDoUsuario(accessToken);

    const dadosLogin = {
      email: userInfo.email,
      googleId: userInfo.sub,
      tokenProvider: accessToken,
    };

    const resposta = await dadosProviderUsuario.lidarComLoginSocial(dadosLogin);
    
    if (resposta.sucesso && resposta.dados?.user) {
      const { user: usuario, token } = resposta.dados;
      if (token) {
        servicoSessao.setToken(token);
      }
      this._salvarUsuarioNoCache(usuario);
      return { usuario, token };
    } else {
      throw new Error(resposta.mensagem || 'Falha no login com Google');
    }
  }

  possibilitaLogout(): void {
    servicoSessao.removeToken();
    this._limparCacheDoUsuario();
  }

  async possibilitaVerificarSessao(): Promise<IUsuario | null> {
    const token = servicoSessao.getToken();
    if (!token) {
        this._limparCacheDoUsuario();
        return null;
    }

    try {
        const resposta = await dadosProviderUsuario.verificarSessao();
        if (resposta.sucesso && resposta.dados?.user) {
            const usuario = resposta.dados.user;
            if (resposta.dados.token) {
                servicoSessao.setToken(resposta.dados.token);
            }
            this._salvarUsuarioNoCache(usuario);
            return usuario;
        } else {
            this.possibilitaLogout();
            return null;
        }
    } catch (error) {
        console.error("Erro ao verificar sessão:", error);
        this.possibilitaLogout();
        throw error;
    }
  }

  async possibilitaCompletarPerfil(idUsuario: string, dadosPerfil: FormData): Promise<IUsuario> {
    const resposta = await dadosProviderUsuario.completarPerfilInicial(idUsuario, dadosPerfil);

    if (resposta.sucesso && resposta.dados?.user) {
        const usuarioAtualizado = resposta.dados.user;
        this._salvarUsuarioNoCache(usuarioAtualizado);
        return usuarioAtualizado;
    } else {
        throw new Error(resposta.mensagem || 'Falha ao completar o perfil.');
    }
  }

  async possibilitaVerificarStatusPerfil(): Promise<any> {
    return dadosProviderUsuario.verificarStatusPerfil();
  }
}

export const servicoAutenticacao = new ServicoAutenticacao();
