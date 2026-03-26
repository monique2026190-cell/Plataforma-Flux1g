
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getInstanciaSuprema } from '../ServiçosFrontend/ServiçoDeAutenticação/Sistema.Autenticacao.Supremo';
const authService = getInstanciaSuprema();
import { Group } from '../types';

export const HookTopGruposPublicos = () => {
  const navigate = useNavigate();
  const [rankedGroups, setRankedGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  // A lógica de carregamento de dados foi simplificada, pois a fonte de dados original (simulação) foi removida.
  // TODO: Implementar a busca de dados de grupos públicos a partir do serviço de backend real.
  const loadData = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    try {
        // Por enquanto, apenas define um array vazio.
        setRankedGroups([]);
    } catch (e) {
        console.error("Erro ao carregar ranking público:", e);
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
      if (!currentUserId) return;
      
      const isMember = group.memberIds?.includes(currentUserId);
      if (isMember) {
          navigate(`/group-chat/${group.id}`);
      } else {
          navigate(`/group-landing/${group.id}`);
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
