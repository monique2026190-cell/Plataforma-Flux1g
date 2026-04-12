
import React from 'react';
import CabecalhoNavegacao from "../Componentes/cabeçalhos/Cabecalho.Navegacao";
import { HookDetalhesPost } from "../hooks/Hook.Detalhes.Post";
import { ComentarioItem } from "../Componentes/ComponenteDeInterfaceDeUsuario/comments/Card.Comentario.Feed";
// CORREÇÃO FINAL: Revertendo para a importação padrão consistente
import ContainerFeedPadrao from "../Componentes/ComponentesDeFeed/Container.Feed.Padrao";
import { Comment as CommentType } from '../types';

export const PG_Detalhes_Post_Feed: React.FC = () => {
    const {
        post,
        comments,
        commentText,
        setCommentText,
        handleSendComment,
        handleLike,
        handleDelete,
        currentUserId,
        navigate,
        isCommenting,
        commentError,
    } = HookDetalhesPost();

    if (!post) {
        return (
            <div className="flex justify-center items-center h-screen bg-black text-white">
                <i className="fa-solid fa-circle-notch fa-spin text-2xl text-[#00c2ff]"></i>
            </div>
        );
    }

    const adaptComment = (comment: typeof post.comments[0]): CommentType => ({
        id: comment.id,
        userId: comment.author.id,
        username: comment.author.name,
        avatar: comment.author.avatarUrl || '',
        text: comment.content,
        timestamp: new Date(comment.createdAt).getTime(),
        likes: 0,
        likedByMe: false,
        replies: [],
    });

    return (
        <div className="bg-black min-h-screen text-white pt-[65px] pb-[80px]">
            <CabecalhoNavegacao titulo="Post" />

            <div className="p-4">
                <ContainerFeedPadrao 
                    post={post} 
                    onLike={() => handleLike(post.id)}
                    onDelete={(postId, e) => {
                        e.stopPropagation();
                        handleDelete(postId).then(success => {
                            if (success) navigate('/feed');
                        });
                    }}
                    onCommentClick={() => document.getElementById('comment-input')?.focus()}
                    onShare={() => { /* Lógica de compartilhamento */ }}
                    onUserClick={(username) => navigate(`/user/${username}`)}
                    currentUserId={currentUserId}
                />
                
                <div className="mt-8 pt-6 border-t border-gray-800">
                    <h2 className="text-xl font-bold text-white mb-5">Comentários ({comments.length})</h2>
                    <div className="space-y-4">
                        {comments.length > 0 ? (
                            comments.map(comment => (
                                <ComentarioItem 
                                    key={comment.id}
                                    comment={adaptComment(comment)} // Usando o adaptador
                                    onReplyClick={() => { /* Lógica de resposta */ }}
                                    onLike={() => { /* Lógica de curtir comentário */ }}
                                    onDelete={() => { /* Lógica de deletar comentário */ }}
                                    onUserClick={(username) => navigate(`/user/${username}`)}
                                    currentUserId={currentUserId}
                                />
                            ))
                        ) : (
                            <div className="text-center text-gray-500 py-10">
                                <i className="fa-regular fa-comments text-4xl mb-3"></i>
                                <p className="font-bold">Sem comentários ainda</p>
                                <p className="text-sm">Seja o primeiro a comentar!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Formulário de Comentário Fixo na Base */}
            <div className="fixed bottom-0 left-0 right-0 bg-[#101010] p-3 border-t border-white/10">
                <div className="flex items-center gap-2 max-w-lg mx-auto">
                    <input
                        id="comment-input"
                        type="text"
                        placeholder="Adicione um comentário..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !isCommenting && handleSendComment()}
                        className="w-full bg-[#000000] h-10 rounded-full text-white text-sm px-4 outline-none focus:ring-2 focus:ring-[#00c2ff]/50 border border-white/10"
                        disabled={isCommenting}
                    />
                    <button 
                        onClick={handleSendComment}
                        className="text-[#00c2ff] text-sm font-bold hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!commentText.trim() || isCommenting}
                    >
                        {isCommenting ? <i className="fa-solid fa-circle-notch fa-spin"></i> : 'Publicar'}
                    </button>
                </div>
                {commentError && <p className="text-red-500 text-xs text-center mt-1">{commentError}</p>}
            </div>
        </div>
    );
};
