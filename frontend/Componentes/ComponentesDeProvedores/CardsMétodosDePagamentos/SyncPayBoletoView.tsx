
import React from 'react';

interface SyncPayBoletoViewProps {
    boletoUrl: string;
    onBack: () => void;
}

export const SyncPayBoletoView: React.FC<SyncPayBoletoViewProps> = ({ boletoUrl, onBack }) => {
    return (
        <div className="animate-fade-in">
            <h3 className="text-lg font-bold text-white mb-2">Boleto Gerado</h3>
            <i className="fa-solid fa-file-pdf text-6xl text-red-500 my-6"></i>
            <p className="text-gray-400 text-xs mb-6 px-4">Seu boleto foi gerado. Você pode pagar em qualquer banco ou casa lotérica.</p>
            <button 
                onClick={() => window.open(boletoUrl, '_blank')} 
                className="w-full py-4 bg-white text-black rounded-lg font-bold flex items-center justify-center gap-2"
            >
                <i className="fa-solid fa-download"></i> ABRIR BOLETO (PDF)
            </button>
            <button 
                onClick={onBack} 
                className="mt-4 text-[10px] text-[#00c2ff] underline"
            >
                Trocar método de pagamento
            </button>
        </div>
    );
};
