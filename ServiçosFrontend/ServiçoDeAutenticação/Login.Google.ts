
import VariaveisFrontend from '../Config/Variaveis.Frontend.js';
import { createServiceLogger } from '../SistemaObservabilidade/Log.Servicos.Frontend';

// Interface para os dados de usuário obtidos do provedor social.
export interface IUsuarioSocial {
  googleId: string;
  nome: string;
  email: string;
  avatarUrl?: string;
}

const logger = createServiceLogger('LoginGoogle');

// Função auxiliar para decodificar um token JWT.
// NOTA: Isso NÃO valida a assinatura do token. A validação DEVE ocorrer no backend.
function decodeJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (e) {
    logger.logError("Falha ao decodificar o JWT", e);
    return null;
  }
}


class LoginGoogle {

  constructor() {
    logger.logInfo("Módulo de login com Google inicializado.");
  }

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
   * Processa o idToken do Google, decodificando-o para extrair os dados do usuário.
   * @param idToken O token JWT retornado pelo Google.
   * @returns Uma promessa que resolve com os dados do perfil do usuário do Google.
   */
  public async processarCallback(idToken: string): Promise<IUsuarioSocial> {
    const operation = 'processarCallback';
    logger.logOperationStart(operation);

    try {
      const payload = decodeJwt(idToken);
      if (!payload) {
        throw new Error("Token JWT inválido ou malformado.");
      }

      const dadosUsuarioGoogle: IUsuarioSocial = {
        nome: payload.name,
        email: payload.email,
        googleId: payload.sub, // 'sub' é o campo padrão do Google para o ID do usuário
        avatarUrl: payload.picture,
      };

      logger.logOperationSuccess(operation, { email: dadosUsuarioGoogle.email });
      return dadosUsuarioGoogle;

    } catch (error) {
      logger.logOperationError(operation, error as Error);
      throw error; // Propaga o erro para a camada de aplicação
    }
  }
}

export const loginGoogle = new LoginGoogle();
