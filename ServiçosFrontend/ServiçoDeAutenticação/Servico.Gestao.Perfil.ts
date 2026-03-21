
import { config } from '../ValidaçãoDeAmbiente/config';
import { apiPerfilUsuario } from '../APIs/APIsServicoPerfil/API.Servico.Perfil.Usuario';
import { mockServicoPerfilUsuario } from '../ServiçoDeSimulação/simulacoes/Simulacao.Perfil.Usuario';
import { Usuario } from '../../types/Saida/Types.Estrutura.Usuario';

// --- Interface Comum ---
// Define a estrutura que tanto a implementação real quanto a simulada devem seguir.
export interface IServicoPerfilUsuario {
    getOwnProfile(): Promise<Usuario | null>;
    getPublicProfileByUsername(username: string): Promise<Usuario | null>;
    updateProfile(userId: string, profileData: Partial<Usuario>): Promise<Usuario | null>;
}

// --- Implementação Real ---
// Esta classe se comunica com a API real para buscar e manipular dados de perfil.
class ServicoPerfilUsuarioReal implements IServicoPerfilUsuario {
    async getOwnProfile(): Promise<Usuario | null> {
        try {
            return await apiPerfilUsuario.getOwnProfile();
        } catch (error) {
            console.error("Erro no serviço real ao buscar o perfil próprio:", error);
            return null;
        }
    }

    async getPublicProfileByUsername(username: string): Promise<Usuario | null> {
        try {
            return await apiPerfilUsuario.getPublicProfileByUsername(username);
        } catch (error) {
            console.error(`Erro no serviço real ao buscar o perfil de ${username}:`, error);
            return null;
        }
    }

    async updateProfile(userId: string, profileData: Partial<Usuario>): Promise<Usuario | null> {
        try {
            return await apiPerfilUsuario.updateProfile(userId, profileData);
        } catch (error) {
            console.error(`Erro no serviço real ao atualizar o perfil de ${userId}:`, error);
            return null;
        }
    }
}

// --- Seleção e Exportação ---
// Com base na configuração do ambiente, decidimos qual implementação usar.
let servicoSelecionado: IServicoPerfilUsuario;

if (config.VITE_APP_ENV === 'simulation') {
    console.log("INFO: Usando MODO DE SIMULAÇÃO para o Serviço de Perfil de Usuário.");
    servicoSelecionado = mockServicoPerfilUsuario as IServicoPerfilUsuario;
} else {
    console.log("INFO: Usando Serviço de Perfil de Usuário REAL (Produção).");
    servicoSelecionado = new ServicoPerfilUsuarioReal();
}

// Exporta a instância selecionada como um singleton para ser usado em todo o aplicativo.
export const servicoGestaoPerfil = servicoSelecionado;
