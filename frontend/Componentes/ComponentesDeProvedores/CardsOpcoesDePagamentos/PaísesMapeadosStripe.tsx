
// Matriz de configuração visual para os métodos de pagamento do Stripe por país.
// A ordem segue o padrão rígido: Métodos locais por popularidade, penúltimo é Carteira Digital e último é Stripe Link.
export const STRIPE_REGIONAL_MATRIX: Record<string, any> = {

    // === AMÉRICA LATINA ===
    'BR': {
        flag: '🇧🇷',
        methods: [
            { id: 'pix', icon: 'fa-bolt', title: 'Pix', sub: 'Pagamento instantâneo', primary: true },
            { id: 'card', icon: 'fa-credit-card', title: 'Cartão de Crédito', sub: 'Opções de parcelamento' },
            { id: 'card', icon: 'fa-solid fa-money-check-dollar', title: 'Cartão de Débito', sub: 'Pagamento à vista' },
            { id: 'boleto', icon: 'fa-barcode', title: 'Boleto Bancário', sub: 'Pagamento em até 48h' },
            { id: 'wallet', icon: 'fa-wallet', title: 'Carteiras Digitais', sub: 'Apple Pay / Google Pay' },
            { id: 'link', icon: 'fa-link', title: 'Stripe Link', sub: 'Pagamento rápido em 1-clique' }
        ]
    },
    'MX': {
        flag: '🇲🇽',
        methods: [
            { id: 'card', icon: 'fa-credit-card', title: 'Tarjeta de Crédito', sub: 'Visa, Master, Amex', primary: true },
            { id: 'card', icon: 'fa-solid fa-money-check-dollar', title: 'Tarjeta de Débito', sub: 'Pago inmediato' },
            { id: 'oxxo', icon: 'fa-store', title: 'OXXO', sub: 'Paga en efectivo en tiendas' },
            { id: 'spei', icon: 'fa-university', title: 'SPEI', sub: 'Transferencia bancaria' },
            { id: 'wallet', icon: 'fa-wallet', title: 'Carteras Digitales', sub: 'Apple Pay / Google Pay' },
            { id: 'link', icon: 'fa-link', title: 'Stripe Link', sub: 'Pago rápido en 1-clic' }
        ]
    },

    // === AMÉRICA DO NORTE ===
    'US': {
        flag: '🇺🇸',
        methods: [
            { id: 'card', icon: 'fa-credit-card', title: 'Credit/Debit Card', sub: 'Visa, Master, Amex, Discover', primary: true },
            { id: 'ach', icon: 'fa-university', title: 'ACH Direct Debit', sub: 'From your bank account' },
            { id: 'afterpay', icon: 'fa-tag', title: 'Afterpay', sub: 'Buy now, pay later' },
            { id: 'wallet', icon: 'fa-wallet', title: 'Digital Wallets', sub: 'Apple Pay / Google Pay' },
            { id: 'link', icon: 'fa-link', title: 'Stripe Link', sub: '1-click checkout' }
        ]
    },
    'CA': {
        flag: '🇨🇦',
        methods: [
            { id: 'card', icon: 'fa-credit-card', title: 'Credit/Debit Card', sub: 'Visa, Mastercard, Amex', primary: true },
            { id: 'interac', icon: 'fa-leaf', title: 'Interac', sub: 'Canadian debit network' },
            { id: 'afterpay', icon: 'fa-tag', title: 'Afterpay', sub: 'Buy now, pay later' },
            { id: 'wallet', icon: 'fa-wallet', title: 'Digital Wallets', sub: 'Apple Pay / Google Pay' },
            { id: 'link', icon: 'fa-link', title: 'Stripe Link', sub: '1-click checkout' }
        ]
    },

    // === EUROPA ===
    'GB': {
        flag: '🇬🇧',
        methods: [
            { id: 'card', icon: 'fa-credit-card', title: 'Credit/Debit Card', sub: 'Visa, Mastercard, Amex', primary: true },
            { id: 'bacs', icon: 'fa-university', title: 'BACS Direct Debit', sub: 'UK bank transfer' },
            { id: 'klarna', icon: 'fa-bold', title: 'Klarna', sub: 'Pay in installments' },
            { id: 'wallet', icon: 'fa-wallet', title: 'Digital Wallets', sub: 'Apple Pay / Google Pay' },
            { id: 'link', icon: 'fa-link', title: 'Stripe Link', sub: '1-click checkout' }
        ]
    },
    'EU': {
        flag: '🇪🇺',
        methods: [
            { id: 'card', icon: 'fa-credit-card', title: 'Credit/Debit Card', sub: 'Visa, Mastercard, Amex', primary: true },
            { id: 'sepa', icon: 'fa-university', title: 'SEPA Direct Debit', sub: 'EU bank transfer' },
            { id: 'sofort', icon: 'fa-bolt-lightning', title: 'Sofort', sub: 'Direct bank transfer' },
            { id: 'klarna', icon: 'fa-bold', title: 'Klarna', sub: 'Pay in installments' },
            { id: 'wallet', icon: 'fa-wallet', title: 'Digital Wallets', sub: 'Apple Pay / Google Pay' },
            { id: 'link', icon: 'fa-link', title: 'Stripe Link', sub: '1-click checkout' }
        ]
    },

    // === ÁSIA-PACÍFICO ===
    'JP': {
        flag: '🇯🇵',
        methods: [
            { id: 'card', icon: 'fa-credit-card', title: 'クレジットカード', sub: 'Visa, Master, Amex, JCB', primary: true },
            { id: 'konbini', icon: 'fa-store', title: 'コンビニ', sub: 'Pay at convenience stores' },
            { id: 'afterpay', icon: 'fa-tag', title: 'Afterpay', sub: 'Buy now, pay later' },
            { id: 'wallet', icon: 'fa-wallet', title: 'デジタルウォレット', sub: 'Apple Pay / Google Pay' },
            { id: 'link', icon: 'fa-link', title: 'Stripe Link', sub: '1-click checkout' }
        ]
    },
    'IN': {
        flag: '🇮🇳',
        methods: [
            { id: 'upi', icon: 'fa-mobile-alt', title: 'UPI', sub: 'Instant bank transfers', primary: true },
            { id: 'card', icon: 'fa-credit-card', title: 'Credit/Debit Card', sub: 'Visa, Mastercard, RuPay' },
            { id: 'netbanking', icon: 'fa-landmark', title: 'NetBanking', sub: '50+ Indian banks' },
            { id: 'wallet', icon: 'fa-wallet', title: 'Digital Wallets', sub: 'Apple Pay / Google Pay' },
            { id: 'link', icon: 'fa-link', title: 'Stripe Link', sub: '1-click checkout' }
        ]
    },
    'SG': {
        flag: '🇸🇬',
        methods: [
            { id: 'card', icon: 'fa-credit-card', title: 'Credit/Debit Card', sub: 'Visa, Mastercard, Amex', primary: true },
            { id: 'paynow', icon: 'fa-qrcode', title: 'PayNow', sub: 'QR code payments' },
            { id: 'grabpay', icon: 'fa-leaf', title: 'GrabPay', sub: 'Pay with your Grab wallet' },
            { id: 'wallet', icon: 'fa-wallet', title: 'Digital Wallets', sub: 'Apple Pay / Google Pay' },
            { id: 'link', icon: 'fa-link', title: 'Stripe Link', sub: '1-click checkout' }
        ]
    },
    'AU': {
        flag: '🇦🇺',
        methods: [
            { id: 'card', icon: 'fa-credit-card', title: 'Credit/Debit Card', sub: 'Visa, Mastercard, Amex', primary: true },
            { id: 'becs', icon: 'fa-university', title: 'BECS Direct Debit', sub: 'Australian bank transfer' },
            { id: 'afterpay', icon: 'fa-tag', title: 'Afterpay', sub: 'Buy now, pay later' },
            { id: 'wallet', icon: 'fa-wallet', title: 'Digital Wallets', sub: 'Apple Pay / Google Pay' },
            { id: 'link', icon: 'fa-link', title: 'Stripe Link', sub: '1-click checkout' }
        ]
    },

    // === GLOBAL FALLBACK ===
    'DEFAULT': {
        flag: '🌍',
        methods: [
            { id: 'card', icon: 'fa-credit-card', title: 'International Card', sub: 'Secure online payment', primary: true },
            { id: 'paypal', icon: 'fa-brands fa-paypal', title: 'PayPal', sub: 'Redirect to PayPal' },
            { id: 'wallet', icon: 'fa-wallet', title: 'Digital Wallets', sub: 'Apple Pay / Google Pay' },
            { id: 'link', icon: 'fa-link', title: 'Stripe Link', sub: '1-click checkout' }
        ]
    }
};
