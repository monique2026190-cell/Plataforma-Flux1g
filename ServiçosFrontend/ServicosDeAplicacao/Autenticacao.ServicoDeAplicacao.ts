
import { servicoAutenticacao, AuthState } from '../ServiçoDeAutenticação/Sistema.Autenticacao.Supremo';
import { createApplicationServiceLogger } from '../SistemaObservabilidade/Log.Aplication';
import { ILoginEmailParams } from '../Contratos/Contrato.Autenticacao';

const appServiceLogger = createApplicationServiceLogger('Autenticacao.ServicoDeAplicacao');

// Define o tipo de estado que a camada de aplicação vai expor
export interface AuthApplicationState extends AuthState {
  postLoginAction?: 'navigateToFeed' | 'navigateToCompleteProfile';
}

class AuthApplicationService {
  private state: AuthApplicationState;
  private listeners: ((state: AuthApplicationState) => void)[] = [];

  constructor() {
    // Inicializa o estado e se inscreve nas mudanças do serviço de autenticação
    this.state = servicoAutenticacao.getState();
    servicoAutenticacao.subscribe(this.handleAuthChange.bind(this));
  }

  private handleAuthChange(newAuthState: AuthState) {
    const wasJustAuthenticated = !this.state.isAuthenticated && newAuthState.isAuthenticated;
    let postLoginAction: AuthApplicationState['postLoginAction'] | undefined = undefined;

    // LÓGICA CENTRAL: Decide a ação de pós-login
    if (wasJustAuthenticated) {
      appServiceLogger.logOperationSuccess('login', { userId: newAuthState.user?.id, isNew: newAuthState.isNewUser });
      if (newAuthState.isNewUser) {
        postLoginAction = 'navigateToCompleteProfile';
      } else {
        postLoginAction = 'navigateToFeed';
      }
    }
    
    this.updateState({ ...newAuthState, postLoginAction });
  }

  private updateState(newState: AuthApplicationState) {
    this.state = newState;
    this.listeners.forEach(listener => listener(this.state));
    // Limpa a ação de pós-login depois de notificar os listeners para que não seja executada novamente
    if (this.state.postLoginAction) {
      this.state.postLoginAction = undefined;
    }
  }

  // Métodos de ação que delegam para o serviço de autenticação
  async loginComEmail(params: ILoginEmailParams) {
    const { email } = params;
    appServiceLogger.logOperationStart('loginComEmail', { email });
    try {
      await servicoAutenticacao.login(params);
      // A lógica de sucesso é tratada no handleAuthChange
    } catch (err: any) {
      appServiceLogger.logOperationError('loginComEmail', err, { email });
      throw err; // Re-throw para a UI, se necessário
    }
  }

  iniciarLoginComGoogle() {
    appServiceLogger.logOperationStart('iniciarLoginComGoogle');
    try {
        servicoAutenticacao.iniciarLoginComGoogle();
        appServiceLogger.logOperationSuccess('iniciarLoginComGoogle', { message: 'Redirecionamento para o Google iniciado.' });
    } catch (err: any) {
        appServiceLogger.logOperationError('iniciarLoginComGoogle', err);
        throw err;
    }
  }

  async logout() {
    appServiceLogger.logOperationStart('logout');
    try {
      await servicoAutenticacao.logout();
      appServiceLogger.logOperationSuccess('logout', { message: 'Logout bem-sucedido.' });
    } catch (err: any) {
      appServiceLogger.logOperationError('logout', err);
      throw err;
    }
  }

  // Métodos de observabilidade para a UI (hooks)
  subscribe(listener: (state: AuthApplicationState) => void): () => void {
    this.listeners.push(listener);
    // Notifica o novo listener com o estado atual
    listener(this.state);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  getState(): AuthApplicationState {
    return this.state;
  }
}

export const servicoDeAplicacaoDeAutenticacao = new AuthApplicationService();
