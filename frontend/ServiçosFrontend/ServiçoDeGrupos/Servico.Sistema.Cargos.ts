import { dadosProviderGrupo } from '../Infra/Dados.Provider.Grupo';

const contextoBase = "Servico.Sistema.Cargos";

/**
 * Busca a lista de cargos de um grupo.
 */
export const getRoles = async (groupId: string): Promise<any[]> => {
    if (!groupId) {
        return Promise.reject('ID do grupo não fornecido.');
    }
    try {
        return await dadosProviderGrupo.listarCargos(groupId);
    } catch (error) {
        throw error;
    }
};

/**
 * Atribui um cargo a um membro específico.
 */
export const assignRole = async (groupId: string, memberId: string, roleId: string): Promise<any> => {
    if (!groupId || !memberId || !roleId) {
        return Promise.reject('Parâmetros insuficientes.');
    }
    try {
        return await dadosProviderGrupo.atribuirCargo(groupId, memberId, roleId);
    } catch (error) {
        throw error;
    }
};

// Aliases para compatibilidade legado
export const obterCargos = getRoles;
export const listarCargos = getRoles;
export const atribuirCargo = assignRole;
export const definirCargo = assignRole;
