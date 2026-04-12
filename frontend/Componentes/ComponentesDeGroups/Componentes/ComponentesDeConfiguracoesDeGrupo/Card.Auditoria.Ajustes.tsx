
import React, { useState, useMemo } from 'react';

// --- Tipagens ---
interface Admin {
    id: string;
    name: string;
    avatarUrl?: string;
}

interface AdjustmentLog {
    id: string;
    admin: Admin;
    action: string; // Ex: "Alterou o nome do grupo", "Atualizou a cor de um cargo"
    category: string; // Ex: "Informações", "Cargos", "Diretrizes"
    from?: string; // Valor antigo
    to?: string;   // Valor novo
    timestamp: Date;
}

interface CardAuditoriaAjustesProps {
    logs: AdjustmentLog[];
}

// --- Mapeamento de Categorias (Ícones) ---
const categoryIconMap: Record<string, string> = {
    default: 'fa-solid fa-sliders',
    Informações: 'fa-solid fa-info-circle',
    Cargos: 'fa-solid fa-shield-halved',
    Diretrizes: 'fa-solid fa-scroll',
    Moderação: 'fa-solid fa-gavel',
};

// --- Componentes Filhos ---
const LogItem: React.FC<{ log: AdjustmentLog }> = ({ log }) => {
    const icon = categoryIconMap[log.category] || categoryIconMap.default;

    return (
        <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-white/5 transition-all duration-200">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-black/20 text-gray-400 mt-1">
                <i className={icon}></i>
            </div>
            <div className="flex-grow">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-white">
                            <span className="font-bold">{log.admin.name}</span>
                            <span className="text-gray-400"> {log.action}</span>
                        </p>
                        <p className="text-xs text-gray-500">na categoria: {log.category}</p>
                    </div>
                    <span className="text-xs text-gray-500 font-mono self-start mt-1 flex-shrink-0 ml-4">{log.timestamp.toLocaleString('pt-BR')}</span>
                </div>
                {(log.from || log.to) && (
                    <div className="mt-2 text-sm bg-black/20 border border-white/10 rounded-md px-3 py-2 w-fit max-w-full">
                        {log.from && <p className="text-gray-400 truncate">De: <span className="text-red-400 font-mono text-xs">{log.from}</span></p>}
                        {log.to && <p className="text-gray-400 truncate">Para: <span className="text-green-400 font-mono text-xs">{log.to}</span></p>}
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Componente Principal ---
const CardAuditoriaAjustes: React.FC<CardAuditoriaAjustesProps> = ({ logs }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [dateRange, setDateRange] = useState<{ start: string; end: string; }>({ start: '', end: '' });

    const uniqueCategories = useMemo(() => [...new Set(logs.map(log => log.category))], [logs]);

    const filteredLogs = useMemo(() => {
        return logs.filter(log => {
            const logDate = log.timestamp;
            const startDate = dateRange.start ? new Date(dateRange.start) : null;
            const endDate = dateRange.end ? new Date(dateRange.end) : null;

            if (startDate && logDate < startDate) return false;
            if (endDate && logDate > endDate) return false;
            if (categoryFilter !== 'all' && log.category !== categoryFilter) return false;
            if (searchTerm && !log.admin.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;

            return true;
        });
    }, [logs, searchTerm, categoryFilter, dateRange]);

    return (
        <div className="bg-black/20 border border-white/10 rounded-2xl p-4">
            {/* Painel de Filtros */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-black/20 rounded-xl border border-white/10">
                <div className="col-span-1 md:col-span-2">
                    <div className="relative">
                        <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"></i>
                        <input
                            type="text"
                            placeholder="Pesquisar por administrador..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full bg-black/30 border border-white/10 rounded-lg pl-11 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00c2ff]"
                        />
                    </div>
                </div>
                <div>
                    <label className="text-xs font-semibold text-gray-400 mb-2 block">Categoria do Ajuste</label>
                    <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#00c2ff]">
                        <option value="all">Todas</option>
                        {uniqueCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
                <div className="flex items-end">
                    <button onClick={() => { setSearchTerm(''); setCategoryFilter('all'); setDateRange({start: '', end: ''}) }} className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 text-white font-semibold hover:bg-white/10 transition-all">Limpar Filtros</button>
                </div>
            </div>

            {/* Lista de Logs */}
            <div className="space-y-1 max-h-[600px] overflow-y-auto no-scrollbar pr-2 -mr-2">
                {filteredLogs.length > 0 ? (
                    filteredLogs.map(log => <LogItem key={log.id} log={log} />)
                ) : (
                    <div className="text-center py-16 text-gray-500">
                        <i className="fa-solid fa-rectangle-history text-4xl mb-4"></i>
                        <p className="font-semibold">Nenhum registro de ajuste encontrado</p>
                        <p className="text-sm">Tente alterar os filtros ou verifique mais tarde.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CardAuditoriaAjustes;
