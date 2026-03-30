import { httpClient } from '../Comunicacao/Comunicacao.Backend.Requisicoes';

class InfraProviderSessao {
    public async login(loginData: any): Promise<any> {
        return httpClient.post("/api/auth/login", loginData);
    }

    public async criarUsuario(dadosUsuario: any): Promise<any> {
        return httpClient.post("/api/auth/registrar", dadosUsuario);
    }

    public async lidarComLoginSocial(dadosLogin: any): Promise<any> {
        return httpClient.post("/api/auth/google/login", dadosLogin);
    }
}

export const infraProviderSessao = new InfraProviderSessao();
