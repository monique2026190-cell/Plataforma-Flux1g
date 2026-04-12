
import { useState, useCallback } from 'react';
import { Reel } from '../types';
// CORREÇÃO DEFINITIVA: Corrigido o nome da variável importada para incluir 'ç' e 'ã'
import { ServiçoPublicaçãoComentáriosReels } from '../ServiçosFrontend/ServiçosDePublicações/ServiçoPublicaçãoComentáriosReels.js';

// O hook recebe um Reel como argumento
export const useReelActions = (reel: Reel) => {

    // Estados para gerenciar o processo de comentar
    const [isCommenting, setIsCommenting] = useState(false);
    const [commentError, setCommentError] = useState<string | null>(null);
    const [commentsCount, setCommentsCount] = useState(reel.commentsCount || 0);

    // Função para lidar com a submissão de um novo comentário
    const handleCommentSubmit = useCallback(async (commentText: string) => {
        if (!commentText.trim()) return false;

        setIsCommenting(true);
        setCommentError(null);

        try {
            // CORREÇÃO: Usando o nome correto da variável do serviço
            const newComment = await ServiçoPublicaçãoComentáriosReels.create(reel.id, { content: commentText });
            
            // Atualiza a contagem de comentários na UI em caso de sucesso
            setCommentsCount(prev => prev + 1);
            console.log("Comentário de Reel publicado com sucesso:", newComment);
            return true; // Retorna sucesso para a UI

        } catch (error: any) {
            console.error("Falha ao publicar o comentário no Reel:", error);
            setCommentError(error.message || "Erro ao comentar. Tente novamente.");
            return false; // Retorna falha para a UI
        } finally {
            setIsCommenting(false);
        }
    }, [reel.id]); // A dependência é o ID do Reel

    // Lógica para Likes e outras ações poderiam ser adicionadas aqui

    return {
        commentsCount,
        isCommenting,
        commentError,
        handleCommentSubmit,
    };
};
