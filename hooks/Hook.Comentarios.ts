
import { useState, useEffect, useCallback } from 'react';
import { Comentario, DadosCriacaoComentario, ErrosComentario } from '../tipos';
import { servicoAutenticacao } from '../ServiçosFrontend/ServiçoDeAutenticação/Auth.Application';
const authService = servicoAutenticacao;
// Presumindo a existência de um serviço para comentários, seguindo o padrão do projeto
import ServiçoComentarios from '../ServiçosFrontend/ServiçoDeComentários/index.js';

/**
 * Hook customizado para gerenciar a lógica de comentários de um post.
 * @param postId O ID do post para o qual os comentários serão gerenciados.
 */
export const useComments = (postId: string) => {
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ErrosComentario | null>(null);

  // Busca os comentários para o post especificado
  const fetchComments = useCallback(async () => {
    if (!postId) return;
    setIsLoading(true);
    setError(null);
    try {
      const commentsData = await ServiçoComentarios.buscarPorPostId(postId);
      setComentarios(commentsData);
    } catch (err) {
      console.error("Falha ao buscar comentários:", err);
      setError({ geral: (err as Error).message || 'Não foi possível carregar os comentários.' });
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  // Efeito para carregar os comentários quando o postId muda
  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  /**
   * Cria um novo comentário para o post.
   * @param dadosComentario Os dados para o novo comentário.
   */
  const handleCreateComment = useCallback(async (dadosComentario: Omit<DadosCriacaoComentario, 'postId'>) => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
        setError({ geral: 'Você precisa estar logado para comentar.' });
        return;
    }

    setError(null);
    try {
      const novoComentario = await ServiçoComentarios.criar({ ...dadosComentario, postId });
      
      // Adiciona o novo comentário ao estado local (atualização otimista)
      setComentarios(prevComentarios => [...prevComentarios, novoComentario]);

    } catch (err) {
      console.error("Falha ao criar comentário:", err);
      setError({ geral: (err as Error).message || 'Não foi possível postar o comentário.' });
      // Em um cenário real, poderíamos reverter a atualização otimista aqui
    }
  }, [postId]);

  return {
    comentarios,
    isLoading,
    error,
    fetchComments, // Expondo para permitir re-fetch manual (ex: pull-to-refresh)
    handleCreateComment
  };
};
