
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { servicoAutenticacao } from '../ServiçosFrontend/ServiçoDeAutenticação/Sistema.Autenticacao.Supremo';
import { listaGruposApplicationService } from '../ServiçosFrontend/ServicosDeAplicacao/ListaGrupos.ServicoDeAplicacao';
import { Group } from '../tipos/types.Grupo';

export const HookListaGrupos = () => {
  const navigate = useNavigate();
  const [state, setState] = useState(listaGruposApplicationService.getState());
  const currentUser = servicoAutenticacao.getCurrentUser();

  useEffect(() => {
    const unsubscribe = listaGruposApplicationService.subscribe(setState);
    listaGruposApplicationService.carregarGrupos();
    return () => unsubscribe();
  }, []);

  const navigateToGroup = (group: Group) => {
    const currentUserId = currentUser?.id;
    if (!currentUserId) return;

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

  const deleteGroup = (groupId: string) => {
    listaGruposApplicationService.deletarGrupo(groupId);
  };

  const getUnreadCount = (groupId: string) => {
    return 0; // Placeholder
  };

  return {
    groups: state.grupos,
    loading: state.loading,
    error: state.error,
    navigateToGroup,
    deleteGroup,
    getUnreadCount,
    navigate,
  };
};
