
import { useQuery } from '@tanstack/react-query';
import { SistemaGrupoSupremo } from '../ServiçosFrontend/ServiçoDeGrupos/Sistema.Grupo.Supremo';
import { getInstanciaSuprema } from '../ServiçosFrontend/ServiçoDeAutenticação/Sistema.Autenticacao.Supremo';
const authService = getInstanciaSuprema();

export const HookTopGrupos = () => {
  const userId = authService.getState().user?.id;

  const fetchTopGroups = async () => {
    if (!userId) {
      return [];
    }
    const groups = await SistemaGrupoSupremo.getTopGroups(userId);
    return groups;
  };

  const { data: groups, isLoading, error } = useQuery({
    queryKey: ['topGroups', userId],
    queryFn: fetchTopGroups,
    enabled: !!userId, 
  });

  return {
    groups: groups || [],
    isLoading,
    error,
  };
};
