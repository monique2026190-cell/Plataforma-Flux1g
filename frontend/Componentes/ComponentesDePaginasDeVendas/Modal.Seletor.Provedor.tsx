
import React from 'react';
import { Country } from './Modal.Seletor.Pais';
import { ModalPreviaSyncPay } from './Modal.Previa.SyncPay';
import { ModalPreviaStripe } from './Modal.Previa.Stripe';
import { ModalPreviaPayPal } from './Modal.Previa.PayPal';

interface ModalSeletorProvedorProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (provider: 'syncpay' | 'stripe' | 'paypal', country: Country) => void;
}

export const ModalSeletorProvedor: React.FC<ModalSeletorProvedorProps> = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="simulator-modal fixed inset-0 bg-black/90 z-[150] flex items-center justify-center p-4 backdrop-blur-md animate-fade-in" onClick={onClose}>
            <style>{`
                .simulator-card {
                    background: #0c0f14; 
                    border-radius: 28px; 
                    padding: 24px; 
                    width: 100%; 
                    max-width: 400px; 
                    border: 1px solid rgba(0, 194, 255, 0.3); 
                    box-shadow: 0 20px 60px rgba(0,0,0,0.8);
                }
                .provider-btn {
                    width: 100%;
                    padding: 18px;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    cursor: pointer;
                    transition: 0.2s;
                    margin-bottom: 10px;
                }
                .provider-btn:hover { border-color: #00c2ff; background: rgba(0, 194, 255, 0.05); }
            `}</style>
            <div className="simulator-card animate-pop-in" onClick={e => e.stopPropagation()}>
                <div className="text-center mb-6">
                    <h3 className="text-lg font-black text-white uppercase tracking-tight">
                        Escolha o Provedor para Simular
                    </h3>
                </div>

                <div className="animate-fade-in">
                    <ModalPreviaSyncPay onConfirm={onConfirm} />
                    <ModalPreviaStripe onConfirm={onConfirm} />
                    <ModalPreviaPayPal onConfirm={onConfirm} />
                </div>
                
                <button className="w-full mt-8 py-2 text-gray-600 font-black uppercase text-[10px] tracking-[3px] hover:text-white transition-colors" onClick={onClose}>
                    Cancelar
                </button>
            </div>
        </div>
    );
};
