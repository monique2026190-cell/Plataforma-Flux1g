
// Serviço para interagir com a API de chat/mensagens do backend.

const API_BASE_URL = '/api';

/**
 * Lida com as respostas da API, convertendo para JSON ou lançando um erro.
 * @param {Response} res - O objeto de resposta do fetch.
 * @returns {Promise<any>} O corpo da resposta em JSON.
 * @throws {Error} Se a resposta não for bem-sucedida.
 */
const handleResponse = async (res) => {
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Erro desconhecido na API' }));
        throw new Error(errorData.message || `Erro ${res.status}`);
    }
    return res.json();
};

/**
 * Obtém os headers de autorização.
 * @param {string} token - O token JWT.
 * @returns {object} Os headers com o token.
 */
const getAuthHeaders = (token) => ({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
});

export const chatService = {
    /**
     * Lista todas as conversas do usuário logado.
     * @param {string} token - O token de autenticação.
     * @returns {Promise<any>} A lista de conversas.
     */
    async listConversations(token) {
        const res = await fetch(`${API_BASE_URL}/conversations`, {
            headers: getAuthHeaders(token),
        });
        return handleResponse(res);
    },
    
    /**
     * Busca os detalhes de uma conversa específica.
     * @param {string} token - O token de autenticação.
     * @param {string} chatId - O ID da conversa.
     * @returns {Promise<any>} Os detalhes da conversa.
     */
    async getChat(token, chatId) {
        console.log(`[chatService] Buscando chat com ID: ${chatId}`);
        const res = await fetch(`${API_BASE_URL}/conversations/${chatId}`, { // CORREÇÃO: Endpoint ajustado
            headers: getAuthHeaders(token),
        });
        return handleResponse(res);
    },

    /**
     * Busca mensagens de uma conversa específica.
     * @param {string} token - O token de autenticação.
     * @param {string} conversationId - O ID da conversa.
     * @param {object} [params] - Parâmetros de paginação como limit e offset.
     * @returns {Promise<any>} As mensagens da conversa.
     */
    async getMessages(token, conversationId, { limit, offset } = {}) {
        const query = new URLSearchParams({ limit, offset }).toString();
        const res = await fetch(`${API_BASE_URL}/conversations/${conversationId}/messages?${query}`, {
            headers: getAuthHeaders(token),
        });
        return handleResponse(res);
    },

    /**
     * Envia uma nova mensagem.
     * @param {string} token - O token de autenticação.
     * @param {object} messageData - Dados da mensagem (recipientId, content, etc.).
     * @returns {Promise<any>} A mensagem enviada.
     */
    async sendMessage(token, messageData) {
        const res = await fetch(`${API_BASE_URL}/messages`, {
            method: 'POST',
            headers: getAuthHeaders(token),
            body: JSON.stringify(messageData),
        });
        return handleResponse(res);
    },

    /**
     * Deleta mensagens específicas.
     * @param {string} token - O token de autenticação.
     * @param {string[]} messageIds - IDs das mensagens a serem deletadas.
     * @param {'self' | 'all'} target - Se a deleção é só para o usuário ou para todos.
     * @returns {Promise<any>} O resultado da operação.
     */
    async deleteMessages(token, messageIds, target = 'self') {
        const res = await fetch(`${API_BASE_URL}/messages`, {
            method: 'DELETE',
            headers: getAuthHeaders(token),
            body: JSON.stringify({ messageIds, target }),
        });
        return handleResponse(res);
    },

    /**
     * Encaminha mensagens para um chat diferente.
     * @param {string} token - O token de autenticação.
     * @param {string[]} messageIds - Os IDs das mensagens a serem encaminhadas.
     * @param {string} targetChatId - O ID do chat de destino.
     * @returns {Promise<any>} O resultado da operação.
     */
    async forwardMessages(token, messageIds, targetChatId) {
        console.log(`[chatService] Encaminhando mensagens ${messageIds.join(', ')} para o chat ${targetChatId}`);
        // Simulação: Em um app real, faria uma chamada de API, ex: POST /api/messages/forward
        // O backend então duplicaria as mensagens para o novo chat.
        return Promise.resolve({ success: true, message: `Mensagens encaminhadas para ${targetChatId}` });
    },

    /**
     * Simula a contagem de mensagens não lidas.
     * @returns {Promise<number>}
     */
    async getUnreadCount() {
        console.log("[Chat Mock] Contando mensagens não lidas...");
        // No mundo real, isso também faria uma chamada de API.
        // Por enquanto, apenas retorna um valor estático para fins de UI.
        const allChats = this.listConversations(); // Simulação
        return Promise.resolve(Object.values(allChats).reduce((acc, chat) => acc + (chat.unreadCount || 0), 0));
    }
};
