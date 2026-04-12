import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PublicacaoFeed } from '../types/Saida/Types.Estrutura.Publicacao.Feed';

/**
 * Hook para pesquisar Reels. A funcionalidade de busca está temporariamente desativada.
 */
export const HookPesquisaReels = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PublicacaoFeed[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // A lógica de busca foi removida temporariamente.
  // O hook agora retorna valores vazios/padrão.

  const handlePostClick = (postId: string) => {
    navigate(`/post/${postId}`);
  };

  return {
    query,
    setQuery,
    results,      // Sempre um array vazio
    isLoading,    // Sempre falso
    error,        // Sempre nulo
    handlePostClick
  };
};