
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGrupoConfigEstatisticas } from '../../../hooks/Hook.Grupo.Config.Estatisticas';
import { HookConfiguracaoGrupoPrincipal } from '../../../hooks/Hook.Configuracao.Grupo.Principal';

export const PGGrupoConfiguracoesEstatisticas: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { group, loading: groupLoading } = HookConfiguracaoGrupoPrincipal(id);
    const { metrics, loading: metricsLoading, error } = useGrupoConfigEstatisticas(id);

    const loading = groupLoading || metricsLoading;

    if (loading || !group || !id) {
        return (
            <div className="min-h-screen bg-[#0c0f14] flex items-center justify-center text-white">
                <i className="fa-solid fa-circle-notch fa-spin text-2xl text-[#00c2ff]"></i>
            </div>
        );
    }
    
    if (error || !metrics) {
        return (
            <div className="min-h-screen bg-[#0c0f14] flex flex-col items-center justify-center text-white">
                <h1 className="font-bold text-lg text-red-500 mb-4">Erro ao Carregar</h1>
                <p className="text-center mb-6">Não foi possível processar as métricas do grupo.</p>
                <button onClick={() => navigate(-1)} className="bg-white/10 px-4 py-2 rounded-lg font-bold">Voltar</button>
            </div>
        );
    }

    const { members = [], memberLimit } = group;
    const hasGlobalLimit = typeof memberLimit === 'number' && memberLimit > 0;
    const totalMembers = members.length;
    const occupancyPercentage = hasGlobalLimit ? (totalMembers / (memberLimit as number)) * 100 : 0;

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#0c0f14,_#0a0c10)] text-white font-['Inter'] flex flex-col overflow-hidden">
            <header className="flex items-center p-4 bg-[#0c0f14] fixed w-full top-0 z-40 border-b border-white/10 h-[65px]">
                <button onClick={() => navigate(-1)} className="bg-none border-none text-white text-2xl cursor-pointer pr-4">
                    <i className="fa-solid fa-arrow-left"></i>
                </button>
                <h1 className="font-bold text-lg text-white">Estatísticas e Capacidade</h1>
            </header>

            <main className="pt-[85px] pb-[100px] w-full max-w-2xl mx-auto px-5 overflow-y-auto flex-grow no-scrollbar">
                <div className="space-y-8">
                    <div className="bg-white/5 border border-[#00c2ff]/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00c2ff] to-transparent opacity-50"></div>
                        <span className="text-[10px] font-black text-[#00c2ff] uppercase tracking-[2px] block mb-2">Capacidade Absoluta</span>
                        <div className="flex items-baseline gap-2 mb-6">
                            <span className="text-4xl font-black text-white">{totalMembers.toLocaleString()}</span>
                            <span className="text-gray-500 font-bold flex items-center">
                                / {hasGlobalLimit ? memberLimit?.toLocaleString() : <i className="fa-solid fa-infinity text-sm ml-1.5 text-[#00c2ff]/60"></i>}
                            </span>
                        </div>

                        <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden mb-2">
                            <div 
                                className="h-full rounded-full transition-all duration-1000 bg-[#00c2ff]"
                                style={{ width: `${hasGlobalLimit ? Math.min(100, occupancyPercentage) : 100}%`, boxShadow: '0 0 15px rgba(0, 194, 255, 0.4)' }}
                            ></div>
                        </div>
                        <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider text-right">
                            {hasGlobalLimit ? `${Math.min(100, occupancyPercentage).toFixed(1)}% preenchido` : 'Capacidade Adaptativa'}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-[9px] font-black text-gray-600 uppercase tracking-[3px] ml-2 mb-4">Distribuição de Cargos</h3>

                        <div className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-[#FFD7001a] flex items-center justify-center text-[#FFD700] border border-[#FFD70033]">
                                    <i className="fa-solid fa-crown"></i>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white">Dono</h4>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase">Proprietário</p>
                                </div>
                            </div>
                            <span className="text-lg font-black text-[#FFD700]">{metrics.counts.owner}</span>
                        </div>

                        {metrics.counts.customRoles.map(role => (
                            <div key={role.id} className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl flex items-center justify-between animate-fade-in">
                                <div className="flex items-center gap-4">
                                    <div 
                                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black"
                                        style={{ backgroundColor: `${role.color}1a`, color: role.color, border: `1px solid ${role.color}33` }}
                                    >
                                        <i className="fa-solid fa-user-shield"></i>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white">{role.name}</h4>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase">Cargo Customizado</p>
                                    </div>
                                </div>
                                <span className="text-lg font-black text-white" style={{ color: role.count > 0 ? role.color : undefined }}>
                                    {role.count}
                                </span>
                            </div>
                        ))}

                        <div className="bg-white/[0.03] border border-white/5 p-4 rounded-2xl flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400">
                                    <i className="fa-solid fa-users"></i>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white">Membros</h4>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase">Sem cargo atribuído</p>
                                </div>
                            </div>
                            <span className="text-lg font-black text-gray-500">{metrics.counts.unassigned}</span>
                        </div>
                    </div>
                    
                    <div className="pt-4 border-t border-white/5 opacity-50 flex justify-between items-center px-2">
                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-500">Força da Comunidade</span>
                        <span className="text-xs font-black text-[#00c2ff]">{metrics.totalPower.toLocaleString()} pts</span>
                    </div>
                </div>
            </main>
        </div>
    );
};
