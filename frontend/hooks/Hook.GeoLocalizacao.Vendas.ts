
import { useState, useEffect } from 'react';

// A interface define a estrutura dos dados que o hook retornará.
interface GeoData {
  language: string;
  // Poderíamos adicionar countryCode, currency, etc. no futuro.
}

/**
 * Hook customizado para obter dados de geolocalização com base no IP do usuário.
 * Ele gerencia o estado de carregamento, erros e os dados obtidos.
 */
export const HookGeoLocalizacaoVendas = () => {
  const [geoData, setGeoData] = useState<GeoData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGeoData = async () => {
      try {
        setIsLoading(true);
        // 1. Chama o serviço para obter o idioma.
        // TODO: ServicoDeGeolocalizacao removido junto com SistemaADS
        // const language = await ServicoDeGeolocalizacao.obterIdiomaPorLocalizacao();
        const language = navigator.language || 'pt-BR';
        
        // 2. Armazena o idioma no estado.
        setGeoData({ language });
        setError(null);
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'Ocorreu um erro desconhecido.';
        setError(errorMessage);
        console.error("Erro no HookGeoLocalizacaoVendas:", errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGeoData();
  }, []); // O array de dependências vazio garante que a busca ocorra apenas uma vez.

  // 3. Retorna o estado para o componente que usar o hook.
  return { geoData, isLoading, error };
};
