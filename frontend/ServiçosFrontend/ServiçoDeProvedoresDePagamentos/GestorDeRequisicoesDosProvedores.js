
/**
 * GestorDeRequisicoesDosProvedores
 *
 * Este módulo centraliza a comunicação com a API backend para todos os
 * serviços relacionados a provedores de pagamento. Ele abstrai a lógica
 * do 'fetch', tratamento de erros e configuração de headers.
 */
const gestorDeRequisicoes = {
    /**
     * Realiza uma requisição para a API backend.
     * @param {string} endpoint O endpoint da API (ex: '/gateways/stripe/account-link').
     * @param {string} method O método HTTP ('GET', 'POST', 'PUT', 'DELETE').
     * @param {object} [body=null] O corpo da requisição para métodos POST/PUT.
     * @returns {Promise<any>} A resposta da API em formato JSON.
     */
    async request(endpoint, method = 'GET', body = null) {
        // O token de autenticação do usuário deve ser obtido de forma segura
        // (ex: de um contexto de autenticação, cookie httpOnly, ou localStorage)
        const token = localStorage.getItem('userToken'); // Exemplo
        const headers = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config = {
            method,
            headers,
        };

        if (body) {
            config.body = JSON.stringify(body);
        }

        try {
            // Assume que o servidor de desenvolvimento está configurado para proxy /api
            const response = await fetch(`/api${endpoint}`, config);

            // Se a resposta não for OK, tenta extrair uma mensagem de erro do corpo
            if (!response.ok) {
                let errorData;
                try {
                    errorData = await response.json();
                } catch (e) {
                    // Se o corpo do erro não for JSON, usa o texto de status
                    errorData = { message: response.statusText };
                }
                throw new Error(errorData.message || `Erro na API: ${response.status}`);
            }

            // Se a resposta tiver conteúdo JSON, faz o parse. Senão, retorna sucesso.
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                return response.json();
            } else {
                // Para respostas sem corpo (ex: 204 No Content)
                return { success: true, status: response.status };
            }

        } catch (error) {
            console.error(`[GestorDeRequisicoes] Falha na requisição para ${endpoint}:`, error);
            // Re-lança o erro para que a lógica de chamada possa tratá-lo (ex: exibir um toast para o usuário)
            throw error;
        }
    },

    // Funções de atalho para conveniência
    get(endpoint) {
        return this.request(endpoint, 'GET');
    },

    post(endpoint, body) {
        return this.request(endpoint, 'POST', body);
    },

    put(endpoint, body) {
        return this.request(endpoint, 'PUT', body);
    },

    delete(endpoint) {
        return this.request(endpoint, 'DELETE');
    }
};

export default gestorDeRequisicoes;
