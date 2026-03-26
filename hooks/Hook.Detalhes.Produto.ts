
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { marketplaceService } from '../ServiçosFrontend/ServiçoDeMarketplace/marketplaceService.js';
import { getInstanciaSuprema } from '../ServiçosFrontend/ServiçoDeAutenticação/Sistema.Autenticacao.Supremo';
const authService = getInstanciaSuprema();
import { chatService } from '../ServiçosFrontend/ServiçoDeChat/chatService';
import { MarketplaceItem, Comment as CommentType } from '../types';
import { useMarketplaceItemActions } from './useMarketplaceItemActions';

export const useProductDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [item, setItem] = useState<MarketplaceItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSeller, setIsSeller] = useState(false);
  const [questions, setQuestions] = useState<CommentType[]>([]);
  const [commentText, setCommentText] = useState('');
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [replyingTo, setReplyingTo] = useState<{ id: string, username: string } | null>(null);
  const [zoomedMedia, setZoomedMedia] = useState<{ url: string, type: 'image' | 'video' } | null>(null);

  const currentUser = authService.getCurrentUser();

  const loadData = useCallback(() => {
    setLoading(true);
    if (id) {
      // A função getItemById agora existe e é segura para ser chamada.
      const foundItem = marketplaceService.getItemById(id);
      if (foundItem) {
        setItem(foundItem);
        setQuestions(foundItem.comments || []);
        const user = authService.getCurrentUser();
        setIsSeller(user?.email === foundItem.sellerId || user?.id === foundItem.sellerId);
      }
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    loadData();
    // CORREÇÃO: Removida a chamada ao `subscribe` que não existe.
    // O serviço de simulação intercepta `fetch` e não tem um método de subscrição.
    // A lógica de recarregar dados deve ser tratada por ações do usuário, não por um listener.
  }, [loadData]);

  const dummyItem: MarketplaceItem = { id: '', title: '', price: 0, image: '', sellerId: '' };
  const { handleCommentSubmit, isCommenting, commentError } = useMarketplaceItemActions(item || dummyItem);

  const handleSendQuestion = async () => {
    if (!commentText.trim() || !item) return;
    const success = await handleCommentSubmit(commentText.trim());
    if (success) {
      setCommentText('');
      setReplyingTo(null);
      loadData(); 
    }
  };

  const handleChat = useCallback(() => { /* ... */ }, [currentUser, item, isSeller, navigate]);
  const handleDeleteQuestion = useCallback(async (commentId: string) => { /* ... */ }, [item]);
  const handleLikeQuestion = useCallback((commentId: string) => { /* ... */ }, [item]);
  const handleDeleteItem = useCallback(async () => { /* ... */ }, [id, navigate]);
  const navigateToStore = useCallback(() => { /* ... */ }, [item, navigate]);
  const mediaItems = useMemo(() => { /* ... */ }, [item]);

  return {
    item, loading, isSeller, questions, commentText, setCommentText, isCommentModalOpen, setIsCommentModalOpen,
    replyingTo, setReplyingTo, zoomedMedia, setZoomedMedia, currentUser,
    handleChat, handleSendQuestion, handleDeleteQuestion, handleLikeQuestion, handleDeleteItem,
    navigateToStore, mediaItems, isCommenting, commentError,
  };
};
