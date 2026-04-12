
import { useState, useEffect } from 'react';
import { feedPublicationService as ServiçoPublicacaoFeed } from '../ServiçosFrontend/ServiçosDePublicações/Servico.Publicacao.Feed';
import { PublicacaoFeed } from '../types/Saida/Types.Estrutura.Publicacao.Feed';

export const usePerfilProprioGradePostagens = (userId: string) => {
  const [postagens, setPostagens] = useState<PublicacaoFeed[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPostagens = async () => {
      try {
        setLoading(true);
        const todosOsPosts = await ServiçoPublicacaoFeed.getPosts();
        // Corrigido: Filtrar por autorId em vez de userId
        const postagensDoUsuario = todosOsPosts.filter(post => post.autorId === userId);
        setPostagens(postagensDoUsuario);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchPostagens();
    }
  }, [userId]);

  return { postagens, loading, error };
};
