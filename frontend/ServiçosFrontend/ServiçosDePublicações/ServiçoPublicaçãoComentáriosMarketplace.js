
// ServiçosFrontend/ServiçosDePublicações/ServiçoPublicaçãoComentáriosMarketplace.js

/**
 * Serviço para gerenciar a publicação de comentários em itens do Marketplace.
 */

const API_BASE_URL = '/api/marketplace/items'; // A base da API para itens do marketplace

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

export const ServiçoPublicacaoComentariosMarketplace = {

    /**
     * Adiciona um novo comentário a um item do marketplace.
     * @param {string} itemId - O ID do item que está sendo comentado.
     * @param {object} commentData - O conteúdo do comentário (ex: { content: 'Ainda está disponível?' }).
     * @returns {Promise<object>} - O objeto do comentário criado.
     */
    async create(itemId, commentData) {
        if (!itemId) {
            throw new Error('O ID do item é necessário para adicionar um comentário.');
        }
        return fetchWithAuth(`${API_BASE_URL}/${itemId}/comments`, {
            method: 'POST',
            body: JSON.stringify(commentData),
        });
    },

    /**
     * Busca todos os comentários de um item do marketplace.
     * @param {string} itemId - O ID do item.
     * @returns {Promise<Array<object>>} - Uma lista de comentários.
     */
    async getAll(itemId) {
        if (!itemId) {
            throw new Error('O ID do item é necessário para buscar os comentários.');
        }
        return fetchWithAuth(`${API_BASE_URL}/${itemId}/comments`);
    },

    /**
     * Atualiza um comentário específico em um item do marketplace.
     * @param {string} commentId - O ID do comentário a ser atualizado.
     * @param {object} updates - Os campos a serem atualizados (ex: { content }).
     * @returns {Promise<object>} - O comentário atualizado.
     */
    async update(commentId, updates) {
        // A rota para atualizar um comentário pode ser genérica e não necessariamente aninhada
        return fetchWithAuth(`/api/marketplace/comments/${commentId}`, {
            method: 'PUT',
            body: JSON.stringify(updates),
        });
    },

    /**
     * Deleta um comentário em um item do marketplace.
     * @param {string} commentId - O ID do comentário a ser deletado.
     * @returns {Promise<void>}
     */
    async delete(commentId) {
        return fetchWithAuth(`/api/marketplace/comments/${commentId}`, {
            method: 'DELETE',
        });
    }
};
