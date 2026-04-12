
import React from 'react';

// Definindo a interface aqui para que possa ser usada em outros arquivos
export interface Country {
    code: string;
    name: string;
    currency: string;
    flag: string;
}

interface ModalSeletorPaisProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (country: Country) => void;
    countries: Country[];
    providerName: string;
}

export const ModalSeletorPais: React.FC<ModalSeletorPaisProps> = ({ isOpen, onClose, onSelect, countries, providerName }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/90 z-[160] flex items-center justify-center p-4 backdrop-blur-md animate-fade-in" onClick={onClose}>
            <style>{`
                .country-selector-card {
                    background: #0c0f14; 
                    border-radius: 28px; 
                    padding: 24px; 
                    width: 100%; 
                    max-width: 400px; 
                    border: 1px solid rgba(0, 194, 255, 0.3); 
                    box-shadow: 0 20px 60px rgba(0,0,0,0.8);
                }
                .country-grid {
                    display: grid; 
                    grid-template-columns: repeat(2, 1fr); 
                    gap: 10px; 
                    max-height: 400px;
                    overflow-y: auto;
                    padding-right: 5px;
                }
                .country-btn {
                    background: rgba(255,255,255,0.03); 
                    border: 1px solid rgba(255,255,255,0.08); 
                    padding: 14px; 
                    border-radius: 16px; 
                    display: flex; 
                    align-items: center; 
                    gap: 10px;
                    cursor: pointer; 
                    transition: 0.2s; 
                    font-size: 13px;
                }
                .country-btn:hover { background: #00c2ff11; border-color: #00c2ff; }
            `}</style>
            <div className="country-selector-card animate-pop-in" onClick={e => e.stopPropagation()}>
                <div className="text-center mb-6">
                    <h3 className="text-lg font-black text-white uppercase tracking-tight">
                        Simular com {providerName}
                    </h3>
                    <p className="text-xs text-gray-500">Escolha o mercado para ver a prévia</p>
                </div>
                <div className="country-grid no-scrollbar">
                    {countries.map(c => (
                        <button key={c.code} className="country-btn" onClick={() => onSelect(c)}>
                            <span className="text-xl grayscale-0">{c.flag}</span>
                            <span className="truncate font-bold">{c.name}</span>
                        </button>
                    ))}
                </div>
                <button className="w-full mt-8 py-2 text-gray-600 font-black uppercase text-[10px] tracking-[3px] hover:text-white transition-colors" onClick={onClose}>
                    Cancelar
                </button>
            </div>
        </div>
    );
};
