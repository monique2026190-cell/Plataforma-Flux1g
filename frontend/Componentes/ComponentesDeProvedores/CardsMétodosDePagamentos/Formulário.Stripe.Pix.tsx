
import React from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

interface FormularioStripePixProps {
    onBack: () => void;
}

/**
 * Componente visual que renderiza as instruções de pagamento para Pix.
 * Ele usa o PaymentElement da Stripe, que automaticamente exibe o QR Code
 * e o código "copia e cola" com base no clientSecret fornecido pelo Gestor.
 */
export const FormularioStripePix: React.FC<FormularioStripePixProps> = ({ onBack }) => {
    const stripe = useStripe();
    const elements = useElements();

    const paymentElementOptions = {
        layout: "tabs" as const,
    };

    return (
        <div className="w-full max-w-md mx-auto bg-[#0f1b2a] p-8 rounded-lg shadow-lg">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white">Pague com Pix</h2>
                <p className="text-gray-400 mt-2">Abra o app do seu banco e escaneie o código abaixo para pagar.</p>
            </div>

            {stripe && elements ? (
                <PaymentElement 
                    id="payment-element"
                    options={paymentElementOptions}
                    className="mb-6"
                />
            ) : (
                <div className="py-10 text-center animate-pulse">
                    <i className="fa-solid fa-circle-notch fa-spin text-2xl text-[#00c2ff]"></i>
                    <p className="text-xs font-black text-gray-500 uppercase tracking-widest mt-3">Carregando interface de pagamento...</p>
                </div>
            )}
            
            <div className="text-center text-xs text-gray-500 font-black uppercase tracking-widest my-6">
                Aguardando confirmação do pagamento
                <i className="fa-solid fa-wifi text-sm text-[#00c2ff] ml-2"></i>
            </div>

            <div className="text-center">
                <button onClick={onBack} className="text-sm text-gray-400 hover:text-white">
                    Cancelar e escolher outro método
                </button>
            </div>
        </div>
    );
};
