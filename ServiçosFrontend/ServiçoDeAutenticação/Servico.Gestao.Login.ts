
import { LoginUsuarioDTO as LoginDto } from '../../../types/Entrada/Dto.Estrutura.Usuario';
import { Usuario } from '../../../types/Saida/Types.Estrutura.Usuario';
import authApi from '../APIs/authApi';
import ClienteBackend from '../Cliente.Backend';
import { servicoGestaoPerfil } from './Servico.Gestao.Perfil';
import { servicoGestaoSessao } from './Servico.Gestao.Sessao';
import { config } from '../ValidaçãoDeAmbiente/config';

interface User extends Usuario {}

// --- Real Login/Profile Service ---
const realLoginService = {
    login: async (dadosLogin: LoginDto) => {
        const { data } = await authApi.login(dadosLogin.email, dadosLogin.password);
        if (data && data.token && data.user) {
            localStorage.setItem('userToken', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            ClienteBackend.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            return data;
        }
        throw new Error('Resposta de login inválida do servidor.');
    },
    completeProfile: async (profileData: Partial<Usuario>): Promise<User> => {
        const { data } = await authApi.updateProfile(profileData);
        if (data && data.user) {
            localStorage.setItem('user', JSON.stringify(data.user));
            return data.user;
        }
        throw new Error('Resposta de atualização de perfil inválida.');
    },
};

// --- Simulated Login/Profile Service ---
const simulatedLoginService = {
    login: async (dados: LoginDto) => ({ token: 'abc-simulated', user: await servicoGestaoPerfil.getOwnProfile() as User }),
    completeProfile: async (profileData: Partial<Usuario>): Promise<User> => {
        const currentUser = servicoGestaoSessao.getCurrentUser();
        if (!currentUser) throw new Error("Usuário não encontrado na simulação.");
        const updatedUser = { ...currentUser, ...profileData, perfilCompleto: true };
        await new Promise(resolve => setTimeout(resolve, 500));
        return updatedUser as User;
    }
};

// --- Exporting the correct service based on environment ---
export const servicoGestaoLogin = config.VITE_APP_ENV === 'simulation'
    ? simulatedLoginService
    : realLoginService;
