import { dadosProviderGrupo } from '../Infra/Dados.Provider.Grupo';

const contextoBase = "Servico.Sistema.Pagina.Vendas";

/**
 * Busca o conteúdo da página de vendas de um grupo.
 */
export const getSalesPage = async (groupId: string): Promise<any> => {
    if (!groupId) {
        return Promise.reject("O ID do grupo é obrigatório.");
    }
    try {
        return await dadosProviderGrupo.obterPaginaVendas(groupId);
    } catch (error) {
        throw error;
    }
};

/**
 * Atualiza o conteúdo da página de vendas de um grupo.
 */
export const updateSalesPage = async (groupId: string, pageData: any): Promise<any> => {
    if (!groupId) {
        return Promise.reject("O ID do grupo é obrigatório.");
    }
    try {
        return await dadosProviderGrupo.configurarPaginaVendas(groupId, pageData);
    } catch (error) {
        throw error;
    }
};
