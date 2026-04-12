
import { dadosProviderUsuario } from './Infra/Dados.Provider.Usuario';
import { servicoSessao } from './Servico.Sessao';
import { servicoMetodoGoogle } from './Servico.Metodo.Google';
import { IUsuario, IUsuarioLogin } from '../../types/types.usuario';

class ServicoAutenticacao {
  async loginComEmail(credenciais: IUsuarioLogin): Promise<{ usuario: IUsuario, token: string }> {
    const resposta = await dadosProviderUsuario.login(credenciais);
    if (resposta.sucesso && resposta.dados?.user) {
      const usuario = resposta.dados.user;
      const token = resposta.dados.token;
      if (token) {
        servicoSessao.setToken(token);
      }
      return { usuario, token };
    } else {
      throw new Error(resposta.mensagem || 'Falha no login');
    }
  }

  async lidarComLoginGoogle(tokenResponse: any): Promise<{ usuario: IUsuario, token: string }> {
    const accessToken = tokenResponse.access_token;
    const userInfo = await servicoMetodoGoogle.obterInformacoesDoUsuario(accessToken);

    const dadosLogin = {
      email: userInfo.email,
      googleId: userInfo.sub,
      tokenProvider: accessToken,
    };

    const resposta = await dadosProviderUsuario.lidarComLoginSocial(dadosLogin);
    
    if (resposta.sucesso && resposta.dados?.user) {
      const dadosUsuario = resposta.dados.user;
      const token = resposta.dados.token;
      if (token) {
        servicoSessao.setToken(token);
      }
      return { usuario: dadosUsuario, token };
    } else {
      throw new Error(resposta.mensagem || 'Falha no login com Google');
    }
  }

  logout(): void {
    servicoSessao.removeToken();
  }

  async verificarSessao(): Promise<IUsuario | null> {
    const token = servicoSessao.getToken();
    if (token) {
        try {
            const resposta = await dadosProviderUsuario.verificarSessao();
            if (resposta.sucesso && resposta.dados?.user) {
                const usuario = resposta.dados.user;
                if (resposta.dados.token) {
                    servicoSessao.setToken(resposta.dados.token);
                }
                return usuario;
            }
            return null;
        } catch (error) {
            console.error("Erro ao verificar sessão:", error);
            throw error;
        }
    }
    return null;
  }

  async completarPerfil(idUsuario: string, dadosPerfil: FormData): Promise<IUsuario> {
    const resposta = await dadosProviderUsuario.completarPerfilInicial(idUsuario, dadosPerfil);

    if (resposta.sucesso && resposta.dados?.user) {
        const usuarioAtualizado = resposta.dados.user;
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
