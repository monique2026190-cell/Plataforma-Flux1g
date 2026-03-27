
import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { servicoAutenticacao } from '../ServiçosFrontend/ServiçoDeAutenticação/Auth.Application';
const authService = servicoAutenticacao;
import { chatService } from '../ServiçosFrontend/ServiçoDeChat/chatService';
import { User } from '../types';

export const HookPesquisaGlobal = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const currentUserEmail = authService.getState().user?.email;

  // Efeito para buscar usuários com base no termo de pesquisa
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.trim().length > 0) {
        setLoading(true);
        try {
          // Temporariamente desabilitado até a implementação do backend para busca de usuários
          setUsers([]);
        } catch (error) {
          console.error("Search error", error);
          setUsers([]);
        } finally {
          setLoading(false);
        }
      } else {
        setUsers([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  // Memoiza os usuários enriquecidos para evitar recálculos desnecessários
  const enrichedUsers = useMemo(() => {
    return users.map(user => {
        const isMe = user.email === currentUserEmail;
        const canMessage = !isMe;

        return {
            ...user,
            isMe,
            canMessage,
        };
    });
  }, [users, currentUserEmail]);


  const handleProfileClick = (username: string) => {
    const cleanUsername = username.startsWith('@') ? username.substring(1) : username;
    navigate(`/user/${cleanUsername}`);
  };

  const handleMessageClick = (user: User) => {
    if (currentUserEmail && user.email) {
      const chatId = chatService.getPrivateChatId(currentUserEmail, user.email);
      navigate(`/chat/${chatId}`);
    }
  };

  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/messages');
    }
  };

  return {
    searchTerm,
    setSearchTerm,
    filteredUsers: enrichedUsers,
    loading,
    processingId,
    handleProfileClick,
    handleMessageClick,
    handleBack
  };
};
