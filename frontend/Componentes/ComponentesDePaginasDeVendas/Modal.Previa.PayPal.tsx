
import React, { useState } from 'react';
import { ModalSeletorPais, Country } from './Modal.Seletor.Pais';

interface ModalPreviaPayPalProps {
    onConfirm: (provider: 'paypal', country: Country) => void;
}

const PAYPAL_COUNTRIES: Country[] = [
    { code: 'US', name: 'Estados Unidos', currency: 'USD', flag: '🇺🇸' },
    { code: 'EU', name: 'Europa', currency: 'EUR', flag: '🇪🇺' },
    { code: 'GB', name: 'Reino Unido', currency: 'GBP', flag: '🇬🇧' },
    { code: 'CA', name: 'Canadá', currency: 'CAD', flag: '🇨🇦' },
    { code: 'SG', name: 'Singapura', currency: 'SGD', flag: '🇸🇬' },
    { code: 'AU', name: 'Austrália', currency: 'AUD', flag: '🇦🇺' },
    { code: 'MX', name: 'México', currency: 'MXN', flag: '🇲🇽' },
    { code: 'JP', name: 'Japão', currency: 'JPY', flag: '🇯🇵' },
    { code: 'IN', name: 'Índia', currency: 'INR', flag: '🇮🇳' },
    { code: 'BR', name: 'Brasil', currency: 'BRL', flag: '🇧🇷' },
];

export const ModalPreviaPayPal: React.FC<ModalPreviaPayPalProps> = ({ onConfirm }) => {
    const [isCountrySelectorOpen, setCountrySelectorOpen] = useState(false);

    const handleSelectCountry = (country: Country) => {
        onConfirm('paypal', country);
        setCountrySelectorOpen(false);
    };

    return (
        <>
            <button className="provider-btn" onClick={() => setCountrySelectorOpen(true)}>
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#00308711] rounded-xl flex items-center justify-center text-[#003087]">
                        <i className="fa-brands fa-paypal"></i>
                    </div>
                    <div className="text-left">
                        <span className="block text-sm font-bold">PayPal</span>
                        <span className="block text-[10px] text-gray-500 font-bold uppercase">Carteira Digital</span>
                    </div>
                </div>
                <i className="fa-solid fa-chevron-right text-gray-800 text-xs"></i>
            </button>

            <ModalSeletorPais 
                isOpen={isCountrySelectorOpen} 
                onClose={() => setCountrySelectorOpen(false)} 
                onSelect={handleSelectCountry} 
                countries={PAYPAL_COUNTRIES} 
                providerName="PayPal"
            />
        </>
    );
};
