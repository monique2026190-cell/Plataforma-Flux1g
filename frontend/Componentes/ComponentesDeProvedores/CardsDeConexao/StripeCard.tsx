
import React, { useState } from 'react';
import { Group } from '../../../types';
import { createStripeAccountLink } from '../../../ServiçosFrontend/ServiçoDeProvedoresDePagamentos/ServiçoGestãoCredencialStripe.js';

interface StripeCardProps {
    group: Group | null;
    activeProviderId: string | null;
    onCredentialsSubmit: (providerId: string, credentials: any) => Promise<void>;
    onDisconnect: (providerId: string) => Promise<void>;
    onSelectProvider: (providerId: string) => Promise<void>;
}

/**
 * Card para conectar e gerenciar a conta Stripe de um vendedor via Stripe Connect.
 */
export const StripeCard: React.FC<StripeCardProps> = ({ group, activeProviderId, onDisconnect, onSelectProvider, onCredentialsSubmit }) => {
    const [isConnecting, setIsConnecting] = useState(false);

    const isConnected = group?.paymentConfig?.stripe?.isConnected || false;
    const accountId = group?.paymentConfig?.stripe?.accountId;
    const isActive = activeProviderId === 'stripe';

    const handleConnect = async () => {
        if (!group) {
            alert("Informações do grupo não encontradas. Não é possível conectar.");
            return;
        }

        setIsConnecting(true);
        try {
            const { url, accountId: newAccountId } = await createStripeAccountLink({
                accountId: accountId,
                return_url: window.location.href,
                refresh_url: window.location.href,
            });

            if (newAccountId && newAccountId !== accountId) {
                await onCredentialsSubmit('stripe', { accountId: newAccountId, isConnected: false });
            }

            window.location.href = url;

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Ocorreu um erro desconhecido.";
            alert(`Erro ao conectar com a Stripe: ${errorMessage}`);
            setIsConnecting(false);
        }
    };

    const handleDisconnect = async () => {
        if (window.confirm("Tem certeza que deseja desconectar o Stripe?")) {
            await onDisconnect('stripe');
        }
    };

    return (
        <div className={`provider-card ${isActive ? 'active-card' : ''}`}>
            <div className="provider-header">
                <div className="provider-title">
                    <i className="fa-brands fa-stripe"></i>
                    <span>Stripe</span>
                </div>
                <div className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
                    <div className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}></div>
                    <span>{isConnected ? 'Conectado' : 'Desconectado'}</span>
                </div>
            </div>

            <div className="provider-actions flex flex-col gap-3">
                {!isConnected ? (
                    <button onClick={handleConnect} disabled={isConnecting} className="action-button primary">
                        {isConnecting ? 'CONECTANDO...' : 'CONECTAR'}
                    </button>
                ) : (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-white/60">Selecionar</span>
                            <div onClick={() => onSelectProvider('stripe')} className={`select-switch ${isActive ? 'selected' : ''}`}>
                                <div className="select-switch-handle"></div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={handleConnect} disabled={isConnecting} className="action-button">
                                {isConnecting ? '...' : 'ATUALIZAR'}
                            </button>
                            <button onClick={handleDisconnect} className="action-button danger">
                                DESCONECTAR
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
