
import { useState, useEffect, useRef } from 'react';
import { ServicoGestaoCredencialSyncPay as syncPayService } from '../../ServiçosFrontend/ServiçoDeProvedoresDePagamentos/ServiçoGestãoCredencialSyncPay.js';
import { Group, User } from '../../types';

export type SyncPayView = 'selection' | 'pix' | 'boleto';

interface UseFluxoDePagamentoSyncPayProps {
    group: Group;
    onSuccess: () => void;
    onError: (msg: string) => void;
    onTransactionId: (id: string) => void;
}

export const useFluxoDePagamentoSyncPay = ({ group, onSuccess, onError, onTransactionId }: UseFluxoDePagamentoSyncPayProps) => {
    const [currentView, setCurrentView] = useState<SyncPayView>('selection');
    const [pixCode, setPixCode] = useState('');
    const [pixImage, setPixImage] = useState<string | undefined>(undefined);
    const [boletoUrl, setBoletoUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const pollingInterval = useRef<any>(null);

    // Usuário obtido do localStorage/guest capture
    const userEmail = localStorage.getItem('guest_email_capture');

    useEffect(() => {
        return () => { if (pollingInterval.current) clearInterval(pollingInterval.current); };
    }, []);

    const startPolling = (id: string, ownerEmail: string, email: string) => {
        if (pollingInterval.current) clearInterval(pollingInterval.current);
        pollingInterval.current = setInterval(async () => {
            try {
                const res = await syncPayService.checkTransactionStatus(id, ownerEmail, group.id, email);
                if (res.status === 'completed' || res.status === 'paid') {
                    clearInterval(pollingInterval.current);
                    onSuccess();
                }
            } catch (e) { clearInterval(pollingInterval.current); }
        }, 3000);
    };

    const generatePayment = async (selectedMethod: SyncPayView) => {
        if (selectedMethod === 'selection') return;
        
        setIsLoading(true);
        
        const guestEmail = localStorage.getItem('guest_email_capture');
        if (!guestEmail) { 
            onError("E-mail não identificado. Por favor, recarregue a página."); 
            setIsLoading(false);
            return; 
        }
        
        const email = guestEmail;

        try {
            // Lógica de conversão de moeda removida pois currencyService.js não existe.
            // O preço do grupo será tratado como se já estivesse em BRL.
            console.log("currencyService não foi encontrado. O preço será tratado como BRL.");
            const finalBrlAmount = parseFloat(group.price || '0');

            const creatorId = group.creatorEmail || group.creatorId;
            const syncGroup = { ...group, price: finalBrlAmount.toString(), currency: 'BRL' as const, creatorEmail: creatorId };

            const { pixCode, identifier, qrCodeImage, boletoUrl } = await syncPayService.createPayment({ email } as User, syncGroup, selectedMethod);
            
            setPixCode(pixCode);
            setPixImage(qrCodeImage);
            setBoletoUrl(boletoUrl);
            onTransactionId(identifier);
            setCurrentView(selectedMethod);
            startPolling(identifier, creatorId, email);

        } catch (error: any) {
            onError(error.message || "Erro ao gerar pagamento.");
        } finally {
            setIsLoading(false);
        }
    };

    return {
        currentView,
        setCurrentView,
        isLoading,
        pixCode,
        pixImage,
        boletoUrl,
        generatePayment,
    };
};
