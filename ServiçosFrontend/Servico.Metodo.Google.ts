class ServicoMetodoGoogle {
  async obterInformacoesDoUsuario(accessToken: string): Promise<any> {
    const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`);
    if (!response.ok) {
      throw new Error('Falha ao buscar informações do usuário no Google.');
    }
    return response.json();
  }
}

export const servicoMetodoGoogle = new ServicoMetodoGoogle();
