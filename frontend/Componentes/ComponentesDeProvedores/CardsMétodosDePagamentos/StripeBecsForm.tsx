
import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { GeoData } from '../../../ServiçosFrontend/geoService';
import { Group } from '../../../types';

interface StripeBecsFormProps {
    geo: GeoData | null;
    group: Group;
    creatorEmail: string;
    onBack: () => void;
    onSuccess: (paymentIntentId: string) => void;
}

/**
 * Formulário para Débito Direto BECS (Contas da Austrália) usando o PaymentElement.
 * A Stripe renderiza o formulário apropriado, incluindo o mandato de débito (DDR),
 * e lida com a coleta segura dos dados bancários (BSB e número da conta).
 */
export const StripeBecsForm: React.FC<StripeBecsFormProps> = ({ geo, group, creatorEmail, onBack, onSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            setErrorMessage("Stripe não foi inicializado corretamente.");
            return;
        }

        setLoading(true);
        setErrorMessage(null);

        // Confirma o pagamento. A Stripe cuidará de coletar os dados,
        // exibir o mandato e confirmar a intenção de pagamento.
        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Essencial: A URL para onde o cliente retornará após a tentativa de pagamento.
                // O status do pagamento BECS ficará pendente por alguns dias.
                return_url: `${window.location.origin}/payment-status`,
                payment_method_data: {
                    billing_details: {
                        // Nome e e-mail são necessários para pagamentos BECS.
                        name: group.creatorName, 
                        email: creatorEmail
                    }
                }
            },
        });

        // Este código só é alcançado se houver um erro *imediato* na validação,
        // como um e-mail ausente, antes de qualquer redirecionamento.
        if (error) {
            if (error.type === "card_error" || error.type === "validation_error") {
                setErrorMessage(error.message || "Ocorreu um erro com os dados da sua conta.");
            } else {
                setErrorMessage("Ocorreu um erro inesperado. Por favor, tente novamente.");
            }
            setLoading(false);
        } else {
            // O pagamento foi iniciado. O status será 'processing'.
            // O sucesso final é determinado por webhooks do servidor.
            if (paymentIntent) {
                console.log("Pagamento BECS iniciado com sucesso: ", paymentIntent);
                onSuccess(paymentIntent.id);
            } else {
                // Se por algum motivo o paymentIntent não for retornado, redirecione para a página de status geral
                window.location.href = `${window.location.origin}/payment-status`;
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="animate-fade-in text-left">
            <button type="button" onClick={onBack} className="text-gray-500 text-[10px] font-black uppercase mb-6 hover:text-white">
                <i className="fa-solid fa-arrow-left mr-2"></i> Voltar
            </button>

            <div className="space-y-4">
                {/* O PaymentElement renderizará automaticamente o formulário BECS */}
                <PaymentElement id="payment-element" />

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
                    {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : 'CONFIRMAR DÉBITO BECS'}
                </button>
            </div>
        </form>
    );
};
