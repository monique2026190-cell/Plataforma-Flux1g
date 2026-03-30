import { dadosProviderSistema } from '../Infra/Dados.Provider.Sistema';

const contextoBase = "Servico.Sistema.Modo.Hub";

/**
 * Busca o estado atual do Modo Hub para um grupo.
 */
export const getHubModeStatus = async (groupId: string): Promise<{ isEnabled: boolean }> => {
    if (!groupId) {
        return Promise.reject("O ID do grupo é obrigatório.");
    }
    try {
        return await dadosProviderSistema.buscarStatusHub(groupId);
    } catch (error) {
        throw error;
    }
};

/**
 * Define o estado do Modo Hub para um grupo.
 */
export const setHubModeStatus = async (groupId: string, payload: { isEnabled: boolean }): Promise<any> => {
    if (!groupId) {
        return Promise.reject("O ID do grupo é obrigatório.");
    }
    try {
        return await dadosProviderSistema.definirStatusModoHub(groupId, payload);
    } catch (error) {
        throw error;
    }
};
