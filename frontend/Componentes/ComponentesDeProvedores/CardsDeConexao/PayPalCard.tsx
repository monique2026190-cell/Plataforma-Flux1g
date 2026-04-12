
import React, { useState } from 'react';
import { Group } from '../../../types';
import { ProviderCredentialsModal } from '../../financial/ProviderCredentialsModal';

interface PayPalCardProps {
    group: Group | null;
    activeProviderId: string | null;
    onCredentialsSubmit: (providerId: string, credentials: any) => Promise<void>;
    onDisconnect: (providerId: string) => Promise<void>;
    onSelectProvider: (providerId: string) => Promise<void>;
}

export const PayPalCard: React.FC<PayPalCardProps> = ({ group, activeProviderId, onCredentialsSubmit, onDisconnect, onSelectProvider }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const config = group?.paymentConfig?.paypal;
    const isConnected = !!config?.isConnected;
    const isActive = activeProviderId === 'paypal';

    const handleSaveCredentials = async (credentials: Record<string, string>) => {
        await onCredentialsSubmit('paypal', credentials);
    };

    const handleDisconnect = async () => {
        if (window.confirm("Tem certeza que deseja desconectar o PayPal?")) {
            await onDisconnect('paypal');
        }
    };

    const fields = [
        { name: 'clientId', label: 'Client ID', type: 'text', placeholder: 'AY...' },
        { name: 'secretKey', label: 'Secret Key', type: 'password', placeholder: '••••••••' },
    ];

    return (
        <>
            <div className={`provider-card ${isActive ? 'active-card' : ''}`}>
                <div className="provider-header">
                    <div className="provider-title">
                        <i className="fa-brands fa-paypal"></i>
                        <span>PayPal</span>
                    </div>
                    <div className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
                        <div className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}></div>
                        <span>{isConnected ? 'Conectado' : 'Desconectado'}</span>
                    </div>
                </div>

                <div className="provider-actions flex flex-col gap-3">
                    {!isConnected ? (
                        <button onClick={() => setIsModalOpen(true)} className="action-button primary">
                            CONECTAR
                        </button>
                    ) : (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-white/60">Selecionar</span>
                                <div onClick={() => onSelectProvider('paypal')} className={`select-switch ${isActive ? 'selected' : ''}`}>
                                    <div className="select-switch-handle"></div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => setIsModalOpen(true)} className="action-button">
                                    ATUALIZAR
                                </button>
                                <button onClick={handleDisconnect} className="action-button danger">
                                    DESCONECTAR
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <ProviderCredentialsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                providerName="PayPal"
                fields={fields}
                onSave={handleSaveCredentials}
                existingCredentials={config}
            />
        </>
    );
};
