import { dadosProviderGrupo } from '../Infra/Dados.Provider.Grupo';

const contextoBase = "Servico.Sistema.Auditoria.Mensagens";

/**
 * Busca os logs de auditoria de mensagens, com um filtro opcional por usuário.
 */
export const getMessageAuditLogs = async (groupId: string, filter?: object): Promise<any[]> => {
    if (!groupId) {
        return Promise.reject('ID do grupo não fornecido.');
    }
    try {
        return await dadosProviderGrupo.obterAuditoria(groupId, 'mensagens');
    } catch (error) {
        throw error;
    }
};

/**
 * Apaga uma mensagem específica dentro de um grupo.
 */
export const deleteGroupMessage = async (groupId: string, messageId: string): Promise<object> => {
    if (!groupId || !messageId) {
        return Promise.reject('IDs não fornecidos.');
    }
    try {
        return await (dadosProviderGrupo as any).apagarMensagem(groupId, messageId);
    } catch (error) {
        throw error;
    }
};

// Aliases para compatibilidade legado
export const obterLogs = getMessageAuditLogs;
export const apagarMensagem = deleteGroupMessage;
