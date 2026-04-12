
import gestorDeRequisicoes from './GestorDeRequisicoesDosProvedores.js';

/**
 * Módulo para gerenciar a conta e os pagamentos de um vendedor no Stripe.
 *
 * Este serviço lida com a conexão (Onboarding), verificação de status,
 * obtenção de detalhes, desconexão da conta via Stripe Connect,
 * e também com a criação e verificação de pagamentos.
 */

export async function createStripeAccountLink(data) {
    return gestorDeRequisicoes.post('/gateways/stripe/account-link', data);
}

export const ServicoGestaoCredencialStripe = {

    // --- MÉTODOS DE GESTÃO DE CONTA ---

    /**
     * Gera o link de onboarding do Stripe e redireciona o usuário.
     * @param {string} returnUrl A URL para a qual o Stripe deve redirecionar após o onboarding.
     * @param {string} refreshUrl A URL para a qual o Stripe deve redirecionar se o link expirar.
     */
    async conectarConta(returnUrl, refreshUrl) {
        const data = await gestorDeRequisicoes.post('/gateways/stripe/account-link', { returnUrl, refreshUrl });
        if (data && data.url) {
            window.location.href = data.url;
        }
    },

    /**
     * Busca os detalhes completos da conta Stripe conectada.
     */
    async obterDetalhesDaConta() {
        return gestorDeRequisicoes.get('/gateways/stripe/account-details');
    },

    /**
     * Desconecta a conta Stripe do usuário.
     */
    async desconectarConta() {
        return gestorDeRequisicoes.delete('/gateways/stripe/disconnect');
    },

    // --- MÉTODOS DE PROCESSAMENTO DE PAGAMENTO ---

    /**
     * Busca a chave publicável do Stripe para um determinado vendedor.
     * Esta chave é necessária para inicializar o Stripe no lado do cliente.
     * @param {string} creatorEmail - Email do criador para identificar a conta Stripe.
     * @returns {Promise<{ publicKey: string }>} A resposta da API com a chave publicável.
     */
    async getPublishableKey(creatorEmail) {
        // CORREÇÃO: Adicionando o método que faltava para buscar a chave.
        return gestorDeRequisicoes.post('/gateways/stripe/public-key', { creatorEmail });
    },

    /**
     * Cria uma Intenção de Pagamento (Payment Intent) no backend.
     * @param {number} price - O preço em centavos.
     * @param {string} currency - A moeda (ex: 'brl', 'usd').
     * @param {string} method - O método de pagamento (ex: 'pix', 'card').
     * @param {string} creatorEmail - Email do criador para identificar a conta Stripe.
     * @returns {Promise<any>} A resposta da API com os detalhes da intenção.
     */
    async createPaymentIntent(price, currency, method, creatorEmail) {
        return gestorDeRequisicoes.post('/payments/stripe/create', {
            price,
            currency,
            paymentMethod: method,
            creatorEmail
        });
    },

    /**
     * Verifica o status de uma sessão de pagamento no backend.
     * @param {string} sessionId - O ID da sessão.
     * @param {string} creatorEmail - Email do criador para autenticação.
     * @returns {Promise<{ status: string }>} A resposta com o status.
     */
    async checkSessionStatus(sessionId, creatorEmail) {
        return gestorDeRequisicoes.post(`/payments/stripe/status/${sessionId}`, {
            creatorEmail
        });
    }
};
