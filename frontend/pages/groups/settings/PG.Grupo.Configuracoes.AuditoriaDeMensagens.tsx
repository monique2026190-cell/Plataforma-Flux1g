
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CabecalhoConfiguracaoInformacao } from '../../../Componentes/cabeçalhos/Cabecalho.Configuracao.Informacao';
import CardAuditoriaMensagens from '../../../Componentes/ComponentesDeGroups/Componentes/ComponentesDeConfiguracoesDeGrupo/Card.Auditoria.Mensagens';
import { useGroupMessageAuditLog } from '../../../hooks/Hook.Grupo.Config.Auditoria.Mensagens';

// --- Tipagens que o CardAuditoriaMensagens espera ---
interface Message {
    id: string;
    author: {
        id: string;
        name: string;
        role: string;
        avatarUrl?: string;
    };
    content: string;
    timestamp: Date;
    isReported?: boolean;
}

// --- Página Principal ---
export const PGGrupoConfiguracoesAuditoriaDeMensagens: React.FC = () => {
    const navigate = useNavigate();
    const { 
        logs: apiLogs, 
        loading, 
        error, 
        deleteMessage, 
        warnUser, 
        setUserFilter 
    } = useGroupMessageAuditLog();

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0c0f14] flex items-center justify-center text-white">
                <i className="fa-solid fa-circle-notch fa-spin text-2xl text-[#00c2ff]"></i>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#0c0f14] flex items-center justify-center text-white text-center">
                <p className="text-red-500 font-semibold">{error}</p>
            </div>
        );
    }

    // Transformando os logs da API (`MessageAuditLog`) no formato `Message` para o card.
    const transformedMessages: Message[] = apiLogs.map(log => ({
        id: log.id,
        author: {
            id: log.userId,
            name: log.userName,
            role: log.moderatorName ? 'Moderador' : 'Membro', // Lógica simples para definir o cargo
            avatarUrl: log.userAvatarUrl,
        },
        content: log.messageContent,
        timestamp: new Date(log.timestamp),
        // O hook de auditoria foca em msgs já apagadas, o card pode ter um estado visual para isso.
        isReported: log.action === 'Mensagem Apagada',
    })).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    const handleDeleteMessage = async (messageId: string) => {
        try {
            await deleteMessage(messageId);
            // A UI já atualiza via estado do hook, um feedback visual pode ser adicionado aqui.
        } catch (deleteError) {
            alert("Erro ao apagar a mensagem. Tente novamente.");
        }
    };

    const handleWarnAuthor = async (authorId: string) => {
        try {
            await warnUser(authorId, "Conteúdo de mensagem inadequado.");
            alert("Autor advertido com sucesso.");
        } catch (warnError) {
            alert("Erro ao advertir o autor. Tente novamente.");
        }
    };

    // Criando a lista de membros a partir dos logs para o filtro do card.
    const memberListForFilter = Array.from(
        new Set(apiLogs.map(log => JSON.stringify({ id: log.userId, name: log.userName })))
    ).map(item => JSON.parse(item));

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#0c0f14,_#0a0c10)] text-white font-['Inter'] flex flex-col">
            <CabecalhoConfiguracaoInformacao titulo="Auditoria de Mensagens" onBack={() => navigate(-1)} />

            <main className="pt-[85px] pb-[40px] w-full max-w-4xl mx-auto px-5 overflow-y-auto flex-grow no-scrollbar">
                <CardAuditoriaMensagens
                    messages={transformedMessages}
                    members={memberListForFilter}
                    onDelete={handleDeleteMessage}
                    onWarn={handleWarnAuthor}
                    // A função `setUserFilter` do hook pode ser conectada a um dropdown no card no futuro.
                />
            </main>
        </div>
    );
};
