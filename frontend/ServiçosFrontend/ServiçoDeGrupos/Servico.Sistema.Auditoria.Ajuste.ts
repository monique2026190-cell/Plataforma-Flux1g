import { dadosProviderGrupo } from '../Infra/Dados.Provider.Grupo';

/**
 * Busca os logs de auditoria relacionados a ajustes e configurações do grupo.
 */
export const getSettingsAuditLogs = async (groupId: string): Promise<Array<any>> => {
    if (!groupId) {
        return Promise.reject('ID do grupo não fornecido.');
    }
    try {
        return await dadosProviderGrupo.obterAuditoria(groupId, 'ajustes');
    } catch (error) {
        throw error;
    }
};
