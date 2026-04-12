
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { SistemaGrupoSupremo } from '../ServiçosFrontend/ServiçoDeGrupos/Sistema.Grupo.Supremo';

// Tipagem para os logs de entrada e saída
interface EntryExitLog {
    id: string;
    userName: string;
    userAvatarUrl?: string;
    action: 'entrada' | 'saída';
    timestamp: string; // ISO 8601 string
}

export const useGroupEntryExitLog = () => {
    const { groupId } = useParams<{ groupId: string }>();
    const [logs, setLogs] = useState<EntryExitLog[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchEntryExitLogs = useCallback(async () => {
        if (!groupId) return;
        setLoading(true);
        setError(null);
        try {
            const response = await SistemaGrupoSupremo.getEntryExitLogs(groupId);
            setLogs(response || []);
        } catch (err) {
            setError("Não foi possível carregar os logs de entrada e saída.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [groupId]);

    useEffect(() => {
        fetchEntryExitLogs();
    }, [fetchEntryExitLogs]);

    return {
        logs,
        loading,
        error,
        refetchLogs: fetchEntryExitLogs,
    };
};
