
import { createServiceLogger } from '../SistemaObservabilidade/Log.Servicos.Frontend';
import { Usuario } from '../../../types/Saida/Types.Estrutura.Usuario';
import authApi from '../APIs/API.Sistema.Autenticacao.Supremo';
import ClienteBackend from '../Cliente.Backend';
import { config } from '../ValidaçãoDeAmbiente/config';

interface User extends Usuario {}

const log = createServiceLogger('Servico.Gestao.Sessao');

const realSessionService = {
    /**
     * Obtém o usuário atualmente logado do localStorage.
     */
    getCurrentUser: (): User | null => {
        const operation = 'getCurrentUser';
        try {
            const item = localStorage.getItem('user');
            return item ? JSON.parse(item) : null;
        } catch (error) {
            log.logOperationError(operation, error);
            return null;
        }
    },

    /**
     * Valida o token de sessão atual com o backend.
     */
    validateSession: async (signal: AbortSignal): Promise<User | null> => {
        const token = localStorage.getItem('userToken');
        if (!token) return null;
        ClienteBackend.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
            const { data } = await authApi.validateToken();
            if (signal.aborted) throw new DOMException('Aborted', 'AbortError');
            const user = data.user;
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        } catch (error: any) {
            if (!signal.aborted) {
                localStorage.removeItem('userToken');
                localStorage.removeItem('user');
                delete ClienteBackend.defaults.headers.common['Authorization'];
            }
            throw error;
        }
    },

    /**
     * Resolve uma sessão de login a partir de um ID de sessão (ex: do callback do Google).
     */
    resolverRedirecionamentoLogin: async (sessionId: string) => {
        const operation = 'resolverRedirecionamentoLogin';
        try {
            const { data } = await authApi.resolverSessaoLogin(sessionId);
            const { token, user, redirect } = data;

            localStorage.setItem('userToken', token);
            localStorage.setItem('user', JSON.stringify(user));
            ClienteBackend.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            window.dispatchEvent(new Event('authChange'));
            
            return redirect;

        } catch (error) {
            log.logOperationError(operation, error, { sessionId });
            localStorage.removeItem('userToken');
            localStorage.removeItem('user');
            window.dispatchEvent(new Event('authChange'));
            throw error;
        }
    },
};

// Serviço simulado permanece o mesmo
const simulatedSessionService = {
    getCurrentUser: (): User | null => {
        try {
            const item = localStorage.getItem('user');
            return item ? JSON.parse(item) : null;
        } catch { return null; }
    },
    validateSession: (signal: AbortSignal): Promise<User | null> => {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => resolve(simulatedSessionService.getCurrentUser()), 300);
            signal.addEventListener('abort', () => {
                clearTimeout(timeout);
                reject(new DOMException('Aborted', 'AbortError'));
            });
        });
    },
    resolverRedirecionamentoLogin: async (sessionId: string) => {
        console.log('Simulando resolução de sessão com ID:', sessionId);
        await new Promise(res => setTimeout(res, 1000));
        const fakeUser = { id: 'simulated-123', nome: 'Usuário Simulado', email: 'simulado@flux.com', completeProfile: true };
        localStorage.setItem('userToken', 'simulated-token');
        localStorage.setItem('user', JSON.stringify(fakeUser));
        window.dispatchEvent(new Event('authChange'));
        return { type: 'feed' };
    }
};

export const servicoGestaoSessao = config.VITE_APP_ENV === 'simulation' 
    ? simulatedSessionService 
    : realSessionService;
