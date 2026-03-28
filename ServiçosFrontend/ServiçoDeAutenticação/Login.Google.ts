
import VariaveisFrontend from '../Config/Variaveis.Frontend.js';
import { createServiceLogger } from '../SistemaObservabilidade/Log.Servicos.Frontend';

// Interface para os dados de usuário obtidos do provedor social.
// Esta é a única informação que este módulo expõe.
export interface IUsuarioSocial {
  googleId: string;
  nome: string;
  email: string;
  avatarUrl?: string;
}

const logger = createServiceLogger('LoginGoogle');

class LoginGoogle {

  constructor() {
    logger.logInfo("Módulo de login com Google inicializado.");
  }

  // A lógica de iniciar o fluxo de login não muda.
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

  /**
   * Processa o callback do Google, validando o token e retornando os dados brutos do usuário.
   * Em uma aplicação real, aqui haveria uma chamada para decodificar e validar o idToken.
   * @param idToken O token JWT retornado pelo Google.
   * @returns Uma promessa que resolve com os dados do perfil do usuário do Google.
   */
  public async processarCallback(idToken: string): Promise<IUsuarioSocial> {
    const operation = 'processarCallback';
    logger.logOperationStart(operation, { tokenLength: idToken.length });

    // SIMULAÇÃO: Em um app real, você decodificaria o idToken para obter os dados.
    // A lógica de chamar o DadosProvider foi removida daqui.
    const dadosSimuladosDoGoogle: IUsuarioSocial = {
      nome: "Usuário Simulado Google",
      email: "simulado.google@example.com",
      googleId: `google_${new Date().getTime()}`,
      avatarUrl: "https://lh3.googleusercontent.com/a/default-user=s96-c",
    };

    logger.logOperationSuccess(operation, { email: dadosSimuladosDoGoogle.email });

    // Retorna apenas os dados brutos do usuário. A camada de aplicação decidirá o que fazer com eles.
    return dadosSimuladosDoGoogle;
  }
}

export const loginGoogle = new LoginGoogle();
