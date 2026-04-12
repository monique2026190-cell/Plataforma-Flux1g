
import React, { useState } from 'react';
import { useStripe, useElements, IbanElement } from '@stripe/react-stripe-js';
import { GeoData } from '../../../ServiçosFrontend/geoService';
import { Group } from '../../../types';

interface StripeSepaFormProps {
    geo: GeoData | null;
    group: Group;
    creatorEmail: string;
    onBack: () => void;
    onSuccess: (paymentIntentId: string) => void;
}

/**
 * Formulário de Débito Direto SEPA que utiliza o IbanElement da Stripe.
 * Este componente é responsável por coletar o IBAN do cliente de forma segura
 * e confirmar o pagamento com a Stripe.
 */
export const StripeSepaForm: React.FC<StripeSepaFormProps> = ({ geo, group, creatorEmail, onBack, onSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [name, setName] = useState(''); // Estado para o nome do titular da conta

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            setErrorMessage("Stripe não foi inicializado corretamente.");
            return;
        }

        const ibanElement = elements.getElement(IbanElement);
        if (!ibanElement) {
            setErrorMessage("O campo IBAN não está pronto.");
            return;
        }

        setLoading(true);
        setErrorMessage(null);

        // Confirma o pagamento de débito SEPA
        const { error, paymentIntent } = await stripe.confirmSepaDebitPayment(
            // O clientSecret é obtido implicitamente pelo Elements provider
            elements.getElement(IbanElement)!,
            {
                payment_method: {
                    sepa_debit: ibanElement,
                    billing_details: {
                        name: name, // Nome do titular da conta
                        email: creatorEmail, // Email do cliente
                    },
                },
            }
        );

        if (error) {
            setErrorMessage(error.message || "Ocorreu um erro inesperado. Por favor, tente novamente.");
            setLoading(false);
        } else {
            // Pagamento processado com sucesso (ou pendente de confirmação bancária)
            console.log("Pagamento SEPA iniciado com sucesso: ", paymentIntent);
            onSuccess(paymentIntent.id);
        }
    };

    const ibanElementOptions = {
        supportedCountries: ['SEPA'],
        placeholder: 'DE89 3704 0044 0532 0130 00',
        style: {
            base: {
                fontSize: '16px',
                color: '#ffffff',
                '::placeholder': {
                    color: '#6b7280',
                },
                padding: '16px',
            },
            invalid: {
                color: '#ef4444',
            },
        },
    };

    return (
        <form onSubmit={handleSubmit} className="animate-fade-in text-left">
            <button type="button" onClick={onBack} className="text-gray-500 text-[10px] font-black uppercase mb-6 hover:text-white">
                <i className="fa-solid fa-arrow-left mr-2"></i> Voltar
            </button>

            <div className="space-y-5">
                <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl mb-4">
                    <p className="text-[10px] text-blue-300 font-bold leading-relaxed">
                        Ao fornecer seu IBAN, você autoriza a Stripe e o nosso serviço a enviar instruções ao seu banco para debitar sua conta.
                    </p>
                </div>

                <div className="input-group mb-0">
                    <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1 block">Nome do Titular</label>
                    <input 
                        className="input-field w-full" 
                        placeholder="Nome completo" 
                        required 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="input-group mb-0">
                    <label className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1 block">IBAN</label>
                    <div className="input-field">
                         <IbanElement options={ibanElementOptions} />
                    </div>
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
                    {loading ? <i className="fa-solid fa-circle-notch fa-spin"></i> : 'CONFIRMAR DÉBITO SEPA'}
                </button>
            </div>
        </form>
    );
};
