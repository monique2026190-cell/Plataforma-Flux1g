
import { Usuario } from '../../../types/Saida/Types.Estrutura.Usuario';

export interface AuthState {
  user: Usuario | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  isNewUser?: boolean;
}

export class AuthStateManager {
  private state: AuthState = {
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null,
    isNewUser: false,
  };

  private listeners: ((state: AuthState) => void)[] = [];

  public getState(): AuthState {
    return this.state;
  }

  public updateState(newState: Partial<AuthState>): void {
    this.state = { ...this.state, ...newState };
    this.listeners.forEach(listener => listener(this.state));
  }

  public subscribe(listener: (state: AuthState) => void): () => void {
    this.listeners.push(listener);
    listener(this.state);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }
}
