import { dadosProviderUsuario } from './Infra/Dados.Provider.Usuario';
import { mapearBackendParaFrontend } from './Contratos/Contrato.Comunicacao.Usuario';

// Esta interface de usuário é uma duplicata do que está no Provedor. Futuramente, seria bom movê-la para um arquivo de tipos compartilhado.
interface Usuario {
  id: string;
  nome: string;
  email: string;
  apelido?: string;
  avatarUrl?: string;
  perfilCompleto: boolean;
}

class ServicoAutenticacao {
  async loginComEmail(credenciais: { email: string; senha: string }): Promise<{ usuario: Usuario, token: string }> {
    const resposta = await dadosProviderUsuario.login(credenciais.email, credenciais.senha);
    if (resposta.sucesso && resposta.dados?.user) {
      const usuario = mapearBackendParaFrontend(resposta.dados.user);
      const token = resposta.dados.token;
      if (token) {
        localStorage.setItem('auth_token', token);
      }
      return { usuario, token };
    } else {
      throw new Error(resposta.mensagem || 'Falha no login');
    }
  }

  async lidarComLoginGoogle(tokenResponse: any): Promise<{ usuario: Usuario, token: string }> {
    const accessToken = tokenResponse.access_token;
    
    const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`);
    const userInfo = await response.json();
    
    const dadosLogin = {
      email: userInfo.email,
      googleId: userInfo.sub,
      tokenProvider: accessToken,
    };

    const resposta = await dadosProviderUsuario.lidarComLoginSocial(dadosLogin);
    
    if (resposta.sucesso && resposta.dados?.user) {
      const dadosUsuario = mapearBackendParaFrontend(resposta.dados.user);
      const token = resposta.dados.token;
      if (token) {
        localStorage.setItem('auth_token', token);
      }
      return { usuario: dadosUsuario, token };
    } else {
      throw new Error(resposta.mensagem || 'Falha no login com Google');
    }
  }

  logout(): void {
    localStorage.removeItem('auth_token');
  }

  async verificarSessao(): Promise<Usuario | null> {
    const token = localStorage.getItem('auth_token');
    if (token) {
        try {
            const resposta = await dadosProviderUsuario.verificarSessao();
            if (resposta.sucesso && resposta.dados?.user) {
                const usuario = mapearBackendParaFrontend(resposta.dados.user);
                // Renova o token se um novo for enviado
                if (resposta.dados.token) {
                    localStorage.setItem('auth_token', resposta.dados.token);
                }
                return usuario;
            }
            this.logout();
            return null;
        } catch (error) {
            console.error("Erro ao verificar sessão, fazendo logout:", error);
            this.logout();
            return null;
        }
    }
    return null;
  }

  async completarPerfil(idUsuario: string, dadosPerfil: FormData): Promise<Usuario> {
    const resposta = await dadosProviderUsuario.completarPerfilInicial(idUsuario, dadosPerfil);

    if (resposta.sucesso && resposta.dados?.user) {
        const usuarioAtualizado = mapearBackendParaFrontend(resposta.dados.user);
        return usuarioAtualizado;
    } else {
        throw new Error(resposta.mensagem || 'Falha ao completar o perfil.');
    }
  }

  async verificarStatusPerfil(): Promise<any> {
    return dadosProviderUsuario.verificarStatusPerfil();
  }
}

export const servicoAutenticacao = new ServicoAutenticacao();
