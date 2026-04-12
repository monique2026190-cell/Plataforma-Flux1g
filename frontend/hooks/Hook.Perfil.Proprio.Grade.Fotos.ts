
import { useState, useEffect } from 'react';
import { feedPublicationService as ServiçoPublicacaoFeed } from '../ServiçosFrontend/ServiçosDePublicações/Servico.Publicacao.Feed';

export const usePerfilProprioGradeFotos = (userId: string) => {
  const [fotos, setFotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchFotos = async () => {
      try {
        setLoading(true);
        const todosOsPosts = await ServiçoPublicacaoFeed.getPosts(); 
        const fotosDoUsuario = todosOsPosts.filter(post => post.tipo === 'foto' && post.userId === userId);
        setFotos(fotosDoUsuario);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchFotos();
    }
  }, [userId]);

  return { fotos, loading, error };
};
