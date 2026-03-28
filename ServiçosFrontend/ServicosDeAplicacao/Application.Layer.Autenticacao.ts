
import { createApplicationServiceLogger } from '../SistemaObservabilidade/Log.Aplication';
import { servicoAutenticacao, LoginEmailParams } from '../ServiçoDeAutenticação/Auth.Application';
import { LoginUseCase } from '../UseCases/Login.usecase';
import { LogoutUseCase } from '../UseCases/Logout.usecase';
import { IniciarLoginComGoogleUseCase } from '../UseCases/IniciarLoginComGoogle.usecase';
import { FinalizarLoginComGoogleUseCase } from '../UseCases/FinalizarLoginComGoogle.usecase';
// Importa o novo gerenciador de estado
import { authStateManager } from '../Estados/Manager.Estado.Autenticacao';

const appServiceLogger = createApplicationServiceLogger('AuthApplicationService');

class AuthApplicationService {
  // Casos de Uso permanecem os mesmos
  private loginUseCase: LoginUseCase;
  private logoutUseCase: LogoutUseCase;
  private iniciarLoginComGoogleUseCase: IniciarLoginComGoogleUseCase;
  private finalizarLoginComGoogleUseCase: FinalizarLoginComGoogleUseCase;

  constructor() {
    this.loginUseCase = new LoginUseCase(servicoAutenticacao);
    this.logoutUseCase = new LogoutUseCase(servicoAutenticacao);
    this.iniciarLoginComGoogleUseCase = new IniciarLoginComGoogleUseCase(servicoAutenticacao);
    this.finalizarLoginComGoogleUseCase = new FinalizarLoginComGoogleUseCase(servicoAutenticacao);

    // Medida de transição: Sincroniza o estado do serviço legado com o novo state manager.
    servicoAutenticacao.subscribe((legacyState) => {
        authStateManager.setState({
            autenticado: legacyState.autenticado,
            usuario: legacyState.usuario,
            token: legacyState.token
        });
    });

    appServiceLogger.logOperationStart('constructor');
  }

  // --- MÉTODOS PÚBLICOS ---

  async loginComEmail(params: LoginEmailParams) {
    appServiceLogger.logOperationStart('loginComEmail', { email: params.email });
    authStateManager.setState({ processando: true, erro: null });
    try {
      await this.loginUseCase.execute(params);
      authStateManager.setState({ processando: false });
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao fazer login';
      appServiceLogger.logOperationError('loginComEmail', err, { email: params.email });
      authStateManager.setState({ erro: errorMessage, processando: false });
      throw new Error(errorMessage);
    }
  }

  async logout() {
    appServiceLogger.logOperationStart('logout');
    await this.logoutUseCase.execute();
  }

  async iniciarLoginComGoogle() {
    appServiceLogger.logOperationStart('iniciarLoginComGoogle');
    authStateManager.setState({ processando: true, erro: null });
    try {
      await this.iniciarLoginComGoogleUseCase.execute();
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao iniciar login com Google';
      appServiceLogger.logOperationError('iniciarLoginComGoogle', err);
      authStateManager.setState({ erro: errorMessage, processando: false });
    }
  }

  async finalizarLoginComGoogle(idToken: string) {
    appServiceLogger.logOperationStart('finalizarLoginComGoogle');
    authStateManager.setState({ processando: true, erro: null });
    try {
      await this.finalizarLoginComGoogleUseCase.execute(idToken);
      authStateManager.setState({ processando: false });
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao finalizar login com Google';
      appServiceLogger.logOperationError('finalizarLoginComGoogle', err);
      authStateManager.setState({ erro: errorMessage, processando: false });
    }
  }
}

export const servicoDeAplicacaoDeAutenticacao = new AuthApplicationService();
