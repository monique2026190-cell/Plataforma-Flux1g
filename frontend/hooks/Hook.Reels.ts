
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Reel, Comment, User } from '../types';


const IS_SIMULATING = localStorage.getItem('isSimulating') === 'true';

export const useReels = () => {
    const navigate = useNavigate();
    const [reels, setReels] = useState<Reel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    // Estados para o painel de comentários
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
    const [activeReelId, setActiveReelId] = useState<string | null>(null);
    const [currentComments, setCurrentComments] = useState<Comment[]>([]);
    const [commentText, setCommentText] = useState("");
    const [replyingTo, setReplyingTo] = useState<{ id: string, username: string } | null>(null);

    useEffect(() => {
        const user = authService.getCurrentUser();
        setCurrentUser(user);
        loadReels();
    }, []);

    const loadReels = useCallback(async () => {
        setIsLoading(true);
        try {
            if (IS_SIMULATING) {
                const response = await fetch('/api/reels');
                if (!response.ok) throw new Error('Falha ao buscar reels simulados.');
                const data = await response.json();
                const fetchedReels = data.map((reel: any) => ({
                    ...reel,
                    author: { ...reel.author, displayName: reel.author.name, avatarUrl: reel.author.avatar },
                    likesCount: reel.likes, 
                    commentsCount: reel.comments.length, 
                    commentsList: reel.comments, // Usando os comentários da simulação
                    isLiked: false, // Estado inicial
                    sharesCount: 0,
                }));
                setReels(fetchedReels);
            } else {
                console.warn('Modo de produção para Reels não implementado.');
                setReels([]);
            }
        } catch (err: any) {
            setError(err.message || 'Falha ao carregar os reels.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // --- INTERAÇÕES COM REELS ---
    const handleLike = useCallback((reelId: string) => {
        setReels(prev => prev.map(r => r.id === reelId ? { ...r, isLiked: !r.isLiked, likesCount: r.isLiked ? r.likesCount - 1 : r.likesCount + 1 } : r));
    }, []);

    const handleShare = (reelId: string) => console.log(`Compartilhar reel: ${reelId}`);
    const handleSave = (reelId: string) => console.log(`Salvar reel: ${reelId}`);

    // --- INTERAÇÕES COM COMENTÁRIOS ---
    const handleCommentClick = useCallback((reelId: string) => {
        const reel = reels.find(r => r.id === reelId);
        if (reel) {
            setActiveReelId(reelId);
            setCurrentComments(reel.commentsList || []);
            setIsCommentModalOpen(true);
        }
    }, [reels]);

    const handleSendComment = useCallback(() => {
        if (!commentText.trim() || !activeReelId || !currentUser) return;

        const newComment: Comment = {
            id: `comment-${Date.now()}`,
            text: commentText,
            author: currentUser,
            likes: 0,
            replies: [],
            timestamp: new Date().toISOString(),
        };

        setReels(prevReels => prevReels.map(reel => {
            if (reel.id === activeReelId) {
                const updatedComments = [newComment, ...reel.commentsList];
                setCurrentComments(updatedComments); // Atualiza o estado dos comentários visíveis
                return { ...reel, commentsList: updatedComments, commentsCount: updatedComments.length };
            }
            return reel;
        }));

        setCommentText("");
        setReplyingTo(null);
    }, [commentText, activeReelId, currentUser]);

    const handleLikeComment = (commentId: string) => {
        const updatedComments = currentComments.map(c => c.id === commentId ? { ...c, likes: c.likes + 1 } : c);
        setCurrentComments(updatedComments);
    };

    const handleDeleteComment = (commentId: string) => {
        const updatedComments = currentComments.filter(c => c.id !== commentId);
        setCurrentComments(updatedComments);
        setReels(prev => prev.map(r => r.id === activeReelId ? { ...r, commentsList: updatedComments, commentsCount: updatedComments.length } : r));
    };

    const handleReplyClick = (id: string, username: string) => setReplyingTo({ id, username });
    const handleCancelReply = () => setReplyingTo(null);
    const handleUserClickInComments = (username: string) => navigate(`/profile/${username}`);
    
    const closeCommentPanel = () => {
        setIsCommentModalOpen(false);
        setActiveReelId(null);
        setCurrentComments([]);
        setReplyingTo(null);
    };

    return {
        reels, isLoading, error, currentUser, navigate,
        handleLike, handleShare, handleSave,
        // Props do painel de comentários
        isCommentModalOpen, 
        currentComments,
        commentText, 
        replyingTo,
        setCommentText, 
        handleCommentClick,
        handleSendComment,
        handleLikeComment,
        handleDeleteComment,
        handleReplyClick,
        handleCancelReply,
        handleUserClickInComments,
        closeCommentPanel
    };
};
