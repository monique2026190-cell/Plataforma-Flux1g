import { useState, useEffect, useCallback } from 'react';

/**
 * Hook para gerenciar as configurações de Meta Ads (Facebook Ads) de um grupo.
 *
 * @param {string} groupId - O ID do grupo para o qual as configurações serão gerenciadas.
 * @returns {object} O estado e as funções para interagir com as configurações de Meta Ads.
 * @property {string} pixelId - O ID do Pixel do Facebook.
 * @property {function} setPixelId - Função para atualizar o ID do Pixel.
 * @property {string} accessToken - O token de acesso para a API de conversões.
 * @property {function} setAccessToken - Função para atualizar o token de acesso.
 * @property {boolean} isLoading - Indica se uma operação (busca ou salvamento) está em andamento.
 * @property {Error | null} error - Armazena qualquer erro que ocorra durante as operações.
 * @property {function} salvarConfiguracoes - Função para salvar as credenciais de Meta Ads.
 * @property {function} carregarConfiguracoes - Função para carregar as credenciais de Meta Ads.
 */
export const useMetaAdsConfig = (groupId) => {
  const [pixelId, setPixelId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Carrega as credenciais de Meta Ads do backend.
   */
  const carregarConfiguracoes = useCallback(async () => {
    if (!groupId) return;

    setIsLoading(true);
    setError(null);
    try {
      // TODO: serviço de Meta ADS removido
      // const data = await servicoDeMetaAd.obterCredenciaisMeta(groupId);
    } catch (err) {
      console.error("Erro ao carregar credenciais Meta Ads:", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    carregarConfiguracoes();
  }, [carregarConfiguracoes]);

  /**
   * Salva as credenciais de Meta Ads no backend.
   */
  const salvarConfiguracoes = async () => {
    if (!groupId) {
        setError(new Error("ID do grupo não fornecido."));
        return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      // TODO: serviço de Meta ADS removido
      // await servicoDeMetaAd.salvarCredenciaisMeta(groupId, pixelId, accessToken);
    } catch (err) {
      console.error("Erro ao salvar credenciais Meta Ads:", err);
      setError(err);
      throw err; // Lança o erro para que o componente possa tratá-lo
    } finally {
      setIsLoading(false);
    }
  };

  return {
    pixelId,
    setPixelId,
    accessToken,
    setAccessToken,
    isLoading,
    error,
    salvarConfiguracoes,
    carregarConfiguracoes,
  };
};