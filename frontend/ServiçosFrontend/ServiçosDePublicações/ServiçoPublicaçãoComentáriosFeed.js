
// ServiçosFrontend/ServiçosDePublicações/ServiçoPublicaçãoComentáriosFeed.js

/**
 * Serviço para gerenciar a publicação de comentários em posts do feed.
 */

const API_BASE_URL = '/api/posts'; // A base da API para posts

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

export const ServiçoPublicacaoComentariosFeed = {

    /**
     * Adiciona um novo comentário a um post específico.
     * @param {string} postId - O ID do post que está sendo comentado.
     * @param {object} commentData - O conteúdo do comentário (ex: { content: 'Ótimo post!' }).
     * @returns {Promise<object>} - O objeto do comentário criado.
     */
    async create(postId, commentData) {
        if (!postId) {
            throw new Error('O ID do post é necessário para adicionar um comentário.');
        }
        return fetchWithAuth(`${API_BASE_URL}/${postId}/comments`, {
            method: 'POST',
            body: JSON.stringify(commentData),
        });
    },

    /**
     * Busca todos os comentários de um post específico.
     * @param {string} postId - O ID do post.
     * @returns {Promise<Array<object>>} - Uma lista de comentários.
     */
    async getAll(postId) {
        if (!postId) {
            throw new Error('O ID do post é necessário para buscar os comentários.');
        }
        return fetchWithAuth(`${API_BASE_URL}/${postId}/comments`);
    },

    /**
     * Atualiza um comentário específico.
     * @param {string} commentId - O ID do comentário a ser atualizado.
     * @param {object} updates - Os campos a serem atualizados (ex: { content }).
     * @returns {Promise<object>} - O comentário atualizado.
     */
    async update(commentId, updates) {
        return fetchWithAuth(`/api/comments/${commentId}`, {
            method: 'PUT',
            body: JSON.stringify(updates),
        });
    },

    /**
     * Deleta um comentário.
     * @param {string} commentId - O ID do comentário a ser deletado.
     * @returns {Promise<void>}
     */
    async delete(commentId) {
        return fetchWithAuth(`/api/comments/${commentId}`, {
            method: 'DELETE',
        });
    },


    /**
     * Formata um timestamp para uma string de tempo relativo (ex: "há 5 minutos").
     * @param {string | number | Date} timestamp - O timestamp a ser formatado.
     * @returns {string}
     */
    formatRelativeTime(timestamp) {
        const now = new Date();
        const date = new Date(timestamp);
        const diffInSeconds = Math.floor((now - date) / 1000);

        const units = {
            ano: 31536000,
            mês: 2592000,
            semana: 604800,
            dia: 86400,
            hora: 3600,
            minuto: 60,
        };

        if (diffInSeconds < 60) {
            return 'agora';
        }

        for (const [unit, seconds] of Object.entries(units)) {
            const interval = Math.floor(diffInSeconds / seconds);
            if (interval >= 1) {
                if (unit === 'semana' && interval * 7 > 7) {
                     return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
                }
                const plural = interval > 1 ? 's' : '';
                return `há ${interval} ${unit}${plural}`;
            }
        }
        return date.toLocaleDateString('pt-BR');
    },
};
