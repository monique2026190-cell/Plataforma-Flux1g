import { dadosProviderGrupo } from '../Infra/Dados.Provider.Grupo';

const contextoBase = "Servico.Gestao.Lista.Grupo";

/**
 * Busca a lista de grupos que o usuário gerencia ou participa.
 */
export const getGroupList = async (): Promise<any[]> => {
    try {
        return await dadosProviderGrupo.buscarListaGrupos();
    } catch (error) {
        throw error;
    }
};
