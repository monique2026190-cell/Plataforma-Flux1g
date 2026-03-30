import { dadosProviderGrupo } from '../Infra/Dados.Provider.Grupo';

const contextoBase = "Servico.Sistema.Geral";

/**
 * Busca os detalhes gerais de um grupo.
 */
export const getGroupDetails = async (groupId: string): Promise<any> => {
    if (!groupId) {
        return Promise.reject('ID do grupo não fornecido.');
    }
    try {
        return await dadosProviderGrupo.obterDetalhes(groupId);
    } catch (error) {
        throw error;
    }
};

/**
 * Atualiza as configurações de um grupo.
 */
export const updateGroupSettings = async (groupId: string, settings: object): Promise<any> => {
    if (!groupId) {
        return Promise.reject('ID do grupo não fornecido.');
    }
    try {
        return await dadosProviderGrupo.atualizarConfiguracoes(groupId, settings);
    } catch (error) {
        throw error;
    }
};

/**
 * Busca as estatísticas de um grupo.
 */
export const getGroupStats = async (groupId: string): Promise<any> => {
    if (!groupId) {
        return Promise.reject('ID do grupo não fornecido.');
    }
    try {
        return await dadosProviderGrupo.obterEstatisticas(groupId);
    } catch (error) {
        throw error;
    }
};

// Aliases para compatibilidade legado
export const obterDetalhes = getGroupDetails;
export const atualizarConfiguracoes = updateGroupSettings;
export const obterEstatisticas = getGroupStats;
