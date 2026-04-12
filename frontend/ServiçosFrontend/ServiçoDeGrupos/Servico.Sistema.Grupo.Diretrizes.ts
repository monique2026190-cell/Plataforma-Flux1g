import { dadosProviderGrupo } from '../Infra/Dados.Provider.Grupo';

const contextoBase = "Servico.Sistema.Grupo.Diretrizes";

interface SlowModeSettings {
    enabled: boolean;
    interval: number; // Em segundos
}

interface GroupGuidelinesData {
    guidelines?: string;
    slowMode?: SlowModeSettings;
    slowModeEntry?: SlowModeSettings;
}

/**
 * Atualiza as diretrizes e controles de moderação de um grupo.
 */
export const updateGroupGuidelines = async (groupId: string, data: GroupGuidelinesData): Promise<GroupGuidelinesData> => {
    if (!groupId) {
        return Promise.reject("O ID do grupo é obrigatório.");
    }

    try {
        const { guidelines, slowMode, slowModeEntry } = data;
        const promises: Promise<any>[] = [];

        if (guidelines !== undefined) {
            promises.push(dadosProviderGrupo.atualizarDiretrizes(groupId, { guidelines }));
        }

        const settings: { slowMode?: SlowModeSettings; slowModeEntry?: SlowModeSettings } = {};
        if (slowMode !== undefined) {
            settings.slowMode = slowMode;
        }
        if (slowModeEntry !== undefined) {
            settings.slowModeEntry = slowModeEntry;
        }

        if (Object.keys(settings).length > 0) {
            promises.push(dadosProviderGrupo.atualizarConfiguracoesModeracao(groupId, settings));
        }

        await Promise.all(promises);
        return data;
    } catch (error) {
        throw error;
    }
};

/**
 * Obtém as diretrizes de um grupo.
 */
export const getGroupGuidelines = async (groupId: string): Promise<any> => {
    if (!groupId) {
        return Promise.reject("O ID do grupo é obrigatório.");
    }
    try {
        return await dadosProviderGrupo.obterDiretrizes(groupId);
    } catch (error) {
        throw error;
    }
};
