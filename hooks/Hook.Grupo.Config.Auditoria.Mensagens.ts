
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { SistemaGrupoSupremo } from '../ServiçosFrontend/ServiçoDeGrupos/Sistema.Grupo.Supremo';

// Interface para um log de auditoria de mensagem, vindo da API
interface MessageAuditLog {
    id: string;            // ID do log ou da mensagem
    moderatorName: string; // Admin que apagou (se aplicável)
    userId: string;        // ID do autor da mensagem
    userName: string;      // Nome do autor da mensagem
    userAvatarUrl?: string;
    messageContent: string;
    action: 'Mensagem Apagada';
    timestamp: string;
}

export const useGroupMessageAuditLog = () => {
    const { groupId } = useParams<{ groupId: string }>();
    const [logs, setLogs] = useState<MessageAuditLog[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [userFilter, setUserFilter] = useState<string | null>(null);

    const fetchMessageAuditLogs = useCallback(async (filter?: { userId: string | null }) => {
        if (!groupId) return;
        setLoading(true);
        setError(null);
        try {
            const response = await SistemaGrupoSupremo.getMessageAuditLogs(groupId, { userId: filter?.userId });
            setLogs(response || []);
        } catch (err) {
            setError("Não foi possível carregar os logs de mensagens.");
        } finally {
            setLoading(false);
        }
    }, [groupId]);

    useEffect(() => {
        fetchMessageAuditLogs({ userId: userFilter });
    }, [fetchMessageAuditLogs, userFilter]);

    // Função para APAGAR uma mensagem
    const deleteMessage = useCallback(async (messageId: string) => {
        if (!groupId) return;
        try {
            await SistemaGrupoSupremo.deleteGroupMessage(groupId, messageId);
            // Remove a mensagem do estado local para a UI atualizar
            setLogs(prevLogs => prevLogs.filter(log => log.id !== messageId));
        } catch (err) {
            console.error("Falha ao apagar mensagem:", err);
            throw new Error("Não foi possível apagar a mensagem.");
        }
    }, [groupId]);

    // Função para ADVERTIR um usuário
    const warnUser = useCallback(async (userId: string, reason: string) => {
        if (!groupId) return;
        try {
            await SistemaGrupoSupremo.warnUser(groupId, userId, { reason });
            // A advertência não remove o log, então não há mudança no estado.
            // Apenas confirma a ação.
            console.log(`Advertência para o usuário ${userId} enviada por: ${reason}`);
        } catch (err) {
            console.error("Falha ao advertir usuário:", err);
            throw new Error("Não foi possível advertir o usuário.");
        }
    }, [groupId]);

    return {
        logs,
        loading,
        error,
        refetchLogs: () => fetchMessageAuditLogs({ userId: userFilter }),
        setUserFilter,
        deleteMessage, // Exportando a função
        warnUser,      // Exportando a função
    };
};
