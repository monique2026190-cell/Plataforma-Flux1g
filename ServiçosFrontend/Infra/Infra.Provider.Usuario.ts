import { httpClient } from './Infra.HttpClient';

class InfraProviderUsuario {
    public async completarPerfil(perfilData: any): Promise<any> {
        return httpClient.put("/api/usuarios/perfil", perfilData);
    }

    public async buscarUsuarioPorId(id: string): Promise<any> {
        return httpClient.get(`/api/usuarios/${id}`);
    }

    public async buscarUsuarioPorEmail(email: string): Promise<any> {
        const result = await httpClient.get(`/api/usuarios?email=${email}`);
        return Array.isArray(result) && result.length > 0 ? result[0] : result;
    }
}

export const infraProviderUsuario = new InfraProviderUsuario();
