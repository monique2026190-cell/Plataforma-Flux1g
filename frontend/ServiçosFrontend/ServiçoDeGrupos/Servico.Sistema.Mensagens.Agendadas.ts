import { dadosProviderGrupo } from '../Infra/Dados.Provider.Grupo';

const contextoBase = "Servico.Sistema.Mensagens.Agendadas";

/**
 * Busca a lista de mensagens agendadas para um grupo.
 */
export const getScheduledMessages = async (groupId: string): Promise<any[]> => {
    if (!groupId) {
        return Promise.reject('ID do grupo não fornecido.');
    }
    try {
        return await dadosProviderGrupo.buscarMensagensAgendadas(groupId);
    } catch (error) {
        throw error;
    }
};

/**
 * Cria uma mensagem agendada.
 */
export const createScheduledMessage = async (groupId: string, messageData: any): Promise<any> => {
    if (!groupId) {
        return Promise.reject("O ID do grupo é obrigatório.");
    }
    try {
        return await dadosProviderGrupo.agendarMensagem(groupId, messageData);
    } catch (error) {
        throw error;
    }
};

/**
 * Atualiza uma mensagem agendada.
 */
export const updateScheduledMessage = async (groupId: string, messageId: string, messageData: any): Promise<any> => {
    if (!groupId || !messageId) {
        return Promise.reject("Os IDs do grupo e da mensagem são obrigatórios.");
    }
    try {
        // Como o provider básico ainda não tem o 'atualizar', vou direcionar ou ajustar o provider depois.
        // Para a migração "tudo de uma vez", vou usar o httpClient direto via provider se existisse,
        // mas vou adicionar o método no provider agora.
        return await (dadosProviderGrupo as any).atualizarMensagemAgendada(groupId, messageId, messageData);
    } catch (error) {
        throw error;
    }
};

/**
 * Deleta uma mensagem agendada.
 */
export const deleteScheduledMessage = async (groupId: string, messageId: string): Promise<any> => {
    if (!groupId || !messageId) {
        return Promise.reject("Os IDs do grupo e da mensagem são obrigatórios.");
    }
    try {
        return await (dadosProviderGrupo as any).deletarMensagemAgendada(groupId, messageId);
    } catch (error) {
        throw error;
    }
};
