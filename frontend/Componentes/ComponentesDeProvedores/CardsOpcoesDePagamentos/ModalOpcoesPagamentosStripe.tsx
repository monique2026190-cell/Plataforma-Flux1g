
import React, { useState, useMemo } from 'react';
import { useFluxoDePagamentoStripe, StripeView, GeoData, ConversionResult } from '../../../hooks/HooksComponentes/Hook.Fluxo.De.Pagamento.Stripe';
import { Group } from '../../../types';

// Importando os componentes de UI para cada método de pagamento
import { GestorCheckoutStripePix } from '../CardsMétodosDePagamentos/Gestor.Checkout.Stripe.Pix'; 
import { GestorCheckoutStripeBoleto } from '../CardsMétodosDePagamentos/Gestor.Checkout.Stripe.Boleto'; 
import { GestorCheckoutStripeOxxo } from '../CardsMétodosDePagamentos/Gestor.Checkout.Stripe.Oxxo';
import { GestorCheckoutStripeUpi } from '../CardsMétodosDePagamentos/Gestor.Checkout.Stripe.Upi';
import { GestorCheckoutStripeKonbini } from '../CardsMétodosDePagamentos/Gestor.Checkout.Stripe.Konbini';
import { GestorCheckoutStripePayNow } from '../CardsMétodosDePagamentos/Gestor.Checkout.Stripe.PayNow';
import { GestorCheckoutStripeInterac } from '../CardsMétodosDePagamentos/Gestor.Checkout.Stripe.Interac'; // NOVO FLUXO INTERAC
import { GestorCheckoutStripeCard } from '../CardsMétodosDePagamentos/Gestor.Checkout.Stripe.Card';
import { StripeSepaForm } from '../CardsMétodosDePagamentos/StripeSepaForm';
import { StripeBacsForm } from '../CardsMétodosDePagamentos/StripeBacsForm';
import { StripeAchForm } from '../CardsMétodosDePagamentos/StripeAchForm';
import { StripeBecsForm } from '../CardsMétodosDePagamentos/StripeBecsForm';
import { CardRedirecionamentoStripe, RedirectionProvider } from './Card.Redirecionamento.Stripe';

// A matriz de configuração visual agora é importada de um arquivo separado.
import { STRIPE_REGIONAL_MATRIX } from './PaísesMapeadosStripe';

interface ModalOpcoesPagamentosStripeProps {
    group: Group;
    geo: GeoData | null;
    onSuccess: () => void;
    onError: (msg: string) => void;
    onTransactionId: (id: string) => void;
    convertedPriceInfo: ConversionResult | null;
}

export const ModalOpcoesPagamentosStripe: React.FC<ModalOpcoesPagamentosStripeProps> = (props) => {
    const { currentView, setCurrentView, paymentData, isLoading, generatePayment } = useFluxoDePagamentoStripe(props);
    const [redirectTarget, setRedirectTarget] = useState<RedirectionProvider>('stripe');

    const country = (props.geo?.countryCode || 'BR').toUpperCase();
    const region = useMemo(() => {
        return STRIPE_REGIONAL_MATRIX[country] || STRIPE_REGIONAL_MATRIX['DEFAULT'];
    }, [country]);

    const filteredMethods = useMemo(() => {
        const config = props.group.checkoutConfig;
        // CORREÇÃO: Verifica se a configuração e a lista de métodos existem.
        if (!config || !config.enabledMethods || config.enabledMethods.length === 0) {
            // Se não houver configuração, retorna todos os métodos da região.
            return region.methods;
        }
        // Se houver, filtra os métodos da região com base na lista `enabledMethods`.
        return region.methods.filter((m: any) => config.enabledMethods.includes(m.id));
    }, [region.methods, props.group.checkoutConfig]);


    const handleMethodSelection = (method: StripeView) => {
        // Adicionamos 'interac' aqui. Agora o clique no card do Interac apenas muda a view,
        // delegando toda a lógica para o componente Gestor.
        const methodsWithOwnForm = ['card', 'sepa', 'bacs', 'ach', 'becs', 'pad', 'pix', 'boleto', 'oxxo', 'upi', 'konbini', 'paynow', 'interac'];
        const methodsWithRedirect = ['sofort', 'klarna', 'wallet', 'grabpay', 'afterpay', 'link', 'debit_card'];

        if (methodsWithOwnForm.includes(method)) {
            setCurrentView(method);
            return;
        }

        if (methodsWithRedirect.includes(method)) {
            let target: RedirectionProvider = 'stripe';
            if (method === 'link') target = 'stripe_link';
            if (method === 'wallet') target = 'wallet';
            setRedirectTarget(target);
            setCurrentView('redirection');
            return;
        }

        generatePayment(method);
    };

    const renderContent = () => {
        if (isLoading) {
             return (
                <div className="py-20 text-center animate-pulse">
                    <i className="fa-solid fa-circle-notch fa-spin text-3xl text-[#00c2ff] mb-4"></i>
                    <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Processando com segurança...</p>
                </div>
            );
        }

        switch (currentView) {
            case 'selection':
                return (
                    <div className="space-y-3">
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <span className="text-2xl">{region.flag}</span>
                            <span className="text-[10px] font-black text-[#00c2ff] uppercase tracking-widest">{props.geo?.countryName || 'Global'} Gateway</span>
                        </div>
                        {filteredMethods.map((m: any) => (
                            <div key={m.id} onClick={() => handleMethodSelection(m.id as StripeView)} className="flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all active:scale-[0.98] bg-white/5 border border-[#00c2ff]/50 hover:bg-white/10">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-black/20 text-[#00c2ff]"><i className={`fa-solid ${m.icon} text-lg`}></i></div>
                                <div className="text-left flex-1">
                                    <span className="font-bold text-sm text-white block">{m.title}</span>
                                    <span className="text-[10px] text-gray-500 uppercase font-black tracking-tighter">{m.sub}</span>
                                </div>
                                <i className="fa-solid fa-chevron-right text-[10px] text-gray-700"></i>
                            </div>
                        ))}
                    </div>
                );

            // FLUXOS NOVOS E AUTO-CONTIDOS
            case 'pix': 
                return <GestorCheckoutStripePix group={props.group} geo={props.geo} onBack={() => setCurrentView('selection')} onSuccess={props.onSuccess} />;
            case 'boleto': 
                return <GestorCheckoutStripeBoleto group={props.group} geo={props.geo} onBack={() => setCurrentView('selection')} onSuccess={props.onSuccess} />;
            case 'oxxo': 
                return <GestorCheckoutStripeOxxo group={props.group} geo={props.geo} onBack={() => setCurrentView('selection')} onSuccess={props.onSuccess} />;
            case 'upi': 
                return <GestorCheckoutStripeUpi group={props.group} geo={props.geo} onBack={() => setCurrentView('selection')} onSuccess={props.onSuccess} />;
            case 'konbini': 
                return <GestorCheckoutStripeKonbini group={props.group} geo={props.geo} onBack={() => setCurrentView('selection')} onSuccess={props.onSuccess} />;
            case 'paynow': 
                return <GestorCheckoutStripePayNow group={props.group} geo={props.geo} onBack={() => setCurrentView('selection')} onSuccess={props.onSuccess} />;
            case 'interac': 
                return <GestorCheckoutStripeInterac group={props.group} geo={props.geo} onBack={() => setCurrentView('selection')} onSuccess={props.onSuccess} />;

            // Views de formulário
            case 'card': return <GestorCheckoutStripeCard group={props.group} geo={props.geo} onBack={() => setCurrentView('selection')} onSuccess={props.onSuccess} />;
            case 'sepa': return <StripeSepaForm onBack={() => setCurrentView('selection')} onSuccess={props.onSuccess} />;
            case 'bacs': return <StripeBacsForm onBack={() => setCurrentView('selection')} onSuccess={props.onSuccess} />;
            case 'ach': return <StripeAchForm onBack={() => setCurrentView('selection')} onSuccess={props.onSuccess} />;
            case 'becs': return <StripeBecsForm onBack={() => setCurrentView('selection')} onSuccess={props.onSuccess} />;

            case 'redirection':
                return (
                    <CardRedirecionamentoStripe 
                        provider={redirectTarget}
                        price={props.convertedPriceInfo?.formatted || '...'}
                        onConfirm={props.onSuccess}
                        onBack={() => setCurrentView('selection')}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="animate-fade-in min-h-[400px] flex flex-col">
            {renderContent()}
            <div className="mt-auto pt-8 text-[9px] text-gray-700 uppercase tracking-widest flex items-center justify-center gap-2">
                <i className="fa-brands fa-stripe text-base"></i> Transação criptografada • Stripe Global
            </div>
        </div>
    );
};
