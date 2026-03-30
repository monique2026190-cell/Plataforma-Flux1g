import { dadosProviderGrupo } from '../Infra/Dados.Provider.Grupo';

const contextoBase = "Servico.Sistema.Grupo.Moderacao";

interface KeywordFilter {
    enabled: boolean;
    keywords: string[];
}

interface MediaControl {
    allowImages: boolean;
    allowVideos: boolean;
}

interface AntiFlood {
    enabled: boolean;
    messageLimit: number;
    timeFrame: number; // in seconds
}

interface PostApproval {
    enabled: boolean;
    scope: 'new_members' | 'all_members';
}

export interface GroupModerationSettings {
    keywordFilter: KeywordFilter;
    mediaControl: MediaControl;
    antiFlood: AntiFlood;
    postApproval: PostApproval;
}

/**
 * Busca as configurações de moderação de um grupo.
 */
export const getModerationSettings = async (groupId: string): Promise<GroupModerationSettings> => {
    if (!groupId) {
        return Promise.reject("O ID do grupo é obrigatório.");
    }

    try {
        return await dadosProviderGrupo.obterConfiguracoesModeracao(groupId);
    } catch (error) {
        throw error;
    }
};

/**
 * Atualiza as configurações de moderação de um grupo.
 */
export const updateModerationSettings = async (groupId: string, settings: Partial<GroupModerationSettings>): Promise<GroupModerationSettings> => {
    if (!groupId) {
        return Promise.reject("O ID do grupo é obrigatório.");
    }

    try {
        return await dadosProviderGrupo.atualizarConfiguracoesModeracao(groupId, settings);
    } catch (error) {
        throw error;
    }
};
