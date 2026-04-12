
// Matriz de configuração visual para os métodos de pagamento do SyncPay.
// Atualmente, o SyncPay opera apenas no Brasil.
export const SYNC_PAY_REGIONAL_MATRIX: Record<string, any> = {
    'BR': {
        flag: '🇧🇷',
        methods: [
            {
                id: 'pix',
                icon: 'fa-brands fa-pix',
                title: 'Pix Instantâneo',
                sub: 'Liberação imediata',
                color: '#00c2ff'
            },
            {
                id: 'boleto',
                icon: 'fa-solid fa-barcode',
                title: 'Boleto Bancário',
                sub: 'Compensação em até 48h',
                color: '#aaa'
            }
        ]
    },
    // Fallback para garantir que sempre haja uma configuração disponível.
    'DEFAULT': {
        flag: '🇧🇷',
        methods: [
            {
                id: 'pix',
                icon: 'fa-brands fa-pix',
                title: 'Pix Instantâneo',
                sub: 'Liberação imediata',
                color: '#00c2ff'
            },
            {
                id: 'boleto',
                icon: 'fa-solid fa-barcode',
                title: 'Boleto Bancário',
                sub: 'Compensação em até 48h',
                color: '#aaa'
            }
        ]
    }
};
