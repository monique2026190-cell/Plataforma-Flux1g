
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
    // Adiciona o timestamp de atualização automaticamente
    const setClause = [
        ...fields.map((field, index) => `"${field}" = $${index + 1}`),
        `"updated_at" = NOW()`
    ].join(', ');

    const query = `UPDATE "${table}" SET ${setClause} WHERE "${idColumn}" = $${fields.length + 1} RETURNING *`;

    return { query, values: [...values, idValue] };
};

const inserirGrupoQuery = `
    INSERT INTO groups (
        id, name, description, group_type, price, currency, creator_id, created_at, 
        member_limit, cover_image, access_type, selected_provider_id, expiration_date, 
        vip_door, pixel_id, pixel_token, is_vip, status
    ) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
    RETURNING *;
`;

export const inserirGrupo = async (dadosDoGrupo) => {
    const values = [
        dadosDoGrupo.id,
        dadosDoGrupo.name,
        dadosDoGrupo.description,
        dadosDoGrupo.group_type,
        dadosDoGrupo.price,
        dadosDoGrupo.currency,
        dadosDoGrupo.creator_id,
        dadosDoGrupo.created_at,
        dadosDoGrupo.member_limit,
        dadosDoGrupo.cover_image,
        dadosDoGrupo.access_type,
        dadosDoGrupo.selected_provider_id,
        dadosDoGrupo.expiration_date,
        dadosDoGrupo.vip_door,
        dadosDoGrupo.pixel_id,
        dadosDoGrupo.pixel_token,
        dadosDoGrupo.is_vip,
        dadosDoGrupo.status
    ];

    try {
        const { rows } = await pool.query(inserirGrupoQuery, values);
        return rows[0];
    } catch (error) {
        console.error("Erro em Consultas.Grupo.js ao inserir grupo:", error);
        throw new Error("Falha ao salvar o grupo no banco de dados.");
    }
};

export const buscarGrupoPorId = async (id) => {
    const query = 'SELECT * FROM groups WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
};

/**
 * Atualiza os dados de um grupo de forma dinâmica.
 * @param {string} id - O UUID do grupo.
 * @param {Object} updates - Um objeto com os campos a serem atualizados (usando nomes de coluna do DB).
 */
export const atualizarGrupo = async (id, updates) => {
    if (Object.keys(updates).length === 0) {
        // Retorna o grupo existente se não houver atualizações
        return buscarGrupoPorId(id);
    }

    const { query, values } = buildUpdateQuery('groups', updates, 'id', id);

    try {
        const { rows } = await pool.query(query, values);
        return rows[0];
    } catch (error) {
        console.error("Erro em Consultas.Grupo.js ao atualizar grupo:", error);
        throw new Error("Falha ao atualizar o grupo no banco de dados.");
    }
};

export const deletarGrupo = async (id) => {
    const { rowCount } = await pool.query('DELETE FROM groups WHERE id = $1', [id]);
    return rowCount > 0;
};
