
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HookConfiguracaoProvedor } from '../hooks/Hook.Configuracao.Provedor';
import { SyncPayCard } from '../Componentes/ComponentesDeProvedores/CardsDeConexao/SyncPayCard';
import { StripeCard } from '../Componentes/ComponentesDeProvedores/CardsDeConexao/StripeCard';
import { PayPalCard } from '../Componentes/ComponentesDeProvedores/CardsDeConexao/PayPalCard';

export const ProviderConfig: React.FC = () => {
    const navigate = useNavigate();
    const {
        group,
        activeProviderId,
        handleCredentialsSubmit,
        handleDisconnect,
        handleSelectProvider
    } = HookConfiguracaoProvedor();

    const handleBack = () => navigate(-1);

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#0c0f14,_#0a0c10)] text-white font-['Inter'] flex flex-col">
            <header className="flex items-center justify-between p-4 bg-[#0c0f14] fixed w-full z-10 border-b border-white/10 top-0 h-[65px]">
                <button onClick={handleBack} aria-label="Voltar"><i className="fa-solid fa-arrow-left"></i></button>
                <h1 className="text-[20px] font-semibold">Provedores de Pagamento</h1>
                <div style={{width: '24px'}}></div>
            </header>
            <main className="pt-[80px] pb-[40px] w-full max-w-[600px] mx-auto px-5 flex flex-col gap-4">
                <SyncPayCard
                    group={group}
                    activeProviderId={activeProviderId}
                    onCredentialsSubmit={handleCredentialsSubmit}
                    onDisconnect={handleDisconnect}
                    onSelectProvider={handleSelectProvider}
                />
                <StripeCard
                    group={group}
                    activeProviderId={activeProviderId}
                    onCredentialsSubmit={handleCredentialsSubmit}
                    onDisconnect={handleDisconnect}
                    onSelectProvider={handleSelectProvider}
                />
                <PayPalCard
                    group={group}
                    activeProviderId={activeProviderId}
                    onCredentialsSubmit={handleCredentialsSubmit}
                    onDisconnect={handleDisconnect}
                    onSelectProvider={handleSelectProvider}
                />
            </main>
        </div>
    );
};
