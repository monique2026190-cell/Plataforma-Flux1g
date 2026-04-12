import { httpClient } from '../Comunicacao/Comunicacao.Backend.Requisicoes';
import API_ENDPOINTS from '../../constants/api';

class InfraProviderUsuario {
    // Métodos de Sessão
    public async login(loginData: any): Promise<any> {
        return httpClient.post(API_ENDPOINTS.AUTH.LOGIN, loginData);
    }

    public async criarUsuario(dadosUsuario: any): Promise<any> {
        return httpClient.post(API_ENDPOINTS.AUTH.REGISTER, dadosUsuario);
    }

    public async lidarComLoginSocial(dadosLogin: any): Promise<any> {
        return httpClient.post(API_ENDPOINTS.AUTH.GOOGLE_LOGIN, dadosLogin);
    }

    public async completarPerfilInicial(dados: any): Promise<any> {
        return httpClient.post(API_ENDPOINTS.AUTH.COMPLETE_PROFILE, dados);
    }

    public async verificarSessao(token: string): Promise<any> {
        return httpClient.get(API_ENDPOINTS.AUTH.VERIFY_SESSION, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }

    // Métodos de Usuário
    public async atualizarPerfil(perfilData: any): Promise<any> {
        return httpClient.put(API_ENDPOINTS.USERS.BASE + '/perfil', perfilData);
    }

    public async buscarUsuarioPorId(id: string): Promise<any> {
        return httpClient.get(API_ENDPOINTS.USERS.PROFILE(id));
    }

    public async buscarUsuarioPorEmail(email: string): Promise<any> {
        const result = await httpClient.get(API_ENDPOINTS.USERS.BASE + `?email=${email}`);
        return Array.isArray(result) && result.length > 0 ? result[0] : result;
    }

    public async verificarStatusPerfil(): Promise<any> {
        return httpClient.get(API_ENDPOINTS.USERS.PROFILE_STATUS);
    }
}

export const infraProviderUsuario = new InfraProviderUsuario();
