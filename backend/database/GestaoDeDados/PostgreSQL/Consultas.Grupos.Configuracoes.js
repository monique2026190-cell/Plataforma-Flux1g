
import pool from '../../Processo.Conexao.Banco.Dados.js';

/**
 * Constrói uma query de UPDATE dinamicamente.
 * @param {string} table - O nome da tabela.
 * @param {Object} data - Objeto com os campos a serem atualizados (keys são nomes de colunas).
 * @param {string} idColumn - O nome da coluna de ID.
 * @param {string} idValue - O valor do ID para a cláusula WHERE.
 * @returns {{query: string, values: Array}}
 */
const buildUpdateQuery = (table, data, idColumn, idValue) => {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const setClause = fields
        .map((field, index) => `"${field}" = $${index + 1}`)
        .join(', ');

    const query = `UPDATE "${table}" SET ${setClause} WHERE "${idColumn}" = $${fields.length + 1}`;

    return { query, values: [...values, idValue] };
};

/**
 * Atualiza as configurações de um grupo.
 * @param {string} groupId - O UUID do grupo.
 * @param {Object} settingsData - Um objeto com os dados a serem atualizados. Ex: { name: 'Novo Nome', privacy: 'private' }
 */
export const atualizarConfiguracoes = async (groupId, settingsData) => {
    // Remove quaisquer chaves indefinidas para não tentar atualizar com 'undefined'
    const validData = Object.entries(settingsData)
        .filter(([_, value]) => value !== undefined)
        .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

    if (Object.keys(validData).length === 0) {
        // Nada a ser atualizado
        return true;
    }

    const { query, values } = buildUpdateQuery('group_settings', validData, 'group_id', groupId);
    const result = await pool.query(query, values);
    return result.rowCount > 0;
};

/**
 * Obtém todas as configurações de um grupo.
 * @param {string} groupId - O UUID do grupo.
 */
export const obterConfiguracoes = async (groupId) => {
    const query = `
        SELECT * FROM group_settings WHERE group_id = $1;
    `;
    const { rows } = await pool.query(query, [groupId]);
    return rows[0] || null;
};

/**
 * Obtém apenas as diretrizes de um grupo.
 * @param {string} groupId - O UUID do grupo.
 */
export const obterDiretrizes = async (groupId) => {
    const query = `
        SELECT guidelines FROM group_settings WHERE group_id = $1;
    `;
    const { rows } = await pool.query(query, [groupId]);
    return rows[0] ? rows[0].guidelines : null;
};

/**
 * Atualiza apenas as diretrizes de um grupo.
 * @param {string} groupId - O UUID do grupo.
 * @param {string} guidelines - O novo texto das diretrizes.
 */
export const atualizarDiretrizes = async (groupId, guidelines) => {
    const query = `
        UPDATE group_settings 
        SET guidelines = $1
        WHERE group_id = $2;
    `;
    const values = [guidelines, groupId];
    const result = await pool.query(query, values);
    return result.rowCount > 0;
};
