
import { useState, useCallback, useEffect } from 'react';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import { ServicoGestaoCredencialStripe as stripeService } from '../../ServiçosFrontend/ServiçoDeProvedoresDePagamentos/ServiçoGestãoCredencialStripe';
import { Group } from '../../types';
import { GeoData } from '../../ServiçosFrontend/geoService';
import { ConversionResult } from '../../ServiçosFrontend/currencyService';

// --- TIPOS ---
export type StripeView = 
    | 'selection' 
    | 'card' 
    | 'pix' 
    | 'boleto' 
    | 'oxxo' 
    | 'upi'
    | 'konbini'
    | 'paynow'
    | 'interac'
    | 'sepa' 
    | 'bacs' 
    | 'ach' 
    | 'becs' 
    | 'pad'
    | 'redirection';

export interface PaymentData {
    clientSecret: string;
    transactionId: string;
}

// --- PROPS DO HOOK ---
interface UseFluxoDePagamentoStripeProps {
    group: Group;
    geo: GeoData | null;
    onSuccess: (txId?: string) => void;
    onError: (msg: string) => void;
    onTransactionId: (id: string) => void;
    convertedPriceInfo: ConversionResult | null;
}

// --- CORPO DO HOOK ---
export const useFluxoDePagamentoStripe = (props: UseFluxoDePagamentoStripeProps) => {
    const { group, geo, onSuccess, onError, onTransactionId, convertedPriceInfo } = props;

    const [stripe, setStripe] = useState<Stripe | null>(null);
    const [currentView, setCurrentView] = useState<StripeView>('selection');
    const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Carrega a instância do Stripe
    useEffect(() => {
        const load = async () => {
            try {
                const response = await stripeService.getPublishableKey(group.creatorEmail);
                const publicKey = response.publicKey;

                if (publicKey) {
                    setStripe(await loadStripe(publicKey));
                } else {
                    throw new Error("A chave publicável do Stripe não foi encontrada na resposta do servidor.");
                }
            } catch (error: any) {
                console.error("Falha ao carregar o Stripe:", error);
                onError(error.message || "Não foi possível iniciar o sistema de pagamento.");
            }
        };
        load();
    }, [group.creatorEmail, onError]);

    const generatePayment = useCallback(async (method: string) => {
        if (!stripe) {
            onError("O Stripe não foi inicializado corretamente.");
            return;
        }
        setIsLoading(true);
        try {
            const price = convertedPriceInfo?.priceInCents || group.price;
            const currency = convertedPriceInfo?.currency || geo?.currency || 'BRL';
            
            const data = await stripeService.createPaymentIntent(price, currency.toLowerCase(), method, group.creatorEmail);
            
            if (!data.clientSecret) {
                throw new Error("Não foi possível obter o client secret do Stripe.");
            }

            setPaymentData({ clientSecret: data.clientSecret, transactionId: data.transactionId });
            onTransactionId(data.transactionId);

        } catch (error: any) {
            console.error(`Erro ao criar PaymentIntent para o método ${method}:`, error);
            onError(error.message || `Falha ao preparar o pagamento para ${method}.`);
        } finally {
            setIsLoading(false);
        }
    }, [stripe, group, geo, convertedPriceInfo, onError, onTransactionId]);

    return {
        stripe,
        currentView,
        setCurrentView,
        paymentData,
        isLoading,
        generatePayment,
    };
};

export type { GeoData, ConversionResult };
