
import { useState, useEffect, useCallback } from 'react';
import { Comentario } from '../tipos';
import { servicoAutenticacao } from '../ServiçosFrontend/ServiçoDeAutenticação/Auth.Application';
const authService = servicoAutenticacao;
// Corrigido: Usa importação nomeada para o objeto de serviço
import { ServiçoPublicacaoComentariosMarketplace } from '../ServiçosFrontend/ServiçosDePublicações/ServiçoPublicaçãoComentáriosMarketplace.js';

// Define uma interface local para erros para simplificar
interface ErrosComentario {
  geral?: string;
}

/**
 * Hook customizado para gerenciar a lógica de comentários para itens do Marketplace.
 * @param itemId O ID do item do marketplace.
 */
export const HookComentariosMarketplace = (itemId: string) => {
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ErrosComentario | null>(null);

  const carregarComentarios = useCallback(async () => {
    if (!itemId) return;
    setIsLoading(true);
    setError(null);
    try {
      // Corrigido: Usa o método `getAll` do serviço
      const commentsData = await ServiçoPublicacaoComentariosMarketplace.getAll(itemId);
      setComentarios(commentsData || []);
    } catch (err) {
      console.error("Falha ao buscar comentários do marketplace:", err);
      setError({ geral: (err as Error).message || 'Não foi possível carregar os comentários.' });
    } finally {
      setIsLoading(false);
    }
  }, [itemId]);

  useEffect(() => {
    carregarComentarios();
  }, [carregarComentarios]);

  /**
   * Cria um novo comentário para o item do marketplace.
   * @param texto O conteúdo do comentário.
   */
  const postarComentario = useCallback(async (texto: string) => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      setError({ geral: 'Você precisa estar logado para comentar.' });
      return;
    }

    setError(null);
    try {
      // Corrigido: Usa o método `create` com os argumentos corretos (itemId, { content: texto })
      const novoComentario = await ServiçoPublicacaoComentariosMarketplace.create(itemId, { content: texto });
      
      // Adiciona o novo comentário ao estado local para uma atualização rápida da UI
      setComentarios(prevComentarios => [...prevComentarios, novoComentario]);

    } catch (err) {
      console.error("Falha ao criar comentário no marketplace:", err);
      setError({ geral: (err as Error).message || 'Não foi possível postar o comentário.' });
    }
  }, [itemId]);

  return {
    comentarios,
    isLoading,
    error,
    carregarComentarios,
    postarComentario
  };
};
