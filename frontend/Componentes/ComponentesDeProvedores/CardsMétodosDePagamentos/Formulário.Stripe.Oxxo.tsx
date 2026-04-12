
import React from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

interface FormularioStripeOxxoProps {
    onBack: () => void;
}

/**
 * Componente visual que renderiza as instruções de pagamento para OXXO.
 * Utiliza o PaymentElement da Stripe para exibir o voucher com código de barras
 * e todas as informações necessárias que a Stripe fornece para pagamentos OXXO.
 */
export const FormularioStripeOxxo: React.FC<FormularioStripeOxxoProps> = ({ onBack }) => {
    const stripe = useStripe();
    const elements = useElements();

    const paymentElementOptions = {
        layout: "tabs" as const,
    };

    return (
        <div className="w-full max-w-md mx-auto bg-[#0f1b2a] p-8 rounded-lg shadow-lg">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white">Pagar en OXXO</h2>
                <p className="text-gray-400 mt-2">Usa el siguiente voucher para pagar en cualquier tienda OXXO.</p>
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
                    <p className="text-xs font-black text-gray-500 uppercase tracking-widest mt-3">Cargando información del voucher...</p>
                </div>
            )}
            
            <div className="text-center text-xs text-gray-500 font-black uppercase tracking-widest my-6">
                Esperando la confirmación del pago
                <i className="fa-solid fa-clock text-sm text-[#00c2ff] ml-2"></i>
            </div>

            <div className="text-center">
                <button onClick={onBack} className="text-sm text-gray-400 hover:text-white">
                    Cancelar y elegir otro método
                </button>
            </div>
        </div>
    );
};
