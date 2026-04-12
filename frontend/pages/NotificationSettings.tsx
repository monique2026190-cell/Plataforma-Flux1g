
import React from 'react';
import { useNotificationSettings } from '../hooks/useNotificationSettings';

// Subcomponentes Modulares
import { GlobalPauseCard } from '../Componentes/ComponentesDeNotifications/Componentes/settings/GlobalPauseCard';
import { SocialSection } from '../Componentes/ComponentesDeNotifications/Componentes/settings/SocialSection';
import { CommunicationSection } from '../Componentes/ComponentesDeNotifications/Componentes/settings/CommunicationSection';
import { BusinessSection } from '../Componentes/ComponentesDeNotifications/Componentes/settings/BusinessSection';
import { EmailPreferencesSection } from '../Componentes/ComponentesDeNotifications/Componentes/settings/EmailPreferencesSection';

export const NotificationSettings: React.FC = () => {
    const {
        settings,
        isSyncing,
        initialLoading,
        toggleSetting,
        handleBack
    } = useNotificationSettings();

    // Mostra um indicador de carregamento enquanto as configurações iniciais são buscadas
    if (initialLoading) {
        return (
            <div className="h-screen bg-[radial-gradient(circle_at_top_left,_#0c0f14,_#0a0c10)] text-white font-['Inter'] flex flex-col items-center justify-center">
                <i className="fa-solid fa-circle-notch fa-spin text-2xl text-[#00c2ff]"></i>
            </div>
        );
    }

    return (
        <div className="h-screen bg-[radial-gradient(circle_at_top_left,_#0c0f14,_#0a0c10)] text-white font-['Inter'] flex flex-col overflow-hidden">
            <header className="flex items-center p-4 bg-[#0c0f14] fixed w-full top-0 z-50 border-b border-white/10 h-[65px]">
                <button onClick={handleBack} className="bg-none border-none text-white text-2xl cursor-pointer pr-4">
                    <i className="fa-solid fa-arrow-left"></i>
                </button>
                <div className="flex-1">
                    <h1 className="text-lg font-bold">Notificações</h1>
                    {isSyncing && (
                        <span className="text-[9px] text-[#00c2ff] font-black uppercase tracking-widest animate-pulse">
                            Sincronizando...
                        </span>
                    )}
                </div>
            </header>

            <main className="flex-1 overflow-y-auto pt-[85px] pb-10 px-5 max-w-[600px] mx-auto w-full no-scrollbar">
                
                <GlobalPauseCard 
                    enabled={settings.pauseAll} 
                    onToggle={() => toggleSetting('pauseAll')} 
                />

                <div className="space-y-2 mt-6">
                    <SocialSection 
                        settings={settings} 
                        onToggle={toggleSetting} 
                        disabled={settings.pauseAll} 
                    />

                    <CommunicationSection 
                        settings={settings} 
                        onToggle={toggleSetting} 
                        disabled={settings.pauseAll} 
                    />

                    <BusinessSection 
                        settings={settings} 
                        onToggle={toggleSetting} 
                        disabled={settings.pauseAll} 
                    />

                    <EmailPreferencesSection 
                        settings={settings} 
                        onToggle={toggleSetting} 
                    />
                </div>

                <div className="bg-white/5 p-5 rounded-2xl border border-dashed border-white/10 opacity-40 mb-10">
                    <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest leading-relaxed text-center">
                        <i className="fa-solid fa-shield-halved mr-1"></i> Notificações críticas de segurança e transações financeiras não podem ser desativadas.
                    </p>
                </div>
            </main>
        </div>
    );
};
