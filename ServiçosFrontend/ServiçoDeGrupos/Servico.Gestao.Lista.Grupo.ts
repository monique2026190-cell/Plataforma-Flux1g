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

/**
 * Objeto de serviço com interface compatível com a camada de aplicação legado.
 */
export const servicoGestaoListaGrupo = {
    obterGrupos: async (): Promise<any[]> => {
        return getGroupList();
    },
    excluirGrupo: async (groupId: string): Promise<void> => {
        if(!groupId) throw new Error("ID do grupo não informado.");
        return await dadosProviderGrupo.removerMembro(groupId, 'me'); // Ou o endpoint correto de deletar grupo se disponível.
    }
};
