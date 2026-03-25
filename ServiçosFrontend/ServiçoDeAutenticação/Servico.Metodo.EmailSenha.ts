
import { config } from '../ValidaçãoDeAmbiente/config';
import { Usuario } from '../../types/Saida/Types.Estrutura.Usuario';
import { LoginUsuarioDTO as LoginDto } from '../../../types/Entrada/Dto.Estrutura.Usuario';
import authApi from '../APIs/API.Sistema.Autenticacao.Supremo';
import { servicoGestaoPerfil } from './Servico.Gestao.Perfil';

// --- Interface ---
export interface IServicoEmailSenhaAuth {
    autenticar(dadosLogin: LoginDto): Promise<{ token: string; user: Usuario | null }>;
}

// --- Real Implementation ---
class ServicoEmailSenhaAuthReal implements IServicoEmailSenhaAuth {
    async autenticar(dadosLogin: LoginDto): Promise<{ token: string; user: Usuario | null }> {
        console.log("Real Email/Senha Auth: Iniciando autenticação...");
        const { data } = await authApi.login(dadosLogin.email, dadosLogin.password);
        if (data && data.token && data.user) {
            console.log("Real Email/Senha Auth: Autenticação bem-sucedida.");
            return data;
        }
        throw new Error('Resposta de login inválida do servidor.');
    }
}

// --- Simulated Implementation ---
class ServicoEmailSenhaAuthSimulado implements IServicoEmailSenhaAuth {
    async autenticar(dadosLogin: LoginDto): Promise<{ token: string; user: any | null }> {
        console.log("Simulated Email/Senha Auth: Iniciando autenticação...");
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const user = await servicoGestaoPerfil.getOwnProfile();
        
        // Adicionar uma senha simulada ao objeto de usuário
        const userComSenha = {
            ...user,
            password: 'password_simulada'
        };

        const simulatedResponse = {
            token: 'simulated-email-jwt-token',
            user: userComSenha
        };

        console.log("Simulated Email/Senha Auth: Autenticação bem-sucedida.");
        return simulatedResponse;
    }
}

// --- Service Selection ---
let servicoSelecionado: IServicoEmailSenhaAuth;

if (config.VITE_APP_ENV === 'simulation') {
    console.log("INFO: Usando MODO DE SIMULAÇÃO para o Serviço de Autenticação Email/Senha.");
    servicoSelecionado = new ServicoEmailSenhaAuthSimulado();
} else {
    console.log("INFO: Usando Serviço de Autenticação Email/Senha REAL (Produção).");
    servicoSelecionado = new ServicoEmailSenhaAuthReal();
}

export const servicoMetodoEmailSenha = servicoSelecionado;
