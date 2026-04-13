
import { possibilidadeClienteHttp } from '../Comunicacao/Comunicacao.Backend.Requisicoes';
import API_ENDPOINTS from '../../constants/api';

class InfraProviderUsuario {
    // Métodos de Sessão
    public async OpcaoLogin(loginData: any): Promise<any> {
        return possibilidadeClienteHttp.post(API_ENDPOINTS.AUTH.LOGIN, loginData);
    }

    public async OpcaoCriarUsuario(dadosUsuario: any): Promise<any> {
        return possibilidadeClienteHttp.post(API_ENDPOINTS.AUTH.REGISTER, dadosUsuario);
    }

    public async OpcaoLidarComLoginSocial(dadosLogin: any): Promise<any> {
        return possibilidadeClienteHttp.post(API_ENDPOINTS.AUTH.GOOGLE_LOGIN, dadosLogin);
    }

    public async OpcaoCompletarPerfilInicial(dados: any): Promise<any> {
        return possibilidadeClienteHttp.post(API_ENDPOINTS.AUTH.COMPLETE_PROFILE, dados);
    }

    public async OpcaoVerificarSessao(token: string): Promise<any> {
        return possibilidadeClienteHttp.get(API_ENDPOINTS.AUTH.VERIFY_SESSION, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }

    // Métodos de Usuário
    public async OpcaoAtualizarPerfil(perfilData: any): Promise<any> {
        return possibilidadeClienteHttp.put(API_ENDPOINTS.USERS.BASE + '/perfil', perfilData);
    }

    public async OpcaoBuscarUsuarioPorId(id: string): Promise<any> {
        return possibilidadeClienteHttp.get(API_ENDPOINTS.USERS.PROFILE(id));
    }

    public async OpcaoBuscarUsuarioPorEmail(email: string): Promise<any> {
        const result = await possibilidadeClienteHttp.get(API_ENDPOINTS.USERS.BASE + `?email=${email}`);
        return Array.isArray(result) && result.length > 0 ? result[0] : result;
    }

    public async OpcaoVerificarStatusPerfil(): Promise<any> {
        return possibilidadeClienteHttp.get(API_ENDPOINTS.USERS.PROFILE_STATUS);
    }
}

export const infraProviderUsuario = new InfraProviderUsuario();
