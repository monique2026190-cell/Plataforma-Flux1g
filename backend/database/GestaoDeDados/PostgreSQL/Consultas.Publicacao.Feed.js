
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
    const setClause = [
        ...fields.map((field, index) => `"${field}" = $${index + 1}`),
        `"updated_at" = NOW()`
    ].join(', ');

    const query = `UPDATE "${table}" SET ${setClause} WHERE "${idColumn}" = $${fields.length + 1} RETURNING *`;

    return { query, values: [...values, idValue] };
};

export const criar = async (postData) => {
    // Correção: Removido JSON.stringify. O driver pg lida com objetos JS para JSONB.
    const { author_id, content, media_url, parent_post_id, type, poll_options, cta_link, cta_text, is_adult_content } = postData;
    const query = `
        INSERT INTO posts (author_id, content, media_url, parent_post_id, type, poll_options, cta_link, cta_text, is_adult_content)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *;
    `;
    const values = [author_id, content, media_url, parent_post_id, type || 'text', poll_options || null, cta_link, cta_text, is_adult_content || false];
    const { rows } = await pool.query(query, values);
    return rows[0];
};

export const obterTodos = async ({ limit = 10, cursor, allowAdultContent = 'false' }) => {
    const params = [];
    let whereClauses = ['p.parent_post_id IS NULL'];

    if (cursor) {
        params.push(cursor);
        whereClauses.push(`p.created_at < $${params.length}`);
    }

    if (allowAdultContent !== 'true') {
        whereClauses.push('p.is_adult_content = false');
    }

    params.push(parseInt(limit, 10) || 10);
    const limitParamIndex = params.length;

    // Correção: Trocado u.username por u.nickname e u.avatar_url por u.photo_url com aliases
    const query = `
        SELECT 
            p.*, 
            u.nickname as username, 
            u.photo_url as avatar_url, 
            up.name, 
            up.nickname
        FROM posts p
        JOIN users u ON p.author_id = u.id
        LEFT JOIN user_profiles up ON p.author_id = up.id
        WHERE ${whereClauses.join(' AND ')}
        ORDER BY p.created_at DESC
        LIMIT $${limitParamIndex};
    `;
    
    const { rows } = await pool.query(query, params);

    let nextCursor = null;
    if (rows.length === (parseInt(limit, 10) || 10)) {
        nextCursor = rows[rows.length - 1].created_at;
    }

    return { data: rows, nextCursor };
};

export const obterPorId = async (postId) => {
    // Correção: Trocado u.username por u.nickname e u.avatar_url por u.photo_url com aliases
    const query = `
        SELECT p.*, u.nickname as username, u.photo_url as avatar_url, up.name, up.nickname
        FROM posts p
        JOIN users u ON p.author_id = u.id
        LEFT JOIN user_profiles up ON p.author_id = up.id
        WHERE p.id = $1;
    `;
    const { rows } = await pool.query(query, [postId]);
    return rows[0];
};

export const atualizar = async (postId, updates) => {
    // Correção: Implementada atualização dinâmica
    if (Object.keys(updates).length === 0) {
        return obterPorId(postId);
    }
    const { query, values } = buildUpdateQuery('posts', updates, 'id', postId);
    const { rows } = await pool.query(query, values);
    return rows[0];
};

export const remover = async (postId) => {
    const { rowCount } = await pool.query('DELETE FROM posts WHERE id = $1', [postId]);
    return rowCount > 0;
};
