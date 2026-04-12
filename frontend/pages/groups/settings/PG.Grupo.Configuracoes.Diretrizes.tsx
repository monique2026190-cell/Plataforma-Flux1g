
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HookConfiguracaoGrupoPrincipal } from '../../../hooks/Hook.Configuracao.Grupo.Principal';
import { CabecalhoConfiguracaoInformacao } from '../../../Componentes/cabeçalhos/Cabecalho.Configuracao.Informacao';
import CardModoLentoMensagens from '../../../Componentes/ComponentesDeGroups/Componentes/ComponentesDeConfiguracoesDeGrupo/Card.Modo.Lento.Mensagens';
import CardModoLentoEntrada from '../../../Componentes/ComponentesDeGroups/Componentes/ComponentesDeConfiguracoesDeGrupo/Card.Modo.Lento.Entrada';

interface SlowModeSettings {
    enabled: boolean;
    interval: number; // em segundos
}

interface SlowModeEntrySettings {
    enabled: boolean;
    interval: number; // em segundos
}

export const PGGrupoConfiguracoesDiretrizes: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { group, loading } = HookConfiguracaoGrupoPrincipal(id);

    const [guidelines, setGuidelines] = useState('');
    const [slowMode, setSlowMode] = useState<SlowModeSettings>({ enabled: false, interval: 5 });
    const [slowModeEntry, setSlowModeEntry] = useState<SlowModeEntrySettings>({ enabled: false, interval: 60 });

    useEffect(() => {
        if (group) {
            if (group.guidelines) {
                setGuidelines(group.guidelines);
            }
            if (group.slowMode) {
                setSlowMode(group.slowMode);
            }
            if (group.slowModeEntry) {
                setSlowModeEntry(group.slowModeEntry);
            }
        }
    }, [group]);

    const handleSaveChanges = () => {
        // Placeholder for save logic
        console.log('Saving settings:', { guidelines, slowMode, slowModeEntry });
        alert('Configurações salvas com sucesso! (Simulação)');
    };

    const handleSlowModeChange = (newSettings: Partial<SlowModeSettings>) => {
        setSlowMode(prev => ({ ...prev, ...newSettings }));
    };

    const handleSlowModeEntryChange = (newSettings: Partial<SlowModeEntrySettings>) => {
        setSlowModeEntry(prev => ({ ...prev, ...newSettings }));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0c0f14] flex items-center justify-center text-white">
                <i className="fa-solid fa-circle-notch fa-spin text-2xl text-[#00c2ff]"></i>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#0c0f14,_#0a0c10)] text-white font-['Inter'] flex flex-col">
            <CabecalhoConfiguracaoInformacao titulo="Diretrizes e Controles" onBack={() => navigate(-1)} />

            <main className="pt-[85px] pb-[120px] w-full max-w-2xl mx-auto px-5 overflow-y-auto flex-grow no-scrollbar">
                <div className="space-y-8">
                    
                    <CardModoLentoMensagens settings={slowMode} onSettingsChange={handleSlowModeChange} />

                    <CardModoLentoEntrada settings={slowModeEntry} onSettingsChange={handleSlowModeEntryChange} />

                    <div>
                        <label htmlFor="group-guidelines" className="block text-sm font-medium text-gray-400 mb-2">
                            Diretrizes do Grupo
                        </label>
                        <textarea
                            id="group-guidelines"
                            value={guidelines}
                            onChange={(e) => setGuidelines(e.target.value)}
                            rows={12}
                            placeholder="Insira as diretrizes e regras para os membros do seu grupo."
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00c2ff] transition-all no-scrollbar"
                        />
                    </div>
                </div>
            </main>

            <footer className="fixed bottom-0 left-0 right-0 bg-[#0c0f14]/80 backdrop-blur-sm z-30">
                 <div className="max-w-2xl mx-auto p-4">
                    <button
                        onClick={handleSaveChanges}
                        className="w-full bg-[#00c2ff] text-black font-bold py-3.5 px-4 rounded-xl hover:bg-white transition-all duration-300 shadow-[0_4px_20px_rgba(0,194,255,0.4)]"
                    >
                        Salvar Alterações
                    </button>
                </div>
            </footer>
        </div>
    );
};
