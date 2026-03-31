
import { useState, useEffect, useRef } from 'react';
import { ServicoGestaoCredencialPayPal as paypalService } from '../../ServiçosFrontend/ServiçoDeProvedoresDePagamentos/ServiçoGestãoCredencialPayPal.js';
// import { metaPixelService } from '../../ServiçosFrontend/ServiçoDeMetaPixel/MetaPixelService.js';
import { Group } from '../../types';

export interface ConversionResult {
    amount: number;
    currency: string;
    symbol: string;
    formatted: string;
}

interface UseFluxoDePagamentoPayPalProps {
    group: Group;
    onSuccess: () => void;
    onError: (msg: string) => void;
    onTransactionId: (id: string) => void;
    convertedPriceInfo: ConversionResult | null;
}

export const useFluxoDePagamentoPayPal = ({ group, onSuccess, onError, onTransactionId, convertedPriceInfo }: UseFluxoDePagamentoPayPalProps) => {
    const [approvalUrl, setApprovalUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const pollingInterval = useRef<any>(null);

    useEffect(() => {
        return () => { if (pollingInterval.current) clearInterval(pollingInterval.current); };
    }, []);

    const startPolling = (orderId: string) => {
        if (pollingInterval.current) clearInterval(pollingInterval.current);
        pollingInterval.current = setInterval(async () => {
            try {
                const res = await paypalService.checkOrderStatus(orderId, group.creatorEmail!);
                if (res.status === 'paid') {
                    clearInterval(pollingInterval.current);
                    onSuccess();
                }
            } catch (e) { 
                clearInterval(pollingInterval.current);
            }
        }, 4000);
    };

    const initiatePayPalCheckout = async (): Promise<string | null> => {
        // Se a URL já foi gerada, a retorna imediatamente para evitar duplicidade.
        if (approvalUrl) {
            return approvalUrl;
        }

        const email = localStorage.getItem('guest_email_capture');
        if (!email) {
            onError("Um e-mail é necessário para prosseguir com o pagamento.");
            return null;
        }

        setIsLoading(true);
        try {
            const finalValue = convertedPriceInfo?.amount || parseFloat(group.price || '0');
            const finalCurrency = convertedPriceInfo?.currency || group.currency || 'BRL';

            /* if (group.pixelId) {
                metaPixelService.trackInitiateCheckout(group.pixelId, {
                    content_ids: [group.id], content_type: 'product_group', content_name: group.name,
                    value: finalValue, currency: finalCurrency
                }, { email });
            } */

            const order = await paypalService.createOrder({ ...group, price: finalValue.toString(), currency: finalCurrency as any }, group.creatorEmail!);
            
            if (order.approvalLink) {
                onTransactionId(order.id);
                setApprovalUrl(order.approvalLink); // Armazena a URL para reuso
                startPolling(order.id);
                return order.approvalLink; // Retorna a URL para o componente
            }
            return null;
        } catch (err: any) {
            onError(err.message || "Ocorreu um erro ao iniciar o checkout com PayPal.");
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        initiatePayPalCheckout, // Expõe a função que retorna a URL
    };
};
