
import { useState, useEffect } from 'react';
import { ServiçoPublicacaoReels } from '../ServiçosFrontend/ServiçosDePublicações/Servico.Publicacao.Reels';

// Hook customizado para buscar os reels do perfil próprio, sem precisar de userId
export const usePerfilProprioGradeReels = () => {
  const [reels, setReels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchReels = async () => {
      try {
        setLoading(true);
        // O serviço getAll já identifica o usuário pelo token de autenticação
        const reelsDoServico = await ServiçoPublicacaoReels.getAll();
        // Garante que o estado seja sempre um array.
        if (Array.isArray(reelsDoServico)) {
            setReels(reelsDoServico);
        } else {
            // Se não for um array, define como um array vazio para evitar erros.
            setReels([]);
            console.warn('API não retornou um array de reels, o resultado foi:', reelsDoServico);
        }
      } catch (err: any) {
        console.error("Erro detalhado ao buscar reels:", err);
        setError(new Error(err.message || "Ocorreu um erro desconhecido."));
      } finally {
        setLoading(false);
      }
    };

    // Fetch é chamado uma vez quando o componente que usa o hook é montado
    fetchReels();

    // O array de dependências vazio assegura que o efeito rode apenas uma vez
  }, []);

  return { reels, loading, error };
};
