
import React from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

interface FormularioStripePayNowProps {
    onBack: () => void;
}

/**
 * Componente visual que renderiza as instruções de pagamento para PayNow.
 * Utiliza o PaymentElement da Stripe para exibir o QR Code e as instruções
 * necessárias para pagamentos em tempo real em Singapura.
 */
export const FormularioStripePayNow: React.FC<FormularioStripePayNowProps> = ({ onBack }) => {
    const stripe = useStripe();
    const elements = useElements();

    const paymentElementOptions = {
        layout: "tabs" as const,
    };

    return (
        <div className="w-full max-w-md mx-auto bg-[#0f1b2a] p-8 rounded-lg shadow-lg">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white">Pay with PayNow</h2>
                <p className="text-gray-400 mt-2">Scan the QR code with your banking app to complete the payment.</p>
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
                    <p className="text-xs font-black text-gray-500 uppercase tracking-widest mt-3">Loading QR Code...</p>
                </div>
            )}
            
            <div className="text-center text-xs text-gray-500 font-black uppercase tracking-widest my-6">
                Waiting for payment confirmation
                <i className="fa-solid fa-clock text-sm text-[#00c2ff] ml-2"></i>
            </div>

            <div className="text-center">
                <button onClick={onBack} className="text-sm text-gray-400 hover:text-white">
                    Cancel and choose another method
                </button>
            </div>
        </div>
    );
};
