import { dadosProviderGrupo } from '../Infra/Dados.Provider.Grupo';

/**
 * Busca todas as denúncias de um grupo específico.
 */
export const getReports = async (groupId: string): Promise<any[]> => {
    if (!groupId) {
        return Promise.reject('ID do grupo não fornecido.');
    }
    try {
        return await dadosProviderGrupo.obterAuditoria(groupId, 'denuncias');
    } catch (error) {
        throw error;
    }
};

/**
 * Rejeita (ignora) uma denúncia específica.
 */
export const dismissReport = async (groupId: string, reportId: string): Promise<object> => {
    if (!groupId || !reportId) {
        return Promise.reject('IDs não fornecidos.');
    }
    try {
        return await (dadosProviderGrupo as any).rejeitarDenuncia(groupId, reportId);
    } catch (error) {
        throw error;
    }
};

// Aliases para compatibilidade legado
export const obterDenuncias = getReports;
export const rejeitarDenuncia = dismissReport;
