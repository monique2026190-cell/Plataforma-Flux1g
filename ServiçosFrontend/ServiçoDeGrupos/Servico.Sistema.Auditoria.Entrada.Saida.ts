import { dadosProviderGrupo } from '../Infra/Dados.Provider.Grupo';

const contextoBase = "Servico.Sistema.Auditoria.Entrada.Saida";

/**
 * Busca os logs de auditoria de entrada e saída de membros no grupo.
 */
export const getEntryExitLogs = async (groupId: string): Promise<any[]> => {
    if (!groupId) {
        return Promise.reject('ID do grupo não fornecido.');
    }
    try {
        return await dadosProviderGrupo.obterAuditoria(groupId, 'entrada-saida');
    } catch (error) {
        throw error;
    }
};
