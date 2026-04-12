
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { SistemaGrupoSupremo } from '../ServiçosFrontend/ServiçoDeGrupos/Sistema.Grupo.Supremo';

// Interface para um log de auditoria
interface AuditLog {
    id: string;
    moderatorName: string; // O nome do administrador que fez a alteração
    action: string;        // A descrição da ação, ex: "Alterou o nome do grupo para 'Novos Horizontes'"
    timestamp: string;     // A data e hora da ação
}

export const useGroupSettingsAuditLog = () => {
    const { groupId } = useParams<{ groupId: string }>();
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAuditLogs = useCallback(async () => {
        if (!groupId) return;
        setLoading(true);
        setError(null);
        try {
            // Supondo que `getSettingsAuditLogs` exista no SistemaGrupoSupremo
            const response = await SistemaGrupoSupremo.getSettingsAuditLogs(groupId);
            setLogs(response || []);
        } catch (err) {
            setError("Não foi possível carregar os logs de auditoria.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [groupId]);

    useEffect(() => {
        fetchAuditLogs();
    }, [fetchAuditLogs]);

    return {
        logs,
        loading,
        error,
        refetchLogs: fetchAuditLogs,
    };
};
