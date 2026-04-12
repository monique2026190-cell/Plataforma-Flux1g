
import React from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

interface FormularioStripeKonbiniProps {
    onBack: () => void;
}

/**
 * Componente visual que renderiza as instruções de pagamento para Konbini.
 * Utiliza o PaymentElement da Stripe para exibir o código e as instruções 
 * necessárias para pagamentos em lojas de conveniência no Japão.
 */
export const FormularioStripeKonbini: React.FC<FormularioStripeKonbiniProps> = ({ onBack }) => {
    const stripe = useStripe();
    const elements = useElements();

    const paymentElementOptions = {
        layout: "tabs" as const,
    };

    return (
        <div className="w-full max-w-md mx-auto bg-[#0f1b2a] p-8 rounded-lg shadow-lg">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white">コンビニでのお支払い</h2>
                <p className="text-gray-400 mt-2">以下の手順でお支払いください。</p>
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
                    <p className="text-xs font-black text-gray-500 uppercase tracking-widest mt-3">支払い情報を読み込んでいます...</p>
                </div>
            )}
            
            <div className="text-center text-xs text-gray-500 font-black uppercase tracking-widest my-6">
                支払いの確認を待っています
                <i className="fa-solid fa-clock text-sm text-[#00c2ff] ml-2"></i>
            </div>

            <div className="text-center">
                <button onClick={onBack} className="text-sm text-gray-400 hover:text-white">
                    キャンセルして他の方法を選択
                </button>
            </div>
        </div>
    );
};
