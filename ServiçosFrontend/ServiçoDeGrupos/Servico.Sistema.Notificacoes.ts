import { dadosProviderGrupo } from '../Infra/Dados.Provider.Grupo';

const contextoBase = "Servico.Sistema.Notificacoes";

export type MentionNotificationSetting = 'all' | 'admins_only' | 'off';

export interface GroupNotificationSettings {
    notifyOnNewMember: boolean;
    notifyOnMention: MentionNotificationSetting;
    notifyOnNewPost: boolean;
    disableAll: boolean;
}

/**
 * Busca as configurações de notificação de um grupo.
 */
export const getNotificationSettings = async (groupId: string): Promise<GroupNotificationSettings> => {
    if (!groupId) {
        return Promise.reject("O ID do grupo é obrigatório.");
    }
    try {
        return await dadosProviderGrupo.obterConfiguracoesNotificacao(groupId);
    } catch (error) {
        throw error;
    }
};

/**
 * Atualiza as configurações de notificação de um grupo.
 */
export const updateNotificationSettings = async (groupId: string, settings: Partial<GroupNotificationSettings>): Promise<GroupNotificationSettings> => {
    if (!groupId) {
        return Promise.reject("O ID do grupo é obrigatório.");
    }
    try {
        return await dadosProviderGrupo.atualizarConfiguracoesNotificacao(groupId, settings);
    } catch (error) {
        throw error;
    }
};
