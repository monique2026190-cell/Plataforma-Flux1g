
import { useState, useEffect } from 'react';
import { marketplacePublicationService as ServiçoPublicacaoMarketplace } from '../ServiçosFrontend/ServiçosDePublicações/Servico.Publicacao.Marketplace';
import { PublicacaoMarketplace } from '../types/Saida/Types.Estrutura.Publicacao.Marketplace';

export const usePerfilProprioGradeProdutos = (userId: string) => {
  const [produtos, setProdutos] = useState<PublicacaoMarketplace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        setLoading(true);
        const todosOsProdutos = await ServiçoPublicacaoMarketplace.getProducts();
        // Corrigido: Filtrar por usuarioId em vez de userId
        const produtosDoUsuario = todosOsProdutos.filter(produto => produto.usuarioId === userId);
        setProdutos(produtosDoUsuario);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchProdutos();
    }
  }, [userId]);

  return { produtos, loading, error };
};
