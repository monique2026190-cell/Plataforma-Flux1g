
import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { GeoData } from '../../../ServiçosFrontend/geoService';
import { Group } from '../../../types';

interface StripeBacsFormProps {
    geo: GeoData | null;
    group: Group;
    creatorEmail: string;
    onBack: () => void;
    onSuccess: (paymentIntentId: string) => void;
}

/**
 * Formulário para Débito Direto BACS (Contas do Reino Unido) usando o PaymentElement.
 * A Stripe renderiza o formulário apropriado, incluindo o mandato de Débito Direto,
 * e lida com a coleta segura dos dados bancários.
 */
export const StripeBacsForm: React.FC<StripeBacsFormProps> = ({ geo, group, creatorEmail, onBack, onSuccess }) => {
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
                // A confirmação do BACS não precisa de um `return_url` da mesma forma que ACH ou PADs,
                // pois o mandato é coletado e confirmado no próprio formulário.
                // O pagamento em si leva dias para ser processado, o que é notificado via webhooks.
                return_url: `${window.location.origin}/payment-status`,
                payment_method_data: {
                    billing_details: {
                        name: group.creatorName, 
                        email: creatorEmail
                    }
                }
            },
            // Redireciona para a `return_url` apenas se houver uma próxima ação necessária (como autenticação extra)
            // A confirmação do BACS geralmente é imediata (para o mandato), então não esperamos redirecionamento.
            redirect: 'if_required'
        });

        if (error) {
            if (error.type === "card_error" || error.type === "validation_error") {
                setErrorMessage(error.message || "Ocorreu um erro com os dados da sua conta.");
            } else {
                setErrorMessage("Ocorreu um erro inesperado. Por favor, tente novamente.");
            }
            setLoading(false);
        } else {
            // O mandato foi aceito e o pagamento foi iniciado.
            // O status do pagamento ficará como 'processing' por alguns dias.
            // O sucesso final é determinado por webhooks.
            if (paymentIntent) {
                console.log("Pagamento BACS iniciado com sucesso: ", paymentIntent);
                onSuccess(paymentIntent.id);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="animate-fade-in text-left">
            <button type="button" onClick={onBack} className="text-gray-500 text-[10px] font-black uppercase mb-6 hover:text-white">
                <i className="fa-solid fa-arrow-left mr-2"></i> Voltar
            </button>

            <div className="space-y-4">
                {/* O PaymentElement renderizará automaticamente o formulário BACS */}
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
                    {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : 'CONFIRMAR DÉBITO BACS'}
                </button>
            </div>
        </form>
    );
};
