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
        // Passando filtro via parâmetros se necessário
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
        // Usar método de remover do provider
        return await (dadosProviderGrupo as any).apagarMensagem(groupId, messageId);
    } catch (error) {
        throw error;
    }
};
