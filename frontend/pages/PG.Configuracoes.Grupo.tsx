
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SessaoConfiguracoesDeInformacoesDoGrupo } from '../Componentes/ComponentesDeGroups/SessaoConfiguracoesDeInformacoesDoGrupo';
import { SessaoConfiguracoesDeModeracao } from '../Componentes/ComponentesDeGroups/SessaoConfiguracoesDeModeracao';
import { SessaoZonaCritica } from '../Componentes/ComponentesDeGroups/SessaoZonaCritica';
import { SessaoConfiguracoesDeMarketing } from '../Componentes/ComponentesDeGroups/SessaoConfiguracoesDeMarketing';
import { SessaoConfiguracoesDeAuditoria } from '../Componentes/ComponentesDeGroups/SessaoConfiguracoesDeAuditoria';
import { SistemaGrupoSupremo } from '../ServiçosFrontend/ServiçoDeGrupos/Sistema.Grupo.Supremo';

export const PG_Configuracoes_Grupo: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const [group, setGroup] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isOwner, setIsOwner] = useState(false);

    const [isSalesPlatformEnabled, setIsSalesPlatformEnabled] = useState(false);

    const fetchGroupData = async () => {
        if (!id) {
            setError("ID do grupo não fornecido.");
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            // Refatorado para usar o SistemaGrupoSupremo
            const groupData = await SistemaGrupoSupremo.getGroupDetails(id);
            setGroup(groupData);
            setIsSalesPlatformEnabled(groupData.isSalesPlatformEnabled || false);
            setIsOwner(true);

        } catch (err) {
            console.error("Falha ao buscar detalhes do grupo:", err);
            setError("Não foi possível carregar as configurações do grupo.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGroupData();
    }, [id]);

    const handleToggleSalesPlatform = async () => {
        if (!id) return;

        const originalState = isSalesPlatformEnabled;
        const newState = !isSalesPlatformEnabled;
        setIsSalesPlatformEnabled(newState);

        try {
            // Refatorado para usar o SistemaGrupoSupremo
            await SistemaGrupoSupremo.updateGroupSettings(id, { isSalesPlatformEnabled: newState });
            fetchGroupData(); // Recarrega os dados para garantir consistência
        } catch (error) {
            console.error("Falha ao atualizar o Modo Hub:", error);
            setIsSalesPlatformEnabled(originalState); // Reverte em caso de erro
            alert("Não foi possível salvar sua alteração. Tente novamente.");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0c0f14] flex items-center justify-center text-white">
                <p>Carregando...</p>
            </div>
        );
    }

    if (error || !group) {
        return (
            <div className="min-h-screen bg-[#0c0f14] flex items-center justify-center text-white">
                <p>{error || "Grupo não encontrado."}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#0c0f14,_#0a0c10)] text-white font-['Inter'] flex flex-col overflow-hidden">
            {/* Estilos... */}
            <style>{`
                .settings-group{margin-bottom:20px;}
                .settings-group h2{font-size:13px;color:#00c2ff;padding:10px 0;margin-bottom:8px;text-transform:uppercase;font-weight:800;letter-spacing:1px;}
                .setting-item{display:flex;align-items:center;justify-content:space-between;padding:16px;background-color:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.05);transition:0.2s;color:#fff;cursor:pointer;border-radius:14px;margin-bottom:8px;}
                .setting-item:hover{background-color:rgba(255,255,255,0.06);border-color:rgba(0,194,255,0.2);box-shadow:0 0 15px rgba(0,194,255,0.1);}
                .setting-info{display:flex;align-items:center;}
                .setting-info i{font-size:18px;width:30px;text-align:center;margin-right:12px;color:#00c2ff;}
                .setting-item p{font-size:15px;font-weight:500;}
                .logout-container{margin-top:30px;}
                .logout-btn{width:100%;margin-bottom:10px;padding:16px;background:rgba(255,77,77,0.08);border:1px solid rgba(255,77,77,0.2);color:#ff4d4d;border-radius:16px;font-weight:700;font-size:15px;cursor:pointer;transition:0.3s;display:flex;align-items:center;justify-content:center;gap:10px;}
                .logout-btn:hover{background:#ff4d4d;color:#fff;box-shadow:0 4px 20px rgba(255,77,77,0.2);}
            `}</style>

            <header className="flex items-center p-4 bg-[#0c0f14] fixed w-full top-0 z-40 border-b border-white/10 h-[65px]">
                <button onClick={() => navigate(-1)} className="bg-none border-none text-white text-2xl cursor-pointer pr-4">
                    <i className="fa-solid fa-arrow-left"></i>
                </button>
                <h1 className="font-bold text-lg text-white">configurações do grupo</h1>
            </header>

            <main className="pt-[85px] pb-[100px] w-full max-w-2xl mx-auto px-5 overflow-y-auto flex-grow no-scrollbar">
                <SessaoConfiguracoesDeInformacoesDoGrupo 
                    navigate={navigate} 
                    id={id} 
                    isSalesPlatformEnabled={isSalesPlatformEnabled} 
                    onToggleSalesPlatform={handleToggleSalesPlatform} 
                />
                <SessaoConfiguracoesDeModeracao navigate={navigate} id={id} group={group} isOwner={isOwner} />
                <SessaoConfiguracoesDeMarketing navigate={navigate} id={id} />
                <SessaoConfiguracoesDeAuditoria navigate={navigate} id={id} />
                <SessaoZonaCritica handleLeaveDelete={() => {}} isOwner={isOwner} />

                <div className="text-center mt-8 opacity-20 text-[9px] uppercase font-black tracking-[3px]">
                    Flux Community Engine • {id}
                </div>
            </main>
        </div>
    );
};
