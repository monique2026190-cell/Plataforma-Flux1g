
import React, { useState, useMemo } from 'react';

// --- Tipagens ---
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
    details?: string; // Ex: "Convidado por @Admin"
}

interface CardAuditoriaEntradaSaidaProps {
    logs: LogEntry[];
}

// --- Componentes Filhos ---
const LogItem: React.FC<{ log: LogEntry }> = ({ log }) => {
    const isEntry = log.type === 'entry';
    const icon = isEntry ? 'fa-solid fa-arrow-right-to-bracket' : 'fa-solid fa-arrow-right-from-bracket';
    const color = isEntry ? 'text-green-400' : 'text-red-400';
    const text = isEntry ? 'entrou no grupo' : 'saiu do grupo';

    return (
        <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/5 transition-all duration-200">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full bg-black/20 ${color}`}>
                <i className={icon}></i>
            </div>
            <div className="flex-grow">
                <p className="text-white">
                    <span className="font-bold">{log.member.name}</span>
                    <span className="text-gray-400"> {text}</span>
                </p>
                {log.details && <p className="text-xs text-gray-500">{log.details}</p>}
            </div>
            <span className="text-xs text-gray-500 font-mono self-start mt-1">{log.timestamp.toLocaleString('pt-BR')}</span>
        </div>
    );
};


// --- Componente Principal ---
const CardAuditoriaEntradaSaida: React.FC<CardAuditoriaEntradaSaidaProps> = ({ logs }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [logTypeFilter, setLogTypeFilter] = useState<'all' | LogType>('all');
    const [dateRange, setDateRange] = useState<{ start: string; end: string; }>({ start: '', end: '' });

    const filteredLogs = useMemo(() => {
        return logs.filter(log => {
            const logDate = log.timestamp;
            const startDate = dateRange.start ? new Date(dateRange.start) : null;
            const endDate = dateRange.end ? new Date(dateRange.end) : null;

            if (startDate && logDate < startDate) return false;
            if (endDate && logDate > endDate) return false;
            if (logTypeFilter !== 'all' && log.type !== logTypeFilter) return false;
            if (searchTerm && !log.member.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;

            return true;
        });
    }, [logs, searchTerm, logTypeFilter, dateRange]);

    return (
        <div className="bg-black/20 border border-white/10 rounded-2xl p-4">
            {/* Painel de Filtros */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-black/20 rounded-xl border border-white/10">
                <div className="col-span-1 md:col-span-4">
                     <div className="relative">
                        <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"></i>
                        <input
                            type="text"
                            placeholder="Pesquisar por nome do membro..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full bg-black/30 border border-white/10 rounded-lg pl-11 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00c2ff]"
                        />
                    </div>
                </div>
                <div>
                    <label className="text-xs font-semibold text-gray-400 mb-2 block">Tipo de Evento</label>
                    <select value={logTypeFilter} onChange={e => setLogTypeFilter(e.target.value as any)} className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#00c2ff]">
                        <option value="all">Todos</option>
                        <option value="entry">Entradas</option>
                        <option value="exit">Saídas</option>
                    </select>
                </div>
                 <div>
                     <label className="text-xs font-semibold text-gray-400 mb-2 block">Data de Início</label>
                    <input type="date" value={dateRange.start} onChange={e => setDateRange(p => ({ ...p, start: e.target.value }))} className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#00c2ff]" />
                </div>
                 <div>
                     <label className="text-xs font-semibold text-gray-400 mb-2 block">Data de Fim</label>
                    <input type="date" value={dateRange.end} onChange={e => setDateRange(p => ({ ...p, end: e.target.value }))} className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#00c2ff]" />
                </div>
                 <div className="col-span-1 md:col-span-1 flex items-end">
                    <button onClick={() => { setSearchTerm(''); setLogTypeFilter('all'); setDateRange({start: '', end: ''}) }} className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 text-white font-semibold hover:bg-white/10 transition-all">Limpar Filtros</button>
                </div>
            </div>

            {/* Lista de Logs */}
            <div className="space-y-1 max-h-[600px] overflow-y-auto no-scrollbar pr-2 -mr-2">
                {filteredLogs.length > 0 ? (
                    filteredLogs.map(log => <LogItem key={log.id} log={log} />)
                ) : (
                     <div className="text-center py-16 text-gray-500">
                        <i className="fa-solid fa-rectangle-history text-4xl mb-4"></i>
                        <p className="font-semibold">Nenhum registro encontrado</p>
                        <p className="text-sm">Tente ajustar os seus filtros.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CardAuditoriaEntradaSaida;
