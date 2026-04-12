
import { useState, useCallback } from 'react';
import { MarketplaceItem } from '../types';
import { ServiçoPublicacaoComentariosMarketplace } from '../ServiçosFrontend/ServiçosDePublicações/ServiçoPublicaçãoComentáriosMarketplace.js';

// O hook recebe um item do marketplace como argumento
export const useMarketplaceItemActions = (item: MarketplaceItem) => {

    // Estados para gerenciar o processo de comentar
    const [isCommenting, setIsCommenting] = useState(false);
    const [commentError, setCommentError] = useState<string | null>(null);
    // Poderíamos inicializar com item.commentsCount se esse campo existisse no tipo
    const [commentsCount, setCommentsCount] = useState(0); 

    // Função para lidar com a submissão de um novo comentário
    const handleCommentSubmit = useCallback(async (commentText: string) => {
        if (!commentText.trim()) return false;

        setIsCommenting(true);
        setCommentError(null);

        try {
            // Chama o serviço correto para criar um comentário no marketplace
            const newComment = await ServiçoPublicacaoComentariosMarketplace.create(item.id, { content: commentText });
            
            // Atualiza a contagem de comentários na UI em caso de sucesso
            setCommentsCount(prev => prev + 1);
            console.log("Comentário de marketplace publicado com sucesso:", newComment);
            return true; // Retorna sucesso para a UI

        } catch (error: any) {
            console.error("Falha ao publicar o comentário no marketplace:", error);
            setCommentError(error.message || "Erro ao comentar. Tente novamente.");
            return false; // Retorna falha para a UI
        } finally {
            setIsCommenting(false);
        }
    }, [item.id]); // A dependência é o ID do item

    // Ações de Like e Delete poderiam ser adicionadas aqui no futuro
    // const handleLike = useCallback(() => { ... });
    // const handleDelete = useCallback(() => { ... });

    return {
        commentsCount,
        isCommenting,
        commentError,
        handleCommentSubmit,
        // Exportaria handleLike, handleDelete, etc. aqui
    };
};
