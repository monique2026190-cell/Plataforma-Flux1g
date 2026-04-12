
import { useState, useCallback } from 'react';
// CORREÇÃO: Importando o tipo de dados correto que o hook receberá.
import { PublicacaoFeed } from '../types/Saida/Types.Estrutura.Publicacao.Feed';
import { ServiçoPublicacaoComentariosFeed } from '../ServiçosFrontend/ServiçosDePublicações/ServiçoPublicaçãoComentáriosFeed.js';

// CORREÇÃO: A função agora aceita PublicacaoFeed como argumento.
export const HookAcoesPost = (post: PublicacaoFeed) => {
    // CORREÇÃO: PublicacaoFeed não tem a propriedade `liked`. Iniciamos como `false`.
    // A lógica para determinar se o usuário atual curtiu o post precisará ser gerenciada externamente.
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(post.likes);

    const [isCommenting, setIsCommenting] = useState(false);
    const [commentError, setCommentError] = useState<string | null>(null);
    // CORREÇÃO: `post.comments` é um array, então pegamos seu tamanho.
    const [commentsCount, setCommentsCount] = useState(post.comments.length);

    const handleLike = useCallback(async () => {
        const originalIsLiked = isLiked;
        setIsLiked(!originalIsLiked);
        setLikesCount(prev => prev + (!originalIsLiked ? 1 : -1));
        try {
            // A lógica de chamada da API de like deve ser implementada aqui ou no hook pai.
        } catch (error) {
            console.error("Falha ao atualizar o like:", error);
            setIsLiked(originalIsLiked);
            setLikesCount(prev => prev - (!originalIsLiked ? 1 : -1));
        }
    }, [isLiked, post.id]);

    const handleCommentSubmit = useCallback(async (commentText: string) => {
        if (!commentText.trim()) return false;

        setIsCommenting(true);
        setCommentError(null);

        try {
            const newComment = await ServiçoPublicacaoComentariosFeed.create(post.id, { content: commentText });
            
            setCommentsCount(prev => prev + 1);
            console.log("Comentário publicado com sucesso:", newComment);
            return true; 

        } catch (error: any) {
            console.error("Falha ao publicar o comentário:", error);
            setCommentError(error.message || "Erro ao comentar. Tente novamente.");
            return false; 
        } finally {
            setIsCommenting(false);
        }
    }, [post.id]);

    // A função de delete é recebida pelo hook pai, então não há lógica aqui.
    const handleDelete = useCallback(async () => {
        // A lógica de confirmação e chamada da API é gerenciada pelo HookDetalhesPost.
    }, [post.id]);

    return {
        isLiked,
        likesCount,
        commentsCount, 
        isCommenting,  
        commentError,  
        handleLike,
        handleDelete,
        handleCommentSubmit, 
    };
};
