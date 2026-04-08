class ServicoSessao {
  private readonly CHAVE_TOKEN = 'auth_token';

  getToken(): string | null {
    return localStorage.getItem(this.CHAVE_TOKEN);
  }

  setToken(token: string): void {
    localStorage.setItem(this.CHAVE_TOKEN, token);
  }

  removeToken(): void {
    localStorage.removeItem(this.CHAVE_TOKEN);
  }
}

export const servicoSessao = new ServicoSessao();
