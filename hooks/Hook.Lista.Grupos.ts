
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getInstanciaSuprema } from '../ServiçosFrontend/ServiçoDeAutenticação/Sistema.Autenticacao.Supremo';
const authService = getInstanciaSuprema();
import { servicoGestaoListaGrupo } from '../ServiçosFrontend/ServiçoDeGrupos/Servico.Gestao.Lista.Grupo';
import { Group } from '../tipos/types.Grupo';

export const HookListaGrupos = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [authState, setAuthState] = useState(authService.getState());

  // Inscreve-se nas mudanças de estado da autenticação
  useEffect(() => {
    const unsubscribe = authService.subscribe(setAuthState);
    return () => unsubscribe();
  }, []);

  const loadGroups = useCallback(async () => {
    // Garante que o loading comece apenas quando a busca é iniciada
    if (!loading) setLoading(true);
    try {
      const uniqueGroups = await servicoGestaoListaGrupo.obterGrupos();
      setGroups(uniqueGroups);
    } catch (error) {
      console.error("HookListaGrupos: Falha ao carregar grupos:", error);
      setGroups([]); // Reseta em caso de erro
    } finally {
      // Essencial: Finaliza o estado de loading independentemente do resultado
      setLoading(false);
    }
  }, [loading]); // Adicionado loading como dependência para evitar re-execuções desnecessárias

  // Reage às mudanças de estado de autenticação e ao estado de loading do authService
  useEffect(() => {
    const { user, loading: authLoading } = authState;

    // Se o serviço de autenticação ainda está carregando, o hook também espera.
    if (authLoading) {
        setLoading(true);
        return;
    }

    // Se o usuário está autenticado, carrega os grupos.
    if (user) {
      loadGroups();
    } else {
      // Se não há usuário e a autenticação já terminou, o usuário não está logado.
      setLoading(false);
      navigate('/');
    }
  }, [authState, loadGroups, navigate]);


  const navigateToGroup = (group: Group) => {
    const currentUserId = authState.user?.id;
    if (!currentUserId) return; // Segurança: não faz nada se não houver usuário

    const isCreator = group.creatorId === currentUserId;
    const isMember = (group.memberIds || []).includes(currentUserId);

    if (group.isSalesPlatformEnabled) {
      navigate(`/group-folder/${group.id}/main`);
    } else if (group.isHubModeEnabled) {
      navigate(`/group-sales-content/${group.id}`);
    } else if (isCreator || isMember) {
      navigate(`/group-chat/${group.id}`);
    } else if (group.isVip) {
      navigate(`/vip-group-sales/${group.id}`);
    } else {
      navigate(`/group-info-page/${group.id}`);
    }
  };

  const deleteGroup = async (groupId: string) => {
    try {
      await servicoGestaoListaGrupo.excluirGrupo(groupId);
      setGroups(prev => prev.filter(g => g.id !== groupId));
    } catch (error) {
      console.error(`HookListaGrupos: Falha ao deletar o grupo ${groupId}:`, error);
    }
  };

  const getUnreadCount = (groupId: string) => {
    return 0; // Placeholder
  };

  return {
    groups,
    loading,
    navigateToGroup,
    deleteGroup,
    getUnreadCount,
    navigate,
  };
};
