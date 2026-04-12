
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CabecalhoConfiguracaoInformacao } from '../../../Componentes/cabeçalhos/Cabecalho.Configuracao.Informacao';
import CardAuditoriaAjustes from '../../../Componentes/ComponentesDeGroups/Componentes/ComponentesDeConfiguracoesDeGrupo/Card.Auditoria.Ajustes';
import { useGroupSettingsAuditLog } from '../../../hooks/Hook.Grupo.Config.Auditoria.Ajustes';

// A tipagem que o componente CardAuditoriaAjustes espera.
interface AdjustmentLog {
    id: string;
    admin: {
        id: string;
        name: string;
        avatarUrl?: string;
    };
    action: string;
    category: string;
    from?: string;
    to?: string;
    timestamp: Date;
}

export const PGGrupoConfiguracoesAuditoriaDeAjustes: React.FC = () => {
    const navigate = useNavigate();
    // Utilizando o hook para buscar os dados, em vez de dados mocados.
    const { logs: apiLogs, loading, error, setDateFilter } = useGroupSettingsAuditLog();

    // Tratamento do estado de carregamento.
    if (loading) {
        return (
            <div className="min-h-screen bg-[#0c0f14] flex items-center justify-center text-white">
                <i className="fa-solid fa-circle-notch fa-spin text-2xl text-[#00c2ff]"></i>
            </div>
        );
    }

    // Tratamento de erro.
    if (error) {
        return (
            <div className="min-h-screen bg-[#0c0f14] flex items-center justify-center text-white text-center">
                <p className="text-red-500 font-semibold">Falha ao carregar os logs de auditoria.</p>
                 <p className="text-sm text-gray-400 mt-2">{error}</p>
            </div>
        );
    }

    // O hook retorna dados num formato (`AuditLog`) que precisa ser adaptado
    // para o formato que o `CardAuditoriaAjustes` espera (`AdjustmentLog`).
    const transformedLogs: AdjustmentLog[] = apiLogs.map(log => ({
        id: log.id,
        admin: {
            // O hook atual não fornece um ID de admin, usamos o nome como fallback.
            id: log.adminName, 
            name: log.adminName,
            avatarUrl: log.adminAvatarUrl,
        },
        action: log.action,
        // Assumimos que o campo `details` do hook contém estas informações.
        category: log.details.category || 'Geral',
        from: log.details.from,
        to: log.details.to,
        timestamp: new Date(log.timestamp), // Convertendo a string de data para um objeto Date.
    })).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()); // Ordenando por data

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#0c0f14,_#0a0c10)] text-white font-['Inter'] flex flex-col">
            <CabecalhoConfiguracaoInformacao titulo="Auditoria de Ajustes" onBack={() => navigate(-1)} />

            <main className="pt-[85px] pb-[40px] w-full max-w-4xl mx-auto px-5 overflow-y-auto flex-grow no-scrollbar">
                {/* O card agora recebe os dados vindos da API através do hook */}
                {/* A função `setDateFilter` do hook pode ser usada futuramente para implementar filtros de data */}
                <CardAuditoriaAjustes logs={transformedLogs} />
            </main>
        </div>
    );
};
