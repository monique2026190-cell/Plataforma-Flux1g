
import { servicoAutenticacao } from '../ServiçoDeAutenticação/Auth.Application';

const authService = servicoAutenticacao;

const BASE_URL = 'http://localhost:3000/api/grupos';

export const servicoDeMetaAd = {
  async salvarCredenciaisMeta(groupId, pixelId, accessToken) {
    const token = authService.getToken();
    if (!token) throw new Error('Token de autenticação não encontrado');

    const response = await fetch(`${BASE_URL}/${groupId}/meta-ads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ pixelId, accessToken })
    });

    if (!response.ok) {
      throw new Error('Falha ao salvar as credenciais do Meta Ads');
    }

    return await response.json();
  },

  async obterCredenciaisMeta(groupId) {
    const token = authService.getToken();
    if (!token) throw new Error('Token de autenticação não encontrado');

    const response = await fetch(`${BASE_URL}/${groupId}/meta-ads`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null; // Não há credenciais salvas
      }
      throw new Error('Falha ao obter as credenciais do Meta Ads');
    }

    return await response.json();
  }
};
