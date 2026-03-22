
import { useState, useEffect, useCallback } from 'react';
import { SistemaGrupoSupremo } from '../ServiçosFrontend/ServiçoDeGrupos/Sistema.Grupo.Supremo';
import { GroupRole } from '../tipos/types.Grupo';

// A interface Member, que pode ser movida para um arquivo de tipos mais tarde
interface Member {
    id: string;
    name: string;
    avatarUrl?: string;
    roleId: string | null;
}

export const useGrupoConfigCargosDistribuicao = (groupId: string | undefined) => {
    const [members, setMembers] = useState<Member[]>([]);
    const [roles, setRoles] = useState<GroupRole[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const fetchData = useCallback(async () => {
        if (!groupId) return;
        setLoading(true);
        setError(null);
        try {
            // Busca os dados em paralelo para otimizar o tempo de carregamento
            const [fetchedMembers, fetchedRoles] = await Promise.all([
                SistemaGrupoSupremo.getGroupMembers(groupId),
                SistemaGrupoSupremo.getGroupRoles(groupId),
            ]);
            setMembers(fetchedMembers);
            setRoles(fetchedRoles);
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'Erro desconhecido ao carregar dados.';
            setError(errorMessage);
            console.error("Falha ao buscar dados de distribuição:", errorMessage);
        } finally {
            setLoading(false);
        }
    }, [groupId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Função para atualizar o cargo de um membro localmente na UI
    const updateMemberRoleLocally = (memberId: string, roleId: string | null) => {
        setMembers(prevMembers =>
            prevMembers.map(member =>
                member.id === memberId ? { ...member, roleId } : member
            )
        );
    };

    // Função para persistir as alterações feitas
    const saveChanges = async () => {
        if (!groupId) return;
        setIsSaving(true);
        try {
            // O hook poderia ser mais inteligente e salvar apenas as alterações.
            // Por simplicidade, vamos iterar e salvar cada atribuição.
            const promises = members.map(member => 
                SistemaGrupoSupremo.assignRoleToMember(groupId, member.id, member.roleId)
            );
            await Promise.all(promises);
            // Opcional: Recarregar os dados para garantir consistência
            // await fetchData(); 
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'Falha ao salvar alterações.';
            setError(errorMessage);
            console.error("Falha ao salvar distribuição de cargos:", errorMessage);
            throw e; // Re-lança para a UI poder reagir
        } finally {
            setIsSaving(false);
        }
    };

    return {
        members,
        roles,
        loading,
        error,
        isSaving,
        updateMemberRole: updateMemberRoleLocally,
        saveChanges,
        refetchData: fetchData, // expor a função de recarregamento
    };
};
