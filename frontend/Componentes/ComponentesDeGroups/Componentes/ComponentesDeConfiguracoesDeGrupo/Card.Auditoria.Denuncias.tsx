
import React, { useState, useMemo } from 'react';

// --- Tipagens ---
type ReportStatus = 'pending' | 'resolved' | 'ignored';

interface Member {
    id: string;
    name: string;
    avatarUrl?: string;
}

interface Report {
    id: string;
    reporter: Member; // Quem denunciou
    reported: Member; // Quem foi denunciado
    content: string; // Conteúdo denunciado (a mensagem)
    reason: string; // Motivo da denúncia
    timestamp: Date;
    status: ReportStatus;
}

interface CardAuditoriaDenunciasProps {
    reports: Report[];
    onStatusChange: (reportId: string, newStatus: ReportStatus) => void;
    onPunish: (memberId: string) => void;
}

// --- Mapeamento de Status ---
const statusMap: Record<ReportStatus, { text: string; color: string; icon: string; }> = {
    pending: { text: 'Pendente', color: 'border-yellow-500/50 bg-yellow-500/10', icon: 'fa-solid fa-hourglass-half' },
    resolved: { text: 'Resolvida', color: 'border-green-500/50 bg-green-500/10', icon: 'fa-solid fa-check-circle' },
    ignored: { text: 'Ignorada', color: 'border-gray-500/50 bg-gray-500/10', icon: 'fa-solid fa-minus-circle' },
};

// --- Componentes Filhos ---
const ReportItem: React.FC<{ report: Report; onStatusChange: (newStatus: ReportStatus) => void; onPunish: () => void; }> = ({ report, onStatusChange, onPunish }) => {
    const statusInfo = statusMap[report.status];

    return (
        <div className={`p-4 rounded-xl transition-all duration-200 border ${statusInfo.color}`}>
            {/* Cabeçalho do Item */}
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                    <i className={`${statusInfo.icon} ${statusInfo.color.replace('border-','text-').replace('/50','')}`}></i>
                    <span className="font-bold text-white">Denúncia de {report.reporter.name}</span>
                </div>
                <span className="text-xs text-gray-500 font-mono">{report.timestamp.toLocaleString('pt-BR')}</span>
            </div>

            {/* Conteúdo Denunciado */}
            <div className="bg-black/30 p-3 rounded-lg border border-white/10 mb-3">
                <div className="flex items-center gap-3 mb-2">
                     <img src={report.reported.avatarUrl || `https://ui-avatars.com/api/?name=${report.reported.name}&background=random`} alt={report.reported.name} className="w-8 h-8 rounded-full bg-black/30"/>
                     <div>
                        <p className="font-semibold text-sm text-white">{report.reported.name}</p>
                        <p className="text-xs text-gray-400">Autor da mensagem denunciada</p>
                     </div>
                </div>
                <p className="text-gray-300 italic">\"{report.content}\"</p>
                 <p className="text-xs text-yellow-400 mt-2 font-semibold">Motivo: {report.reason}</p>
            </div>

            {/* Ações */}
            <div className="flex items-center gap-2">
                <button onClick={() => onStatusChange('resolved')} className="px-3 py-1 text-xs font-bold text-green-400 bg-green-500/10 rounded-md hover:bg-green-500/20 disabled:opacity-50" disabled={report.status === 'resolved'}>Resolver</button>
                <button onClick={() => onStatusChange('ignored')} className="px-3 py-1 text-xs font-bold text-gray-400 bg-gray-500/10 rounded-md hover:bg-gray-500/20 disabled:opacity-50" disabled={report.status === 'ignored'}>Ignorar</button>
                <button onClick={onPunish} className="px-3 py-1 text-xs font-bold text-red-400 bg-red-500/10 rounded-md hover:bg-red-500/20">Punir Autor</button>
            </div>
        </div>
    );
};

// --- Componente Principal ---
const CardAuditoriaDenuncias: React.FC<CardAuditoriaDenunciasProps> = ({ reports, onStatusChange, onPunish }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | ReportStatus>('all');
    const [dateRange, setDateRange] = useState<{ start: string; end: string; }>({ start: '', end: '' });

    const filteredReports = useMemo(() => {
        return reports.filter(r => {
            const rDate = r.timestamp;
            const startDate = dateRange.start ? new Date(dateRange.start) : null;
            const endDate = dateRange.end ? new Date(dateRange.end) : null;

            if (startDate && rDate < startDate) return false;
            if (endDate && rDate > endDate) return false;
            if (statusFilter !== 'all' && r.status !== statusFilter) return false;
            if (searchTerm && !(r.reporter.name.toLowerCase().includes(searchTerm.toLowerCase()) || r.reported.name.toLowerCase().includes(searchTerm.toLowerCase()))) return false;

            return true;
        });
    }, [reports, searchTerm, statusFilter, dateRange]);

    return (
         <div className="bg-black/20 border border-white/10 rounded-2xl p-4">
            {/* Painel de Filtros */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 p-4 bg-black/20 rounded-xl border border-white/10">
                <div className="md:col-span-2">
                     <div className="relative">
                        <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"></i>
                        <input
                            type="text"
                            placeholder="Buscar por denunciante ou denunciado..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full bg-black/30 border border-white/10 rounded-lg pl-11 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00c2ff]"
                        />
                    </div>
                </div>
                 <div>
                    <label className="text-xs font-semibold text-gray-400 mb-2 block">Status da Denúncia</label>
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#00c2ff]">
                        <option value="all">Todos</option>
                        <option value="pending">Pendentes</option>
                        <option value="resolved">Resolvidas</option>
                        <option value="ignored">Ignoradas</option>
                    </select>
                </div>
                 <div className="flex items-end">
                    <button onClick={() => { setSearchTerm(''); setStatusFilter('all'); setDateRange({start: '', end: ''}) }} className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 text-white font-semibold hover:bg-white/10 transition-all">Limpar</button>
                </div>
            </div>

            {/* Lista de Denúncias */}
            <div className="space-y-3 max-h-[600px] overflow-y-auto no-scrollbar pr-2 -mr-2">
                {filteredReports.length > 0 ? (
                    filteredReports.map(r => (
                        <ReportItem 
                            key={r.id} 
                            report={r}
                            onStatusChange={(newStatus) => onStatusChange(r.id, newStatus)}
                            onPunish={() => onPunish(r.reported.id)}
                        />
                    ))
                ) : (
                    <div className="text-center py-16 text-gray-500">
                        <i className="fa-solid fa-shield-check text-4xl mb-4"></i>
                        <p className="font-semibold">Nenhuma denúncia encontrada</p>
                        <p className="text-sm">Parece que está tudo em ordem por aqui.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CardAuditoriaDenuncias;
