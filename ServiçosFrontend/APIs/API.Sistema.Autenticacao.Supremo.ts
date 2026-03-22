
import { AxiosResponse } from 'axios';
import ClienteBackend from '../Cliente.Backend';
import { CriarUsuarioDTO, AtualizarPerfilUsuarioDTO } from '../../types/Entrada/Dto.Estrutura.Usuario';

const authApi = {
    login(email: string, password: string): Promise<AxiosResponse<any>> {
        return ClienteBackend.post('/auth/login', { email, password });
    },

    register(dadosConta: CriarUsuarioDTO): Promise<AxiosResponse<any>> {
        return ClienteBackend.post('/auth/register', dadosConta);
    },

    validateToken(): Promise<AxiosResponse<any>> {
        return ClienteBackend.post('/auth/validate-token');
    },

    updateProfile(dadosPerfil: Partial<AtualizarPerfilUsuarioDTO>): Promise<AxiosResponse<any>> {
        return ClienteBackend.put('/user/profile', dadosPerfil);
    },
};

export default authApi;
