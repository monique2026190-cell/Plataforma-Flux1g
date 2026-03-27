
import { IUsuario } from './Processo.Login';

const AUTH_TOKEN_KEY = 'auth_token';
const AUTH_USER_KEY = 'auth_user';

/**
 * @file Auth.Storage.ts
 * @description Módulo para gerenciar o armazenamento e a recuperação
 * de dados de sessão (token e usuário) no localStorage.
 */
export const AuthStorage = {
  /**
   * Salva o token de autenticação e os dados do usuário no localStorage.
   * @param token O token JWT.
   * @param usuario O objeto do usuário.
   */
  salvarSessao(token: string, usuario: IUsuario): void {
    try {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(usuario));
      console.log("STORAGE: Sessão salva no localStorage.");
    } catch (error) {
      console.error("STORAGE: Erro ao salvar a sessão no localStorage.", error);
    }
  },

  /**
   * Carrega o token e os dados do usuário a partir do localStorage.
   * @returns Um objeto com token e usuário, ou null se não houver dados.
   */
  carregarSessao(): { token: string; usuario: IUsuario } | null {
    try {
      const token = localStorage.getItem(AUTH_TOKEN_KEY);
      const usuarioString = localStorage.getItem(AUTH_USER_KEY);

      if (token && usuarioString) {
        const usuario: IUsuario = JSON.parse(usuarioString);
        console.log("STORAGE: Sessão carregada do localStorage.", { token, usuario });
        return { token, usuario };
      }

      console.log("STORAGE: Nenhuma sessão encontrada no localStorage.");
      return null;
    } catch (error) {
      console.error("STORAGE: Erro ao carregar a sessão do localStorage.", error);
      // Limpa dados potencialmente corrompidos
      this.limparSessao();
      return null;
    }
  },

  /**
   * Remove o token e os dados do usuário do localStorage.
   */
  limparSessao(): void {
    try {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      localStorage.removeItem(AUTH_USER_KEY);
      console.log("STORAGE: Sessão removida do localStorage.");
    } catch (error) {
      console.error("STORAGE: Erro ao remover a sessão do localStorage.", error);
    }
  }
};
