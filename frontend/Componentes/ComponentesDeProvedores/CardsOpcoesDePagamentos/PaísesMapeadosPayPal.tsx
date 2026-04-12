
// Configuração visual para o provedor de pagamento PayPal.
// Por enquanto, o PayPal não possui configurações regionais específicas, 
// então usamos uma entrada padrão.
export const PAYPAL_REGIONAL_MATRIX: Record<string, any> = {
    'DEFAULT': {
        name: 'PayPal',
        icon: 'fa-brands fa-paypal',
        color: '#0070ba',
        accent: '#009cde',
        msg: 'Você será redirecionado para o ambiente seguro do PayPal para completar seu pagamento.'
    }
};
