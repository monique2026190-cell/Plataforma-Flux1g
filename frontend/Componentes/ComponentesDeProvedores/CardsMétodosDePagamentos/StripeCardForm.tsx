
import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { GeoData } from '../../../ServiçosFrontend/geoService';

interface StripeCardFormProps {
    geo: GeoData | null;
    onBack: () => void;
    onSuccess: () => void; // Importante: veja a nota sobre o redirecionamento
}

/**
 * Formulário de Pagamento com a abordagem moderna do Stripe (PaymentElement).
 * Garante compatibilidade com 3D Secure e múltiplos métodos de pagamento.
 */
export const StripeCardForm: React.FC<StripeCardFormProps> = ({ geo, onBack, onSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handlePay = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            setErrorMessage("Stripe não foi inicializado corretamente.");
            return;
        }

        setLoading(true);
        setErrorMessage(null);

        // Confirma o pagamento. A Stripe cuidará de qualquer etapa extra,
        // como redirecionar o cliente para a página de autenticação do banco.
        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Essencial: A URL para onde o cliente retornará após a tentativa de pagamento.
                // Você precisará criar uma página nesta rota para exibir o status final.
                return_url: `${window.location.origin}/payment-status`,
            },
        });

        // Este código só é alcançado se houver um erro *imediato* na validação,
        // antes de qualquer redirecionamento.
        if (error.type === "card_error" || error.type === "validation_error") {
            setErrorMessage(error.message || "Ocorreu um erro com os dados do seu cartão.");
        } else {
            setErrorMessage("Ocorreu um erro inesperado. Por favor, tente novamente.");
        }

        setLoading(false);
    };

    return (
        <form onSubmit={handlePay} className="animate-fade-in text-left">
            <button type="button" onClick={onBack} className="text-gray-500 text-[10px] font-black uppercase mb-6 hover:text-white">
                <i className="fa-solid fa-arrow-left"></i> Voltar aos métodos
            </button>

            <div className="space-y-4">
                <div>
                    <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-2 block">
                        Pague com Cartão, Apple Pay ou Google Pay
                    </label>
                    {/* O PaymentElement substitui os campos de formulário antigos */}
                    <PaymentElement id="payment-element" />
                </div>

                {errorMessage && (
                    <div className="text-red-500 text-xs text-center py-3 font-bold">
                        {errorMessage}
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={!stripe || loading}
                    className="w-full py-4 bg-[#00c2ff] text-black font-black rounded-xl shadow-lg mt-6 active:scale-95 transition-all disabled:bg-gray-700 disabled:cursor-not-allowed"
                >
                    {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : 'PAGAR COM SEGURANÇA'}
                </button>
            </div>
        </form>
    );
};
