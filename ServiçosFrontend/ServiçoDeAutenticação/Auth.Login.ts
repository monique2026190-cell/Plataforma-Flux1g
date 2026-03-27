
import { LoginRequest, LoginResponse, GoogleLoginRequest, GoogleLoginResponse } from '../Contratos/Contrato.Autenticacao';
import { servicoGestaoLogin } from './Processo.Login';

export class AuthLogin {
  private gestaoLogin = servicoGestaoLogin;

  public async login(data: LoginRequest): Promise<LoginResponse> {
    return this.gestaoLogin.login(data);
  }

  public redirectToGoogle(): void {
    this.gestaoLogin.redirectToGoogle();
  }

  public async handleGoogleCallback(data: GoogleLoginRequest): Promise<GoogleLoginResponse> {
    return this.gestaoLogin.handleGoogleCallback(data.code, data.referredBy);
  }
}
