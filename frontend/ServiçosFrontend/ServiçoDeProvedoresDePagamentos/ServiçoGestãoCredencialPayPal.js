
import gestorDeRequisicoes from './GestorDeRequisicoesDosProvedores.js';

/**
 * Módulo para gerenciar a conta e os pagamentos de um vendedor no PayPal.
 */
export const ServicoGestaoCredencialPayPal = {

    // --- MÉTODOS DE GESTÃO DE CONTA ---

    /**
     * Gera o link de inscrição do PayPal e redireciona o usuário.
     * @param {string} returnUrl A URL para a qual o PayPal deve redirecionar após a conclusão.
     */
    async conectarConta(returnUrl) {
        const data = await gestorDeRequisicoes.post('/gateways/paypal/account-link', { returnUrl });
        if (data && data.url) {
            window.location.href = data.url;
        }
    },

    /**
     * Busca os detalhes da conta PayPal conectada.
     */
    async obterDetalhesDaConta() {
        return gestorDeRequisicoes.get('/gateways/paypal/account-details');
    },

    /**
     * Desconecta a conta PayPal do usuário.
     */
    async desconectarConta() {
        return gestorDeRequisicoes.delete('/gateways/paypal/disconnect');
    },

    // --- MÉTODOS DE PROCESSAMENTO DE PAGAMENTO ---

    /**
     * Cria uma Ordem de Pagamento no backend.
     * @param {any} group - O objeto do grupo.
     * @param {string} creatorEmail - Email do criador para identificar a conta PayPal.
     * @returns {Promise<any>} A resposta da API com os detalhes da ordem.
     */
    async createOrder(group, creatorEmail) {
        return gestorDeRequisicoes.post('/payments/paypal/create-order', {
            group,
            creatorEmail
        });
    },

    /**
     * Verifica o status de uma ordem de pagamento no backend.
     * @param {string} orderId - O ID da ordem.
     * @param {string} creatorEmail - Email do criador para autenticação.
     * @returns {Promise<{ status: string }>} A resposta com o status.
     */
    async checkOrderStatus(orderId, creatorEmail) {
        return gestorDeRequisicoes.post(`/payments/paypal/check-status/${orderId}`, {
            creatorEmail
        });
    }
};
