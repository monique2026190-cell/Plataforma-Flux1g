
import React, { useState } from 'react';
import { ModalSeletorPais, Country } from './Modal.Seletor.Pais';

interface ModalPreviaSyncPayProps {
    onConfirm: (provider: 'syncpay', country: Country) => void;
}

const SYNC_PAY_COUNTRIES: Country[] = [
    { code: 'BR', name: 'Brasil', currency: 'BRL', flag: '🇧🇷' },
];

export const ModalPreviaSyncPay: React.FC<ModalPreviaSyncPayProps> = ({ onConfirm }) => {
    const [isCountrySelectorOpen, setCountrySelectorOpen] = useState(false);

    const handleSelectProvider = () => {
        // Sempre abrir o seletor de país, mesmo que só tenha uma opção
        setCountrySelectorOpen(true);
    };

    const handleSelectCountry = (country: Country) => {
        onConfirm('syncpay', country);
        setCountrySelectorOpen(false);
    };

    return (
        <>
            <button className="provider-btn" onClick={handleSelectProvider}>
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#00ff8211] rounded-xl flex items-center justify-center text-[#00ff82]">
                        <i className="fa-solid fa-bolt"></i>
                    </div>
                    <div className="text-left">
                        <span className="block text-sm font-bold">SyncPay</span>
                        <span className="block text-[10px] text-gray-500 font-bold uppercase">Brasil (Pix/Boleto)</span>
                    </div>
                </div>
                <i className="fa-solid fa-chevron-right text-gray-800 text-xs"></i>
            </button>

            <ModalSeletorPais 
                isOpen={isCountrySelectorOpen} 
                onClose={() => setCountrySelectorOpen(false)} 
                onSelect={handleSelectCountry} 
                countries={SYNC_PAY_COUNTRIES} 
                providerName="SyncPay"
            />
        </>
    );
};
