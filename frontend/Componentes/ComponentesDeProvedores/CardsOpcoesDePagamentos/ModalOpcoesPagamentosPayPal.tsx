
import React from 'react';
import { useFluxoDePagamentoPayPal, ConversionResult } from '../../../hooks/HooksComponentes/Hook.Fluxo.De.Pagamento.PayPal';
import { Group } from '../../../types';
import { CardRedirecionamentoPaypal } from './Card.Redirecionamento.Paypal';
import { PAYPAL_REGIONAL_MATRIX } from './PaísesMapeadosPayPal'; // Importando a configuração visual

interface ModalOpcoesPagamentosPayPalProps {
    group: Group;
    onSuccess: () => void;
    onError: (msg: string) => void;
    onTransactionId: (id: string) => void;
    convertedPriceInfo: ConversionResult | null;
}

export const ModalOpcoesPagamentosPayPal: React.FC<ModalOpcoesPagamentosPayPalProps> = (props) => {
    const { isLoading, initiatePayPalCheckout } = useFluxoDePagamentoPayPal(props);

    // Pega a configuração padrão do PayPal
    const paypalConfig = PAYPAL_REGIONAL_MATRIX['DEFAULT'];

    const handleConfirm = async () => {
        const approvalUrl = await initiatePayPalCheckout();
        if (approvalUrl) {
            window.open(approvalUrl, '_blank');
        }
    };

    return (
        <CardRedirecionamentoPaypal 
            price={props.convertedPriceInfo?.formatted || '...'}
            isLoading={isLoading}
            onConfirm={handleConfirm}
            onBack={() => window.location.reload()}
            // Passando os dados visuais do arquivo de configuração
            config={paypalConfig} 
        />
    );
};
