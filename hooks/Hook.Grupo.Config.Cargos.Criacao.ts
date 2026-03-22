
import { useState, useEffect, useCallback } from 'react';
import { SistemaGrupoSupremo } from '../ServiçosFrontend/ServiçoDeGrupos/Sistema.Grupo.Supremo';
import { GroupRole } from '../tipos/types.Grupo';

export const useGrupoConfigCargosCriacao = (groupId: string | undefined) => {
    const [roles, setRoles] = useState<GroupRole[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchRoles = useCallback(async () => {
        if (!groupId) return;
        setLoading(true);
        try {
            const fetchedRoles = await SistemaGrupoSupremo.getGroupRoles(groupId);
            setRoles(fetchedRoles);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Erro ao buscar cargos.');
        } finally {
            setLoading(false);
        }
    }, [groupId]);

    useEffect(() => {
        fetchRoles();
    }, [fetchRoles]);

    const addRole = async (roleData: { name: string; color: string }) => {
        if (!groupId) return;
        try {
            const newRole = await SistemaGrupoSupremo.createGroupRole(groupId, roleData);
            setRoles(prevRoles => [...prevRoles, newRole]);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Erro ao criar cargo.');
            throw e; // Re-throw para que o componente possa reagir
        }
    };

    const updateRole = async (roleId: string, roleData: { name: string; color: string }) => {
        if (!groupId) return;
        try {
            const updatedRole = await SistemaGrupoSupremo.updateGroupRole(groupId, roleId, roleData);
            setRoles(prevRoles => prevRoles.map(r => (r.id === roleId ? updatedRole : r)));
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Erro ao atualizar cargo.');
            throw e;
        }
    };

    const deleteRole = async (roleId: string) => {
        if (!groupId) return;
        try {
            await SistemaGrupoSupremo.deleteGroupRole(groupId, roleId);
            setRoles(prevRoles => prevRoles.filter(r => r.id !== roleId));
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Erro ao deletar cargo.');
            throw e;
        }
    };

    return { roles, loading, error, addRole, updateRole, deleteRole, refetchRoles: fetchRoles };
};
