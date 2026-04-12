import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// CORREÇÃO: A importação do groupService foi removida.
// import { groupService } from '../ServiçosFrontend/ServiçoDeGrupos/groupService';
import { Group, GroupLink } from '../types';

export const HookGerenciarLinksGrupo = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [group, setGroup] = useState<Group | undefined>(undefined);
  
  // Form States
  const [newLinkName, setNewLinkName] = useState('');
  const [maxUses, setMaxUses] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  
  const [links, setLinks] = useState<GroupLink[]>([]);

  const loadGroupData = useCallback(() => {
      if (!id) {
        navigate('/groups');
        return;
      }
      // CORREÇÃO: Lógica de busca de grupo removida.
      console.error("Group service not available, cannot load group data.");
      navigate('/groups');
  }, [id, navigate]);

  useEffect(() => {
    loadGroupData();
  }, [loadGroupData]);

  const handleCreateLink = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newLinkName.trim() || !id) return;
      // CORREÇÃO: Lógica de criação de link removida.
      console.error("Group service not available, cannot create link.");
  };

  const handleDeleteLink = (linkId: string) => {
      if (window.confirm("Deseja excluir este link? O código deixará de funcionar.")) {
          if (id) {
            // CORREÇÃO: Lógica de exclusão de link removida (apenas UI).
            setLinks(prev => prev.filter(l => l.id !== linkId));
          }
      }
  };

  const handleCopyLink = (code: string) => {
      const url = `${window.location.origin}/#/groups?join=${code}`;
      navigator.clipboard.writeText(url);
      alert(`Link copiado para a área de transferência!`);
  };

  const formatDate = (dateString?: string) => {
      if (!dateString) return 'Nunca expira';
      return new Date(dateString).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  const handleBack = () => {
      if (window.history.state && window.history.state.idx > 0) {
          navigate(-1);
      } else {
          navigate(`/group-chat/${id}`);
      }
  };

  return {
    group,
    links,
    newLinkName,
    setNewLinkName,
    maxUses,
    setMaxUses,
    expiresAt,
    setExpiresAt,
    handleCreateLink,
    handleDeleteLink,
    handleCopyLink,
    handleBack,
    formatDate
  };
};