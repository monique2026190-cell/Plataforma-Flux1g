
import React, { useState } from 'react';
import { useFluxoDePagamentoSyncPay } from '../../../hooks/HooksComponentes/Hook.Fluxo.De.Pagamento.SyncPay';
import { Group } from '../../../types';
import { SyncPayPixView } from '../CardsMétodosDePagamentos/SyncPayPixView';
import { SyncPayBoletoView } from '../CardsMétodosDePagamentos/SyncPayBoletoView';
import { SYNC_PAY_REGIONAL_MATRIX } from './PaísesMapeadosSyncPay'; // Importando a configuração

interface ModalOpcoesPagamentosSyncPayProps {
    group: Group;
    onSuccess: () => void;
    onError: (msg: string) => void;
    onTransactionId: (id: string) => void;
}

export const ModalOpcoesPagamentosSyncPay: React.FC<ModalOpcoesPagamentosSyncPayProps> = (props) => {
    const { 
        currentView,
        setCurrentView,
        isLoading,
        pixCode,
        pixImage,
        boletoUrl,
        generatePayment,
    } = useFluxoDePagamentoSyncPay(props);

    const [isCopied, setIsCopied] = useState(false);

    // Pega a configuração regional (atualmente, só Brasil)
    const region = SYNC_PAY_REGIONAL_MATRIX['BR'];

    const handleCopyPix = async () => {
        if (!pixCode) return;
        await navigator.clipboard.writeText(pixCode);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    if (isLoading) {
        return <div className="py-10 text-center"><i className="fa-solid fa-circle-notch fa-spin text-3xl text-[#00c2ff] mb-2"></i><p className="text-xs text-gray-500">Gerando seu pagamento...</p></div>;
    }

    return (
        <div className="animate-fade-in">
            {currentView === 'selection' && (
                <div className="animate-fade-in">
                    <h3 className="text-lg font-bold text-white mb-4">Escolha como pagar</h3>
                    <div className="space-y-3">
                        {/* Renderização dinâmica dos métodos de pagamento */}
                        {region.methods.map((method: any) => (
                            <button 
                                key={method.id}
                                onClick={() => generatePayment(method.id)}
                                className="w-full p-4 bg-white/5 border border-[#00c2ff]/50 rounded-xl flex items-center gap-4 hover:bg-white/10 transition-all"
                            >
                                <div style={{ backgroundColor: `${method.color}1a`, color: method.color }} className="w-10 h-10 rounded-lg flex items-center justify-center">
                                    <i className={`${method.icon} text-xl`}></i>
                                </div>
                                <div className="text-left">
                                    <div className="font-bold text-sm">{method.title}</div>
                                    <div className="text-[10px] text-gray-500">{method.sub}</div>
                                </div>
                                <i className="fa-solid fa-chevron-right ml-auto text-gray-600 text-xs"></i>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {currentView === 'pix' && (
                <SyncPayPixView 
                    pixCode={pixCode}
                    pixImage={pixImage}
                    isCopied={isCopied}
                    onCopy={handleCopyPix}
                    onBack={() => setCurrentView('selection')}
                />
            )}

            {currentView === 'boleto' && (
                <SyncPayBoletoView 
                    boletoUrl={boletoUrl}
                    onBack={() => setCurrentView('selection')}
                />
            )}

            {currentView !== 'selection' && (
                <div className="text-[10px] text-gray-500 mt-6 animate-pulse">
                    <i className="fa-solid fa-spinner fa-spin mr-2"></i>Aguardando confirmação do banco...
                </div>
            )}
        </div>
    );
};
