
import { 
    inserirGrupo, 
    buscarGrupoPorId, 
    atualizarGrupo, 
    deletarGrupo 
} from '../database/GestaoDeDados/PostgreSQL/Consultas.Grupo.js';

class GroupRepository {
    /**
     * Creates a new group in the database.
     * @param {object} groupData - Object containing group data, 
     *                               usually from `model.paraBancoDeDados()`.
     * @returns {Promise<object>} - The group record as it was saved in the database.
     */
    async create(groupData) { 
        try {
            // The function in Consultas.Grupo.js is already named inserirGrupo
            return await inserirGrupo(groupData);
        } catch (error) {
            // The error is already logged in the query layer, so we just re-throw it.
            throw error;
        }
    }

    /**
     * Finds a group by its ID.
     * @param {string} id - The UUID of the group.
     * @returns {Promise<object|null>} - The group record or null if not found.
     */
    async findById(id) {
        try {
            return await buscarGrupoPorId(id);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Updates a group's data.
     * @param {string} id - The UUID of the group.
     * @param {object} updates - An object with the fields to be updated.
     * @returns {Promise<object>} - The updated group record.
     */
    async update(id, updates) {
        try {
            return await atualizarGrupo(id, updates);
        } catch (error) {
            throw error;
        }
    }

    /**
     * Deletes a group by its ID.
     * @param {string} id - The UUID of the group.
     * @returns {Promise<boolean>} - True if the deletion was successful, false otherwise.
     */
    async delete(id) {
        try {
            return await deletarGrupo(id);
        } catch (error) {
            throw error;
        }
    }
}

export default new GroupRepository();
