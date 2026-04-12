
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { SistemaGrupoSupremo } from '../ServiçosFrontend/ServiçoDeGrupos/Sistema.Grupo.Supremo';

// Interface para uma denúncia, como definido pela API
interface Report {
    id: string;
    reportedUser: {
        id: string;
        name: string;
        avatarUrl?: string;
    };
    reportingUser: {
        id: string;
        name: string;
    };
    reason: string;
    timestamp: string; // ISO 8601 string
}

export const useGroupReportLog = () => {
    const { groupId } = useParams<{ groupId: string }>();
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Busca as denúncias
    const fetchReports = useCallback(async () => {
        if (!groupId) return;
        setLoading(true);
        setError(null);
        try {
            const response = await SistemaGrupoSupremo.getReports(groupId);
            setReports(response || []);
        } catch (err) {
            setError("Não foi possível carregar as denúncias.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [groupId]);

    useEffect(() => {
        fetchReports();
    }, [fetchReports]);

    // Função para BANIR um usuário
    const banUser = useCallback(async (userId: string) => {
        if (!groupId) return;
        try {
            await SistemaGrupoSupremo.banUser(groupId, userId, { reason: "Comportamento inadequado conforme denúncia." });
            // Depois de banir, remove as denúncias relacionadas a esse usuário da lista
            setReports(prev => prev.filter(r => r.reportedUser.id !== userId));
        } catch (err) {
            console.error("Falha ao banir usuário:", err);
            throw new Error("Não foi possível banir o usuário.");
        }
    }, [groupId]);

    // Função para REJEITAR uma denúncia
    const dismissReport = useCallback(async (reportId: string) => {
        if (!groupId) return;
        try {
            await SistemaGrupoSupremo.dismissReport(groupId, reportId);
            // Apenas remove a denúncia da lista local
            setReports(prev => prev.filter(r => r.id !== reportId));
        } catch (err) {
            console.error("Falha ao rejeitar denúncia:", err);
            throw new Error("Não foi possível rejeitar a denúncia.");
        }
    }, [groupId]);

    return {
        reports,
        loading,
        error,
        refetchReports: fetchReports,
        banUser,        // Exporta a função de banir
        dismissReport,  // Exporta a função de rejeitar
    };
};
