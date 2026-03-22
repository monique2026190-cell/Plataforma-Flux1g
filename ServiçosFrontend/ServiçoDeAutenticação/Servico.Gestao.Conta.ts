
import { Usuario } from '../../types/Saida/Types.Estrutura.Usuario';
import authApi from '../APIs/API.Sistema.Autenticacao.Supremo';
import { config } from '../ValidaçãoDeAmbiente/config';
import { servicoGestaoSessao } from './Servico.Gestao.Sessao';
import { LoginUsuarioDTO as CriarContaDTO } from '../../../types/Entrada/Dto.Estrutura.Usuario'; // Reutilizando DTO, pode ser ajustado

interface User extends Usuario {}

// --- Funções de Gestão de Conta ---

const completeProfile = async (profileData: Partial<Usuario>): Promise<User> => {
    const { data } = await authApi.updateProfile(profileData);
    if (data && data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
        return data.user;
    }
    throw new Error('Resposta de atualização de perfil inválida.');
};

const simulatedCompleteProfile = async (profileData: Partial<Usuario>): Promise<User> => {
    const currentUser = servicoGestaoSessao.getCurrentUser();
    if (!currentUser) throw new Error("Usuário não encontrado na simulação.");
    const updatedUser = { ...currentUser, ...profileData, perfilCompleto: true };
    await new Promise(resolve => setTimeout(resolve, 500));
    return updatedUser as User;
};

const criarConta = async (dados: CriarContaDTO) => {
    // TODO: Implementar a lógica de criação de conta que hoje está em 'Servico.Metodo.EmailSenha.ts'
    console.log("Função criarConta ainda não implementada.", dados);
    // Exemplo: return await authApi.register(dados);
    return null;
}

const excluirConta = async () => {
    // TODO: Implementar a lógica de exclusão de conta
    console.log("Função excluirConta ainda não implementada.");
    // Exemplo: return await authApi.deleteAccount();
    return null;
}

const alterarSenha = async (dados: {senhaAtual: string, novaSenha: string}) => {
    // TODO: Implementar a lógica de alteração de senha
    console.log("Função alterarSenha ainda não implementada.", dados);
    // Exemplo: return await authApi.changePassword(dados);
    return null;
}

const solicitarRedefinicaoSenha = async (email: string) => {
    // TODO: Implementar a lógica de solicitação de redefinição de senha
    console.log("Função solicitarRedefinicaoSenha ainda não implementada.", email);
     // Exemplo: return await authApi.requestPasswordReset(email);
    return null;
}

const redefinirSenha = async (dados: {token: string, novaSenha: string}) => {
    // TODO: Implementar a lógica de redefinição de senha
    console.log("Função redefinirSenha ainda não implementada.", dados);
    // Exemplo: return await authApi.resetPassword(dados);
    return null;
}


// --- Exportação do Serviço ---

const servicoGestaoContaReal = {
    completeProfile,
    criarConta,
    excluirConta,
    alterarSenha,
    solicitarRedefinicaoSenha,
    redefinirSenha,
};

const servicoGestaoContaSimulado = {
    completeProfile: simulatedCompleteProfile,
    criarConta, // TODO: Simular se necessário
    excluirConta, // TODO: Simular se necessário
    alterarSenha, // TODO: Simular se necessário
    solicitarRedefinicaoSenha, // TODO: Simular se necessário
    redefinirSenha, // TODO: Simular se necessário
};

export const servicoGestaoConta = config.VITE_APP_ENV === 'simulation'
    ? servicoGestaoContaSimulado
    : servicoGestaoContaReal;
