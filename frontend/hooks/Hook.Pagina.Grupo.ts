
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Group } from '../types';

export const HookPaginaGrupo = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("ID do grupo não fornecido.");
      return;
    }

    const fetchGroupDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/groups/${id}`);
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: 'Grupo não encontrado ou erro na resposta da API' }));
          throw new Error(errorData.message);
        }

        const data: Group = await response.json();
        setGroup(data);

      } catch (e: any) {
        setError(e.message || 'Ocorreu um erro ao buscar os detalhes do grupo.');
        setGroup(null);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupDetails();
  }, [id]);

  const handleJoinAction = () => {
    alert(`Lógica para entrar no grupo ${group?.name} a ser implementada.`);
  };

  const handleBack = () => {
      navigate(-1); // Volta para a página anterior (o feed)
  };

  const isFull = group ? (group.memberCount || 0) >= (group.capacity || Infinity) : false;

  return {
    group,
    loading,
    error,
    isFull,
    handleJoinAction,
    handleBack
  };
};
