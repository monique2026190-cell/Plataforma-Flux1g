import { dadosProviderGrupo } from '../Infra/Dados.Provider.Grupo';

const contextoBase = "Servico.Sistema.Receita";

/**
 * Busca os dados de faturamento detalhado de um grupo.
 */
export const getGroupRevenue = async (groupId: string): Promise<any> => {
    if (!groupId) {
        return Promise.reject("O ID do grupo é obrigatório.");
    }
    try {
        return await dadosProviderGrupo.buscarRelatorioReceita(groupId);
    } catch (error) {
        throw error;
    }
};
