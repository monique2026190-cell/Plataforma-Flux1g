
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { servicoAutenticacao } from '../ServiçosFrontend/ServiçoDeAutenticação/Auth.Application';
const authService = servicoAutenticacao;
import { PublicacaoFeed } from '../types/Saida/Types.Estrutura.Publicacao.Feed';
import { HookAcoesPost } from './Hook.Acoes.Post';
import { feedPublicationService } from '../ServiçosFrontend/ServiçosDePublicações/Servico.Publicacao.Feed';

export const HookDetalhesPost = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [post, setPost] = useState<PublicacaoFeed | null>(null);
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState<{ id: string, username: string } | null>(null);

  const currentUser = authService.getCurrentUser();
  const currentUserId = currentUser?.id;

  const loadData = useCallback(async () => {
    if (id) {
      try {
        const foundPost = await feedPublicationService.getById(id);
        if (foundPost) {
          setPost(foundPost);
        } else {
          navigate('/feed');
        }
      } catch (error) {
        console.error("Falha ao buscar detalhes do post:", error);
        navigate('/feed');
      }
    }
  }, [id, navigate]);

  useEffect(() => {
    loadData();
  }, [id, loadData]);

  // Objeto dummyPost CORRIGIDO para alinhar com a interface PublicacaoFeed
  const dummyPost: PublicacaoFeed = {
    id: '',
    content: '',
    autor: { id: '', nome: '', avatarUrl: '' },
    createdAt: new Date(),
    likes: 0,
    shares: 0,
    media: [],
    comments: [],
  };

  const { handleCommentSubmit, isCommenting, commentError, handleLike, handleDelete } = HookAcoesPost(post || dummyPost);

  const handleSendComment = async () => {
    if (!commentText.trim() || !post || !currentUser) return;
    
    const success = await handleCommentSubmit(commentText.trim());
    
    if (success) {
        setCommentText('');
        setReplyingTo(null);
        loadData(); // Recarrega os dados do post para mostrar o novo comentário
    }
  };
  
  // Funções placeholder para ações futuras
  const handleDeleteComment = async (commentId: string) => { /* Lógica de exclusão de comentário */ };
  const handleCommentLike = (commentId: string) => { /* Lógica de curtir comentário */ };
  const handleVote = (optionIndex: number) => { /* Lógica de voto em enquete */ };

  return {
    post, 
    comments: post?.comments || [], // CORRIGIDO: de 'comentarios' para 'comments'
    commentText, 
    setCommentText, 
    replyingTo, 
    setReplyingTo, 
    currentUserId, 
    handleLike, 
    handleDelete, 
    handleSendComment, 
    handleDeleteComment, 
    handleCommentLike, 
    handleVote, 
    navigate,
    isCommenting, 
    commentError, 
  };
};
