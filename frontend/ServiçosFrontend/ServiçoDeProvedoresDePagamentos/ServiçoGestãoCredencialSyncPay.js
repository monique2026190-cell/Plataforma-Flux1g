
import gestorDeRequisicoes from './GestorDeRequisicoesDosProvedores.js';

/**
 * Módulo para gerenciar as credenciais e pagamentos de um vendedor no SyncPay.
 */
export const ServicoGestaoCredencialSyncPay = {

    // --- MÉTODOS DE GESTÃO DE CONTA ---

    async salvarCredenciais(credentials) {
        return gestorDeRequisicoes.post('/gateways/syncpay/credentials', credentials);
    },

    async desconectarConta() {
        return gestorDeRequisicoes.delete('/gateways/syncpay/disconnect');
    },

    // --- MÉTODOS DE PROCESSAMENTO DE PAGAMENTO ---

    /**
     * Cria uma cobrança (pagamento) no backend usando SyncPay.
     * @param {any} buyerInfo - Informações do comprador (ex: { email }).
     * @param {any} group - O objeto do grupo.
     * @param {string} method - O método de pagamento ('pix' ou 'boleto').
     * @returns {Promise<any>} A resposta da API com os detalhes da cobrança.
     */
    async createPayment(buyerInfo, group, method) {
        return gestorDeRequisicoes.post('/payments/syncpay/charge', {
            buyerInfo,
            group,
            method,
            creatorEmail: group.creatorEmail // Incluído para roteamento no backend
        });
    },

    /**
     * Verifica o status de uma transação no backend.
     * @param {string} transactionId - O ID da transação.
     * @param {string} creatorEmail - Email do criador para autenticação.
     * @param {string} groupId - O ID do grupo.
     * @param {string} buyerEmail - O email do comprador.
     * @returns {Promise<{ status: string }>} A resposta com o status.
     */
    async checkTransactionStatus(transactionId, creatorEmail, groupId, buyerEmail) {
        return gestorDeRequisicoes.post(`/payments/syncpay/status`, {
            transactionId,
            creatorEmail,
            groupId,
            buyerEmail
        });
    }
};
