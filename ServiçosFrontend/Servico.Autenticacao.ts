import { dadosProviderUsuario } from './Infra/Dados.Provider.Usuario';
import { mapearBackendParaFrontend } from './Contratos/Contrato.Comunicacao.Usuario';
import { servicoSessao } from './Servico.Sessao';
import { servicoMetodoGoogle } from './Servico.Metodo.Google';

export interface Usuario {
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
        servicoSessao.setToken(token);
      }
      return { usuario, token };
    } else {
      throw new Error(resposta.mensagem || 'Falha no login');
    }
  }

  async lidarComLoginGoogle(tokenResponse: any): Promise<{ usuario: Usuario, token: string }> {
    const accessToken = tokenResponse.access_token;
    const userInfo = await servicoMetodoGoogle.obterInformacoesDoUsuario(accessToken);

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

  async verificarSessao(): Promise<Usuario | null> {
    const token = servicoSessao.getToken();
    if (token) {
        try {
            const resposta = await dadosProviderUsuario.verificarSessao();
            if (resposta.sucesso && resposta.dados?.user) {
                const usuario = mapearBackendParaFrontend(resposta.dados.user);
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
