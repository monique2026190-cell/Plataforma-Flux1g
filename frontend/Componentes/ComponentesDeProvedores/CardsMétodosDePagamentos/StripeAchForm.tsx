
import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { GeoData } from '../../../ServiçosFrontend/geoService';
import { Group } from '../../../types';

interface StripeAchFormProps {
    geo: GeoData | null;
    group: Group;
    creatorEmail: string;
    onBack: () => void;
    onSuccess: (paymentIntentId: string) => void;
}

/**
 * Formulário para Débito Direto ACH (Contas dos EUA) usando o PaymentElement.
 * Esta abordagem moderna permite que a Stripe renderize a UI apropriada
 * para coletar e verificar os detalhes da conta bancária de forma segura.
 */
export const StripeAchForm: React.FC<StripeAchFormProps> = ({ geo, group, creatorEmail, onBack, onSuccess }) => {
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
        // obter um mandato e redirecionar para verificação, se necessário.
        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Essencial: A URL para onde o cliente retornará após a tentativa de pagamento.
                // O status do pagamento ACH ficará pendente por alguns dias.
                return_url: `${window.location.origin}/payment-status`,
                payment_method_data: {
                    billing_details: {
                        // O nome e o e-mail são necessários para pagamentos ACH.
                        name: group.creatorName, // Usando o nome do criador do grupo como exemplo
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
                console.log("Pagamento ACH iniciado com sucesso: ", paymentIntent);
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
                {/* O PaymentElement renderizará automaticamente o formulário ACH */}
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
                    {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : 'AUTORIZAR DÉBITO ACH'}
                </button>
            </div>
        </form>
    );
};
