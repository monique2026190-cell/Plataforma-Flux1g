
import { config } from '../ValidaçãoDeAmbiente/config';
import { Usuario } from '../../types/Saida/Types.Estrutura.Usuario';
<<<<<<< HEAD
=======
import { servicoGestaoPerfil } from './Servico.Gestao.Perfil';
import API_Metodo_Google from '../APIs/APIsServicoAutenticacao/API.Servico.Metodo.Google';
>>>>>>> b0b9412 (Projeto atualizado)

// Importa as implementações real e simulada
import * as APIGoogle from '../APIs/APIsServicoAutenticacao/API.Servico.Metodo.Google';
import * as SimulacaoGoogle from '../ServiçoDeSimulação/simulacoes/Simulacao.Servico.Metodo.Google';

/**
 * @file Módulo seletor que exporta a implementação da API de autenticação do Google (real ou simulada)
 * com base na configuração do ambiente.
 */

// --- Definição da Interface do Serviço ---
// Garante que ambas as implementações (real e simulada) sigam o mesmo contrato.
interface IServicoMetodoGoogle {
    redirectToGoogleAuth(): void;
    handleAuthCallback(code: string): Promise<{ token: string; user: Usuario | null, isNewUser?: boolean }>;
}

<<<<<<< HEAD
// --- Seleção da Implementação ---
let servicoMetodoGoogle: IServicoMetodoGoogle;
=======
// --- Real Implementation ---
class ServicoGoogleAuthReal implements IServicoGoogleAuth {
    async autenticar(): Promise<{ token: string; user: Usuario | null }> {
        console.log("Real Google Auth: Chamando API...");
        try {
            const response = await API_Metodo_Google.autenticar();
            console.log("Real Google Auth: Resposta da API recebida.");
            return response;
        } catch (error) {
            console.error("Real Google Auth: Erro ao autenticar via API.", error);
            throw error;
        }
    }
}

// --- Simulated Implementation ---
class ServicoGoogleAuthSimulado implements IServicoGoogleAuth {
    async autenticar(): Promise<{ token: string; user: Usuario | null }> {
        console.log("Simulated Google Auth: Iniciando autenticação simulada...");
        await new Promise(resolve => setTimeout(resolve, 500));
        
        try {
            const user = await servicoGestaoPerfil.getPublicProfileByUsername('usuariopadrao');
            const simulatedResponse = {
                token: 'simulated-google-jwt-token',
                user: user
            };
            console.log("Simulated Google Auth: Autenticação simulada bem-sucedida.");
            return simulatedResponse;
        } catch (error) {
            console.error("Simulated Google Auth: Erro na simulação.", error);
            throw error;
        }
    }
}

// --- Service Selection ---
let servicoSelecionado: IServicoGoogleAuth;
>>>>>>> b0b9412 (Projeto atualizado)

if (config.VITE_APP_ENV === 'simulation') {
    console.log("INFO: [Servico.Metodo.Google] Usando MODO DE SIMULAÇÃO.");
    servicoMetodoGoogle = SimulacaoGoogle;
} else {
    console.log("INFO: [Servico.Metodo.Google] Usando API REAL.");
    servicoMetodoGoogle = APIGoogle;
}

// --- Exportação do Serviço Selecionado ---
export default servicoMetodoGoogle;
