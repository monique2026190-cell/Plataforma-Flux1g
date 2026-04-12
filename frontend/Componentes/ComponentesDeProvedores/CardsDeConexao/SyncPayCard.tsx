
import React, { useState } from 'react';
import { Group } from '../../../types';
import { ProviderCredentialsModal } from '../../financial/ProviderCredentialsModal';

interface SyncPayCardProps {
    group: Group | null;
    activeProviderId: string | null;
    onCredentialsSubmit: (providerId: string, credentials: any) => Promise<void>;
    onDisconnect: (providerId: string) => Promise<void>;
    onSelectProvider: (providerId: string) => Promise<void>;
}

export const SyncPayCard: React.FC<SyncPayCardProps> = ({ group, activeProviderId, onCredentialsSubmit, onDisconnect, onSelectProvider }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const config = group?.paymentConfig?.syncpay;
    const isConnected = !!config?.isConnected;
    const isActive = activeProviderId === 'syncpay';

    const handleSaveCredentials = async (credentials: Record<string, string>) => {
        await onCredentialsSubmit('syncpay', credentials);
    };

    const handleDisconnect = async () => {
        if (window.confirm("Tem certeza que deseja desconectar o SyncPay?")) {
            await onDisconnect('syncpay');
        }
    };

    const fields = [
        { name: 'publicKey', label: 'Public Key', type: 'text', placeholder: 'pk_live_...' },
        { name: 'privateKey', label: 'Private Key', type: 'password', placeholder: '••••••••' },
    ];

    return (
        <>
            <div className={`provider-card ${isActive ? 'active-card' : ''}`}>
                <div className="provider-header">
                    <div className="provider-title">
                        <i className="fa-solid fa-bolt"></i>
                        <span>SyncPay</span>
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
                                <div onClick={() => onSelectProvider('syncpay')} className={`select-switch ${isActive ? 'selected' : ''}`}>
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
                providerName="SyncPay"
                fields={fields}
                onSave={handleSaveCredentials}
                existingCredentials={config}
            />
        </>
    );
};
