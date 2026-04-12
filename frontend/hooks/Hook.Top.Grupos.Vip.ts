
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { Group } from '../types';

export const HookTopGruposVip = () => {
  const navigate = useNavigate();
  const [rankedGroups, setRankedGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  // A lógica de carregamento de dados foi simplificada, pois a fonte de dados original (simulação) foi removida.
  // TODO: Implementar a busca de dados de grupos VIP a partir do serviço de backend real.
  const loadData = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
        // Por enquanto, apenas define um array vazio.
        setRankedGroups([]);
    } catch (e) {
        console.error("Erro ao carregar ranking VIP:", e);
    } finally {
        if (!isSilent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Carrega os dados na montagem do componente.
    // A inscrição no serviço de simulação foi removida.
    loadData();
  }, [loadData]);

  const handleGroupAction = useCallback((group: Group) => {
      const currentUserId = authService.getCurrentUserId();
      if (!currentUserId) {
          // Ação para usuário não logado, como navegar para a página de login.
          return;
      }
      const isMember = group.memberIds?.includes(currentUserId);
      if (isMember) {
          navigate(`/group-chat/${group.id}`);
      } else {
          navigate(`/vip-group-sales/${group.id}`);
      }
  }, [navigate]);

  const handleTabNavigation = (path: string) => navigate(path);

  const handleBack = () => navigate('/groups');

  return {
    rankedGroups,
    loading,
    handleGroupAction,
    handleTabNavigation,
    handleBack,
  };
};
