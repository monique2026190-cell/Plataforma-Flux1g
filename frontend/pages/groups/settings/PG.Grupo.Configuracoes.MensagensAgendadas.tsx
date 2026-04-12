
import React from 'react';
import CardMensagensAgendadas from '../../../Componentes/ComponentesDeGroups/Componentes/ComponentesDeConfiguracoesDeGrupo/Card.Mensagens.Agendadas';
import { useGrupoConfigMensagensAgendadas } from '../../../hooks/Hook.Grupo.Config.Mensagens.Agendadas';

export const PGGrupoConfiguracoesMensagensAgendadas: React.FC = () => {
    const { mensagens, loading, error, agendarMensagem, cancelarMensagem } = useGrupoConfigMensagensAgendadas();

    const handleNewMessage = () => {
        console.log("Agendar nova mensagem");
        // A implementação real abriria um modal para o usuário inserir os detalhes da mensagem
        // e então chamaria algo como:
        // agendarMensagem("Conteúdo da nova mensagem", novaData);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0c0f14] flex items-center justify-center text-white">
                <i className="fa-solid fa-circle-notch fa-spin text-2xl text-[#00c2ff]"></i>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#0c0f14] flex items-center justify-center text-white">
                <p>Erro ao carregar mensagens: {error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#0c0f14,_#0a0c10)] text-white font-['Inter'] flex flex-col overflow-hidden">
            <header className="flex items-center p-4 bg-[#0c0f14] fixed w-full top-0 z-40 border-b border-white/10 h-[65px]">
                <button onClick={() => window.history.back()} className="bg-none border-none text-white text-2xl cursor-pointer pr-4">
                    <i className="fa-solid fa-arrow-left"></i>
                </button>
                <h1 className="font-bold text-lg text-white">Mensagens Agendadas</h1>
            </header>

            <main className="pt-[85px] pb-[100px] w-full max-w-2xl mx-auto px-5 overflow-y-auto flex-grow no-scrollbar">
                <div className="space-y-8">
                   <CardMensagensAgendadas 
                        messages={mensagens} 
                        onCancelMessage={cancelarMensagem} 
                        onNewMessage={handleNewMessage} 
                    />
                </div>
            </main>
        </div>
    );
};
