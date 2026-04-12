
import React from 'react';
import { useGroupAccessAndInvites } from '../../../hooks/Hook.Grupo.Config.Acesso.Convites';
import CardGeracaoLinks from '../../../Componentes/ComponentesDeGroups/Componentes/ComponentesDeConfiguracoesDeGrupo/Card.Geracao.Links';

export const PGGrupoConfiguracoesAcessoEConvites: React.FC = () => {
    // Usando o novo hook para gerenciar a lógica de acesso e convites
    const { 
        inviteLinks, 
        loading, 
        error, 
        createInvite, 
        revokeInvite 
    } = useGroupAccessAndInvites();

    // Estado de carregamento centralizado
    if (loading) {
        return (
            <div className="min-h-screen bg-[#0c0f14] flex items-center justify-center text-white">
                <i className="fa-solid fa-circle-notch fa-spin text-2xl text-[#00c2ff]"></i>
            </div>
        );
    }

    // Tratamento de erro
    if (error) {
        return (
            <div className="min-h-screen bg-[#0c0f14] flex items-center justify-center text-white text-center">
                <div>
                    <p className="text-red-500 font-semibold">{error}</p>
                    <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-[#00c2ff] rounded-md">
                        Tentar Novamente
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#0c0f14,_#0a0c10)] text-white font-['Inter'] flex flex-col overflow-hidden">
            <header className="flex items-center p-4 bg-[#0c0f14] fixed w-full top-0 z-40 border-b border-white/10 h-[65px]">
                <button onClick={() => window.history.back()} className="bg-none border-none text-white text-2xl cursor-pointer pr-4">
                    <i className="fa-solid fa-arrow-left"></i>
                </button>
                <h1 className="font-bold text-lg text-white">Acesso e Convites</h1>
            </header>

            <main className="pt-[85px] pb-[100px] w-full max-w-2xl mx-auto px-5 overflow-y-auto flex-grow no-scrollbar">
                <div className="space-y-8">
                    {/* Passando os dados e funções do hook para o componente card */}
                    <CardGeracaoLinks 
                        inviteLinks={inviteLinks}
                        createInvite={createInvite}
                        revokeInvite={revokeInvite}
                    />
                </div>
            </main>
        </div>
    );
};
