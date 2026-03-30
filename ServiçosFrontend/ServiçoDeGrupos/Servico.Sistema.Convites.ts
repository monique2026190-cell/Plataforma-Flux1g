import { dadosProviderGrupo } from '../Infra/Dados.Provider.Grupo';

const contextoBase = "Servico.Sistema.Convites";

/**
 * Gera um convite para o grupo.
 */
export const createInvite = async (groupId: string, config: any): Promise<any> => {
    if (!groupId) {
        return Promise.reject('ID do grupo não fornecido.');
    }
    try {
        return await dadosProviderGrupo.gerarConvite(groupId, config);
    } catch (error) {
        throw error;
    }
};

/**
 * Busca a lista de convites ativos do grupo.
 */
export const getInvites = async (groupId: string): Promise<any[]> => {
    if (!groupId) {
        return Promise.reject('ID do grupo não fornecido.');
    }
    try {
        return await dadosProviderGrupo.obterAuditoria(groupId, 'convites');
    } catch (error) {
        throw error;
    }
};

// Aliases para compatibilidade legado
export const gerarConvite = createInvite;
export const obterConvites = getInvites;
export const listarConvites = getInvites;
