
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CabecalhoConfiguracaoInformacao } from '../../../Componentes/cabeçalhos/Cabecalho.Configuracao.Informacao';
import CardAuditoriaEntradaSaida from '../../../Componentes/ComponentesDeGroups/Componentes/ComponentesDeConfiguracoesDeGrupo/Card.Auditoria.EntradaSaida';
import { useGroupEntryExitLog } from '../../../hooks/Hook.Grupo.Config.Auditoria.Entrada.Saida';

// --- Tipagens que o CardAuditoriaEntradaSaida espera ---
type LogType = 'entry' | 'exit';

interface LogEntry {
    id: string;
    member: {
        id: string;
        name: string;
        avatarUrl?: string;
    };
    type: LogType;
    timestamp: Date;
    details?: string;
}

// --- Página Principal ---
export const PGGrupoConfiguracoesAuditoriaDeEntradaESaida: React.FC = () => {
    const navigate = useNavigate();
    // Chamando o hook para obter os dados de entrada e saída.
    const { logs: apiLogs, loading, error, setFilter } = useGroupEntryExitLog();

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

    // Transformando os dados da API (`EntryExitLog`) para o formato do Card (`LogEntry`).
    const transformedLogs: LogEntry[] = apiLogs.map(log => {
        let type: LogType = 'entry';
        let details = '';

        if (log.action === 'Saiu') {
            type = 'exit';
        } else if (log.action === 'Foi Kickado') {
            type = 'exit';
            details = `Expulso por ${log.moderatorName || 'um administrador'}`;
        }

        return {
            id: log.id,
            member: {
                id: log.userName, // O hook não provê ID, usamos o nome como chave temporária
                name: log.userName,
                avatarUrl: log.userAvatarUrl,
            },
            type,
            timestamp: new Date(log.timestamp),
            details,
        };
    }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#0c0f14,_#0a0c10)] text-white font-['Inter'] flex flex-col">
            <CabecalhoConfiguracaoInformacao 
                titulo="Auditoria de Entrada e Saída" 
                onBack={() => navigate(-1)} 
            />

            <main className="pt-[85px] pb-[40px] w-full max-w-4xl mx-auto px-5 overflow-y-auto flex-grow no-scrollbar">
                {/* Futuramente, botões de filtro poderiam usar setFilter('Entrou') ou setFilter('Saiu') */}
                <CardAuditoriaEntradaSaida logs={transformedLogs} />
            </main>
        </div>
    );
};
