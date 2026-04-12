
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { ServicoGestaoCredencialStripe } from '../../../ServiçosFrontend/ServiçoDeProvedoresDePagamentos/ServiçoGestãoCredencialStripe';
import { StripeCardForm } from './StripeCardForm';
import { Group } from '../../../types';
import { GeoData } from '../../../ServiçosFrontend/geoService';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface GestorCheckoutStripeCardProps {
    group: Group;
    geo: GeoData | null;
    onBack: () => void;
    onSuccess: () => void;
}

export const GestorCheckoutStripeCard: React.FC<GestorCheckoutStripeCardProps> = ({ group, geo, onBack, onSuccess }) => {
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const createIntent = async () => {
            try {
                const intent = await ServicoGestaoCredencialStripe.createPaymentIntent(group, group.creatorEmail!, 'card');
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

    if (loading) {
        return (
            <div className="py-20 text-center animate-pulse">
                <i className="fa-solid fa-circle-notch fa-spin text-3xl text-[#00c2ff] mb-4"></i>
                <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Preparando checkout seguro...</p>
            </div>
        );
    }

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
            <StripeCardForm 
                geo={geo} 
                onBack={onBack} 
                onSuccess={onSuccess} 
            />
        </Elements>
    );
};
