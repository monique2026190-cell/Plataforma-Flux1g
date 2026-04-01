import { httpClient } from '../Comunicacao/Comunicacao.Backend.Requisicoes';
import { API_ENDPOINTS } from '../../src/constants/api';

class InfraProviderSessao {
    public async login(loginData: any): Promise<any> {
        return httpClient.post(API_ENDPOINTS.AUTH.LOGIN, loginData);
    }

    public async criarUsuario(dadosUsuario: any): Promise<any> {
        return httpClient.post(API_ENDPOINTS.AUTH.REGISTER, dadosUsuario);
    }

    public async lidarComLoginSocial(dadosLogin: any): Promise<any> {
        return httpClient.post(API_ENDPOINTS.AUTH.GOOGLE_LOGIN, dadosLogin);
    }

    public async completarPerfil(dados: any): Promise<any> {
        return httpClient.post(API_ENDPOINTS.AUTH.COMPLETE_PROFILE, dados);
    }

    public async verificarSessao(token: string): Promise<any> {
        return httpClient.get(API_ENDPOINTS.AUTH.VERIFY_SESSION, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    }

}

export const infraProviderSessao = new InfraProviderSessao();
