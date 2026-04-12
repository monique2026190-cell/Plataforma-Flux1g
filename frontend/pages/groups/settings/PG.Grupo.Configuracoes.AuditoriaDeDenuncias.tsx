
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CabecalhoConfiguracaoInformacao } from '../../../Componentes/cabeçalhos/Cabecalho.Configuracao.Informacao';
import CardAuditoriaDenuncias from '../../../Componentes/ComponentesDeGroups/Componentes/ComponentesDeConfiguracoesDeGrupo/Card.Auditoria.Denuncias';
import { useGroupReportLog } from '../../../hooks/Hook.Grupo.Config.Auditoria.Denuncias';

// --- Tipagens que o CardAuditoriaDenuncias espera ---
type ReportStatus = 'pending' | 'resolved' | 'ignored';

interface Member {
    id: string;
    name: string;
    avatarUrl?: string;
}

interface Report {
    id: string;
    reporter: Member;
    reported: Member;
    content: string;
    reason: string;
    timestamp: Date;
    status: ReportStatus;
}

// --- Página Principal ---
export const PGGrupoConfiguracoesAuditoriaDeDenuncias: React.FC = () => {
    const navigate = useNavigate();
    const { 
        logs: apiLogs, 
        loading, 
        error, 
        updateReportStatus, 
        punishUser, 
        setStatusFilter 
    } = useGroupReportLog();

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

    // Transformar os dados do hook para o formato esperado pelo componente do Card.
    const transformedReports: Report[] = apiLogs.map(log => ({
        id: log.id,
        reporter: {
            id: log.reporterId,
            name: log.reporterName,
            // O avatar não está no hook, então o deixamos indefinido.
        },
        reported: {
            id: log.reportedUserId,
            name: log.reportedUserName,
        },
        content: log.content || 'Conteúdo não disponível',
        reason: log.reason,
        timestamp: new Date(log.timestamp),
        // A API retorna 'Pendente', mas o card espera 'pending'.
        status: log.status.toLowerCase() as ReportStatus,
    })).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    const handleStatusChange = async (reportId: string, newStatus: ReportStatus) => {
        // O card usa 'pending', a API espera 'Pendente'.
        const apiStatus = newStatus.charAt(0).toUpperCase() + newStatus.slice(1) as any;
        try {
            await updateReportStatus(reportId, apiStatus);
        } catch (updateError) {
            alert("Não foi possível atualizar o status da denúncia. Tente novamente.");
        }
    };

    const handlePunish = async (memberId: string) => {
        try {
            // O motivo poderia vir de um modal no futuro.
            await punishUser(memberId, "Violação das diretrizes reportada.");
            alert(`Processo de punição para o membro iniciado.`);
        } catch (punishError) {
            alert("Não foi possível iniciar a punição. Tente novamente.");
        }
    };

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#0c0f14,_#0a0c10)] text-white font-['Inter'] flex flex-col">
            <CabecalhoConfiguracaoInformacao 
                titulo="Auditoria de Denúncias" 
                onBack={() => navigate(-1)} 
            />

            <main className="pt-[85px] pb-[40px] w-full max-w-4xl mx-auto px-5 overflow-y-auto flex-grow no-scrollbar">
                {/* O Card agora é alimentado com dados e funções reais do hook */}
                <CardAuditoriaDenuncias
                    reports={transformedReports}
                    onStatusChange={handleStatusChange}
                    onPunish={handlePunish}
                />
            </main>
        </div>
    );
};
