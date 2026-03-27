
import { Usuario } from '../../../types/Saida/Types.Estrutura.Usuario';
import { jwtDecode } from 'jwt-decode';

const TOKEN_KEY = 'flux_token';
const USER_KEY = 'flux_user';

export class AuthSession {
  public iniciarSessao(token: string, user: Usuario): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public encerrarSessao(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  public getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  public getCurrentUser(): Usuario | null {
    const userJson = localStorage.getItem(USER_KEY);
    if (userJson) {
      return JSON.parse(userJson);
    }
    return null;
  }

  public atualizarUsuarioSessao(user: Usuario): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public finalizaLoginComToken(token: string): { user: Usuario, isNewUser: boolean } {
    const decodedToken: any = jwtDecode(token);
    const user = decodedToken.user;
    const isNewUser = decodedToken.isNewUser || false;

    if (!user) {
        throw new Error("Token inválido: informações do usuário não encontradas.");
    }

    this.iniciarSessao(token, user);

    if (isNewUser) {
        sessionStorage.setItem('flux_is_new_user', 'true');
    }

    return { user, isNewUser };
  }
}
