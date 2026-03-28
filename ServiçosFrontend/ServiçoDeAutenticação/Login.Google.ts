
import VariaveisFrontend from '../Config/Variaveis.Frontend.js';
import { createServiceLogger } from '../SistemaObservabilidade/Log.Servicos.Frontend';
import { DadosProvider } from '../Infra/DadosProvider';

// Interface específica para os dados que este serviço manipula
export interface IUsuarioGoogle {
  googleId: string;
  nome: string;
  email: string;
  avatarUrl?: string; 
}

const logger = createServiceLogger('LoginGoogle');

class LoginGoogle {

  constructor() {
    logger.logInfo("Módulo inicializado.");
  }

  // A lógica de iniciar o login permanece a mesma
  public iniciarLogin(): void {
    const operation = 'iniciarLogin';
    logger.logOperationStart(operation);
    const googleClientId = VariaveisFrontend.googleClientId;

    if (!googleClientId || googleClientId === 'CHAVE_NAO_DEFINIDA') {
      const error = new Error("A 'googleClientId' não está configurada.");
      logger.logOperationError(operation, error);
      alert("A autenticação com Google não está configurada corretamente.");
      return;
    }

    const redirectUri = `${window.location.origin}/auth/google/callback`;
    const scope = 'openid profile email';
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    const nonce = Math.random().toString(36).substring(2, 15);

    authUrl.searchParams.append('client_id', googleClientId);
    authUrl.searchParams.append('redirect_uri', redirectUri);
    authUrl.searchParams.append('response_type', 'id_token');
    authUrl.searchParams.append('scope', scope);
    authUrl.searchParams.append('nonce', nonce);

    window.location.href = authUrl.toString();
  }

  public async processarCallback(idToken: string): Promise<any> {
    const operation = 'processarCallback';
    logger.logOperationStart(operation);

    // SIMULAÇÃO: Obtenção dos dados do usuário a partir do token
    const dadosSimuladosDoGoogle: IUsuarioGoogle = {
      nome: "Usuário Simulado Google",
      email: "simulado.google@example.com",
      googleId: `google_${new Date().getTime()}`,
      avatarUrl: "https://lh3.googleusercontent.com/a/default-user=s96-c",
    };

    logger.logInfo("Dados do Google obtidos, delegando para o DadosProvider.");

    // Delega toda a lógica (validação + chamada de infra) para o DadosProvider
    try {
      const resultado = await DadosProvider.lidarComLoginSocial({
        ...dadosSimuladosDoGoogle,
        tokenProvider: idToken,
      });
      logger.logOperationSuccess(operation, resultado);
      return resultado;
    } catch (error: any) {
      logger.logOperationError(operation, error);
      throw error; // Re-lança para a UI tratar
    }
  }
}

export const loginGoogle = new LoginGoogle();
