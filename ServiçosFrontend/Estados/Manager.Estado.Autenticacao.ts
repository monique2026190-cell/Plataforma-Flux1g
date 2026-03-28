
import { IUsuario } from "./Auth.Application";

// 1. DEFINIÇÃO DA INTERFACE DO ESTADO
export interface IAuthState {
    autenticado: boolean;
    usuario: IUsuario | null;
    token: string | null;
    processando: boolean;
    erro: string | null;
}

// 2. CLASSE DO GERENCIADOR DE ESTADO
class AuthStateManager {
    private state: IAuthState;
    private listeners: ((state: IAuthState) => void)[] = [];

    constructor() {
        // Define o estado inicial
        this.state = {
            autenticado: false,
            usuario: null,
            token: null,
            processando: false,
            erro: null,
        };
    }

    // Retorna uma cópia do estado atual
    public getState(): IAuthState {
        return { ...this.state };
    }

    // Atualiza o estado e notifica os listeners
    public setState(partialState: Partial<IAuthState>): void {
        this.state = { ...this.state, ...partialState };
        this.listeners.forEach(listener => listener(this.state));
    }

    // Se inscreve para receber atualizações do estado
    public subscribe(listener: (state: IAuthState) => void): () => void {
        this.listeners.push(listener);
        // Envia o estado atual imediatamente para o novo listener
        listener(this.state);
        // Retorna uma função para cancelar a inscrição
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }
}

// 3. INSTÂNCIA ÚNICA E EXPORTADA
export const authStateManager = new AuthStateManager();
