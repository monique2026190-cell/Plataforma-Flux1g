
// ServiçosFrontend/ServiçosDePublicações/ServiçoPublicaçãoComentáriosReels.js

/**
 * Serviço para gerenciar a publicação de comentários em Reels.
 */

const API_BASE_URL = '/api/reels'; // A base da API para Reels

async function fetchWithAuth(url, options = {}) {
    const authToken = localStorage.getItem('authToken');
    const headers = {
        ...options.headers,
    };

    if (options.body) {
        headers['Content-Type'] = 'application/json';
    }
    
    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
        const errorResult = await response.json().catch(() => ({}));
        throw new Error(errorResult.message || `Falha na requisição para ${url}`);
    }

    if (response.status !== 204) { 
        return response.json();
    }
}

export const ServicoPublicacaoComentariosReels = {

    /**
     * Adiciona um novo comentário a um Reel específico.
     * @param {string} reelId - O ID do Reel que está sendo comentado.
     * @param {object} commentData - O conteúdo do comentário (ex: { content: 'Que incrível!' }).
     * @returns {Promise<object>} - O objeto do comentário criado.
     */
    async create(reelId, commentData) {
        if (!reelId) {
            throw new Error('O ID do Reel é necessário para adicionar um comentário.');
        }
        return fetchWithAuth(`${API_BASE_URL}/${reelId}/comments`, {
            method: 'POST',
            body: JSON.stringify(commentData),
        });
    },

    /**
     * Busca todos os comentários de um Reel específico.
     * @param {string} reelId - O ID do Reel.
     * @returns {Promise<Array<object>>} - Uma lista de comentários.
     */
    async getAll(reelId) {
        if (!reelId) {
            throw new Error('O ID do Reel é necessário para buscar os comentários.');
        }
        return fetchWithAuth(`${API_BASE_URL}/${reelId}/comments`);
    },

    /**
     * Atualiza um comentário específico em um Reel.
     * @param {string} commentId - O ID do comentário a ser atualizado.
     * @param {object} updates - Os campos a serem atualizados (ex: { content }).
     * @returns {Promise<object>} - O comentário atualizado.
     */
    async update(commentId, updates) {
        return fetchWithAuth(`/api/reels/comments/${commentId}`, {
            method: 'PUT',
            body: JSON.stringify(updates),
        });
    },

    /**
     * Deleta um comentário em um Reel.
     * @param {string} commentId - O ID do comentário a ser deletado.
     * @returns {Promise<void>}
     */
    async delete(commentId) {
        return fetchWithAuth(`/api/reels/comments/${commentId}`, {
            method: 'DELETE',
        });
    }
};
