
import { processoGestaoConta, Usuario } from './Processo.Gestao.Conta';
import { PerfilUsuario } from '../Contratos/Contrato.Perfil.Usuario';

export class AuthAccount {
  private gestaoConta = processoGestaoConta;

  public async completeProfile(data: any, currentUser: Usuario | null): Promise<Usuario> {
    return this.gestaoConta.completeProfile(data, currentUser);
  }

  public async updateProfile(data: any, currentUser: Usuario | null): Promise<Usuario> {
    return this.gestaoConta.updateProfile(data, currentUser);
  }

  public async excluirConta(): Promise<void> {
    return this.gestaoConta.excluirConta();
  }

  public async getPublicProfileByUsername(username: string): Promise<PerfilUsuario | null> {
    return this.gestaoConta.getPublicProfileByUsername(username);
  }

  public async verifyCode(email: string, code: string, isReset: boolean = false): Promise<void> {
    return this.gestaoConta.verifyCode(email, code, isReset);
  }

  public async sendVerificationCode(email: string, context: 'verification' | 'reset' = 'verification'): Promise<void> {
    return this.gestaoConta.sendVerificationCode(email, context);
  }

  public async resetPassword(email: string, newPassword: string): Promise<void> {
    return this.gestaoConta.resetPassword(email, newPassword);
  }
}
