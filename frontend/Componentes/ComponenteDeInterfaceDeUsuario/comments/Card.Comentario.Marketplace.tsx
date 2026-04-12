
import React, { useState, useRef, useEffect } from 'react';
import { Comment, ReplyingTo } from '../../../types';

const formatRelativeTime = (timestamp: any): string => {
    const now = new Date();
    const commentDate = new Date(timestamp);
    const diffInSeconds = Math.floor((now.getTime() - commentDate.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d`;
    
    return commentDate.toLocaleDateString();
};


// --- COMPONENTE DO CARD DE COMENTÁRIO (AGORA EXPORTADO) ---
export const CardComentarioMarketplace: React.FC<{
    comment: Comment;
    onReplyClick: (commentId: string, username: string) => void;
    onLike: (id: string) => void;
    onDelete: (id: string) => void;
    onUserClick: (username: string) => void;
    currentUserId?: string;
    depth?: number;
}> = ({ comment, onReplyClick, onLike, onDelete, onUserClick, currentUserId, depth = 0 }) => {
    const isOwner = comment.userId === currentUserId;
    const [isTextExpanded, setIsTextExpanded] = useState(false);
    const [showReplies, setShowReplies] = useState(false);
    const [visibleCount, setVisibleCount] = useState(3);

    const displayedText = comment.text.length > 120 && !isTextExpanded
        ? comment.text.slice(0, 120) + '...'
        : comment.text;

    const avatarSize = depth === 0 ? 'w-8 h-8' : 'w-6 h-6';
    const canShowReplies = depth === 0 && comment.replies && comment.replies.length > 0;
    const hasMoreReplies = comment.replies && visibleCount < comment.replies.length;

    const handleToggleReplies = () => {
        if (showReplies) {
            setShowReplies(false);
            setVisibleCount(3);
        } else {
            setShowReplies(true);
        }
    };

    const loadMoreReplies = () => {
        setVisibleCount(prev => prev + 3);
    };
    
    const handleLike = () => {
        onLike(comment.id);
    };

    const handleReply = () => {
        onReplyClick(comment.id, comment.username);
    };

    return (
        <div className={`flex flex-col animate-fade-in ${depth === 0 ? 'mb-6' : 'mb-3'}`}>
            <div className="flex gap-3 items-start relative z-10">
                <div className="flex-shrink-0 cursor-pointer" onClick={() => onUserClick(comment.username)}>
                    {comment.avatar ? (
                        <img src={comment.avatar} className={`${avatarSize} rounded-full object-cover border border-white/10`} alt={comment.username} />
                    ) : (
                        <div className={`${avatarSize} rounded-full bg-white/5 flex items-center justify-center text-[#00c2ff] border border-white/10`}>
                            <i className="fa-solid fa-user text-[10px]"></i>
                        </div>
                    )}
                </div>
                <div className="flex-grow min-w-0">
                    <div className="flex flex-col bg-white/[0.03] p-3 rounded-2xl border border-white/5">
                        <div className="flex items-center justify-between gap-2 mb-1">
                            <div className="flex items-center gap-1.5 min-w-0">
                                <span className="font-bold text-white text-[12px] cursor-pointer hover:text-[#00c2ff] truncate" onClick={() => onUserClick(comment.username)}>
                                    @{comment.username.replace(/^@/, '')}
                                </span>
                                {comment.replyToUsername && (
                                    <span className="text-[10px] text-gray-500 font-medium flex items-center gap-1 shrink-0">
                                        <i className="fa-solid fa-share text-[8px] opacity-40"></i>
                                        <span className="text-[#00c2ff]/60">@{comment.replyToUsername.replace(/^@/, '')}</span>
                                    </span>
                                )}
                            </div>
                            {isOwner && (
                                <button onClick={() => onDelete(comment.id)} className="text-gray-600 hover:text-red-500 transition-colors p-1">
                                    <i className="fa-solid fa-trash-can text-[10px]"></i>
                                </button>
                            )}
                        </div>
                        <p className="text-[13px] text-gray-200 leading-snug whitespace-pre-wrap break-words font-light">
                            {displayedText}
                            {comment.text.length > 120 && (
                                <button onClick={() => setIsTextExpanded(!isTextExpanded)} className="text-[#00c2ff] text-xs font-bold ml-1 hover:underline bg-transparent border-none cursor-pointer">
                                    {isTextExpanded ? 'Ver menos' : 'Ver mais'}
                                </button>
                            )}
                        </p>
                    </div>
                    <div className="flex items-center gap-5 mt-2 ml-2">
                        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">{formatRelativeTime(comment.timestamp)}</span>
                        <button className="text-[10px] font-black text-gray-500 hover:text-[#00c2ff] uppercase tracking-widest cursor-pointer" onClick={handleReply}>Responder</button>
                        <button className={`text-[10px] font-bold flex items-center gap-1.5 ml-auto transition-colors ${comment.likedByMe ? 'text-red-500' : 'text-gray-500 hover:text-white'}`} onClick={handleLike}>
                            <i className={`${comment.likedByMe ? 'fa-solid' : 'fa-regular'} fa-heart`}></i>
                            {comment.likes && comment.likes > 0 && <span>{comment.likes}</span>}
                        </button>
                    </div>
                </div>
            </div>
            {canShowReplies && (
                <div className="relative pl-11 mt-2">
                    <div className="absolute left-[15px] top-0 bottom-4 w-[1px] bg-white/5 rounded-full"></div>
                    {!showReplies ? (
                        <button onClick={handleToggleReplies} className="flex items-center gap-3 mt-2 group bg-transparent border-none p-0 cursor-pointer ml-[-4px]">
                            <div className="w-6 h-[1px] bg-white/10 group-hover:bg-[#00c2ff]/30"></div>
                            <span className="text-[10px] font-black text-gray-500 group-hover:text-gray-300 uppercase tracking-widest">Ver {comment.replies.length} {comment.replies.length === 1 ? 'resposta' : 'respostas'}</span>
                        </button>
                    ) : (
                        <>
                            <div className="flex flex-col">
                                {comment.replies.slice(0, visibleCount).map(reply => (
                                    <CardComentarioMarketplace key={reply.id} comment={reply} onReplyClick={onReplyClick} onLike={onLike} onDelete={onDelete} onUserClick={onUserClick} currentUserId={currentUserId} depth={1} />
                                ))}
                            </div>
                            <div className="flex items-center justify-between pr-2 mt-1">
                                {hasMoreReplies && (
                                    <button onClick={loadMoreReplies} className="text-[10px] font-black text-[#00c2ff] hover:text-white uppercase tracking-widest transition-colors py-2 flex items-center gap-2">
                                        <i className="fa-solid fa-plus-circle text-[12px]"></i> Ver mais respostas ({comment.replies.length - visibleCount})
                                    </button>
                                )}
                                <button onClick={handleToggleReplies} className="text-[9px] font-black text-gray-700 hover:text-gray-400 uppercase tracking-[2px] transition-colors py-2 ml-auto">Ocultar conversa</button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};


// --- COMPONENTE PRINCIPAL DO PAINEL ---
interface PainelComentariosMarketplaceProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    comments: Comment[];
    commentText: string;
    onCommentTextChange: (text: string) => void;
    onSend: () => void;
    onLike: (id: string) => void;
    onDelete: (id: string) => void;
    onUserClick: (username: string) => void;
    currentUserId?: string;
    replyingTo: ReplyingTo | null;
    onCancelReply: () => void;
    onReplyClick: (commentId: string, username: string) => void;
    placeholder: string;
    currentUserAvatar?: string;
}

export const PainelComentariosMarketplace: React.FC<PainelComentariosMarketplaceProps> = ({
    isOpen, onClose, title, comments, commentText, onCommentTextChange, onSend,
    onLike, onDelete, onUserClick, currentUserId, replyingTo, onCancelReply, onReplyClick, placeholder, currentUserAvatar
}) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen && replyingTo) {
            inputRef.current?.focus();
        }
    }, [isOpen, replyingTo]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 animate-fade-in-fast flex items-end" onClick={onClose}>
            <style>{`
                .comment-panel-animate { animation: slide-up 0.3s ease-out forwards; }
                @keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
            `}</style>
            <div className="bg-[#101010] w-full max-w-2xl mx-auto h-[85dvh] rounded-t-2xl flex flex-col comment-panel-animate" onClick={(e) => e.stopPropagation()}>
                <div className="text-center py-4 border-b border-white/10 relative">
                    <h3 className="font-bold text-sm">{title}</h3>
                    <button onClick={onClose} className="absolute top-1/2 -translate-y-1/2 right-4 text-2xl text-gray-500 hover:text-white">&times;</button>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    {comments.length > 0 ? (
                        comments.map(comment => (
                            <CardComentarioMarketplace key={comment.id} comment={comment} onReplyClick={onReplyClick} onLike={onLike} onDelete={onDelete} onUserClick={onUserClick} currentUserId={currentUserId} />
                        ))
                    ) : (
                        <div className="text-center text-gray-500 pt-16">
                            <i className="fa-regular fa-comments text-4xl mb-3"></i>
                            <p className="font-bold">Sem perguntas ainda</p>
                            <p className="text-xs">Seja o primeiro a fazer uma pergunta!</p>
                        </div>
                    )}
                </div>

                <div className="p-3 border-t border-white/10 space-y-2">
                    {replyingTo && (
                        <div className="text-xs text-gray-400 flex justify-between items-center px-2">
                            <span>Respondendo a <span className="text-[#00c2ff]">@{replyingTo.username}</span></span>
                            <button onClick={onCancelReply} className="font-bold hover:text-white">Cancelar</button>
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        {currentUserAvatar ? (
                           <img src={currentUserAvatar} alt="avatar" className="w-8 h-8 rounded-full" />
                        ) : (
                           <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#00c2ff] border border-white/10"><i className="fa-solid fa-user text-xs"></i></div>
                        )}
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder={placeholder}
                            value={commentText}
                            onChange={(e) => onCommentTextChange(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && onSend()}
                            className="w-full bg-[#000000] h-10 rounded-full text-white text-sm px-4 outline-none focus:ring-2 focus:ring-[#00c2ff]/50 border border-white/10"
                        />
                        <button onClick={onSend} className="text-[#00c2ff] text-sm font-bold hover:text-white disabled:opacity-50" disabled={!commentText.trim()}>Publicar</button>
                    </div>
                </div>
            </div>
        </div>
    );
};
