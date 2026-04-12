
// ServiçosFrontend/ServiçosDePublicações/ServiçoPublicaçãoCampanhas.js

/**
 * Este serviço gerencia a criação e o ciclo de vida de Campanhas de marketing ou anúncios.
 */

const API_BASE_URL = '/api/campaigns'; // Endpoint da API para Campanhas

export const ServiçoPublicaçãoCampanhas = {

    /**
     * Cria uma nova campanha.
     * @param {object} campaignData - Dados da campanha (ex: { name, description, goal, budget, startDate, endDate, utm_campaign }).
     * @returns {Promise<object>} - O objeto da campanha criada.
     */
    async create(campaignData) {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            throw new Error('Autenticação necessária para criar uma campanha.');
        }

        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`,
            },
            body: JSON.stringify(campaignData),
        });

        if (!response.ok) {
            const errorResult = await response.json();
            throw new Error(errorResult.message || 'Falha ao criar a campanha.');
        }

        return response.json();
    },

    /**
     * Busca os dados de performance de uma campanha específica.
     * @param {string} campaignId - O ID da campanha.
     * @returns {Promise<object>} - Os dados de métricas da campanha.
     */
    async getPerformance(campaignId) {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            throw new Error('Autenticação necessária para ver a performance.');
        }

        const response = await fetch(`${API_BASE_URL}/${campaignId}/performance`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`,
            },
        });

        if (!response.ok) {
            throw new Error('Falha ao buscar a performance da campanha.');
        }

        return response.json();
    },

    /**
     * Busca uma campanha específica pelo ID.
     * @param {string} campaignId - O ID da campanha.
     * @returns {Promise<object>} - O objeto da campanha.
     */
    async getById(campaignId) {
        const response = await fetch(`${API_BASE_URL}/${campaignId}`);
        if (!response.ok) {
            const errorResult = await response.json();
            throw new Error(errorResult.message || 'Falha ao buscar a campanha.');
        }
        return response.json();
    },

    /**
     * Atualiza uma campanha existente.
     * @param {string} campaignId - O ID da campanha a ser atualizada.
     * @param {object} updates - Os campos a serem atualizados na campanha.
     * @returns {Promise<object>} - A campanha atualizada.
     */
    async update(campaignId, updates) {
        const authToken = localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/${campaignId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(updates)
        });

        if (!response.ok) {
            const errorResult = await response.json();
            throw new Error(errorResult.message || 'Falha ao atualizar a campanha.');
        }
        return response.json();
    },

    /**
     * Deleta uma campanha.
     * @param {string} campaignId - O ID da campanha a ser deletada.
     * @returns {Promise<void>}
     */
    async delete(campaignId) {
        const authToken = localStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/${campaignId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (!response.ok) {
            const errorResult = await response.json();
            throw new Error(errorResult.message || 'Falha ao deletar a campanha.');
        }
    }
};
