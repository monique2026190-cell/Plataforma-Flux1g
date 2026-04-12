
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { ServicoGestaoCredencialStripe } from '../../../ServiçosFrontend/ServiçoDeProvedoresDePagamentos/ServiçoGestãoCredencialStripe';
import { StripeBecsForm } from './StripeBecsForm';
import { Group } from '../../../types';
import { GeoData } from '../../../ServiçosFrontend/geoService';

// Carrega a instância da Stripe, deve ser feito fora do render para performance.
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface GestorCheckoutStripeBecsProps {
    group: Group;
    geo: GeoData | null;
    onBack: () => void;
    onSuccess: (paymentIntentId: string) => void;
}

/**
 * Componente Gestor para o formulário de Débito Direto BECS (Contas da Austrália).
 * Responsável por criar a Intenção de Pagamento e configurar o ambiente Stripe.
 */
export const GestorCheckoutStripeBecs: React.FC<GestorCheckoutStripeBecsProps> = ({ group, geo, onBack, onSuccess }) => {
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const createIntent = async () => {
            setLoading(true);
            try {
                // Cria uma intenção de pagamento para 'becs_debit' (BECS).
                const intent = await ServicoGestaoCredencialStripe.createPaymentIntent(group, group.creatorEmail!, 'becs_debit');
                if (intent.clientSecret) {
                    setClientSecret(intent.clientSecret);
                } else {
                    setError('Não foi possível iniciar o pagamento. Tente novamente.');
                }
            } catch (err: any) {
                setError(err.message || 'Erro ao conectar com o provedor de pagamento.');
            }
            setLoading(false);
        };

        createIntent();
    }, [group]);

    // Renderiza um estado de carregamento enquanto a intenção é criada.
    if (loading) {
        return (
            <div className="py-20 text-center animate-pulse">
                <i className="fa-solid fa-circle-notch fa-spin text-3xl text-[#00c2ff] mb-4"></i>
                <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Preparando checkout seguro...</p>
            </div>
        );
    }

    // Renderiza uma mensagem de erro se a criação da intenção falhar.
    if (error) {
        return (
            <div className="py-10 text-center text-red-400">
                <i className="fa-solid fa-circle-exclamation text-3xl mb-4"></i>
                <p className="font-bold">{error}</p>
                <button onClick={onBack} className="mt-6 text-sm text-gray-400 hover:text-white">Voltar</button>
            </div>
        );
    }

    if (!clientSecret) return null;

    const options = { clientSecret };

    return (
        <Elements stripe={stripePromise} options={options}>
            <StripeBecsForm 
                geo={geo} 
                onBack={onBack} 
                onSuccess={onSuccess}
                group={group}
                creatorEmail={group.creatorEmail!}
            />
        </Elements>
    );
};
