
import { Pool } from 'pg';
import pool from '../../Processo.Conexao.Banco.Dados.js';

interface CommentData {
    user_id: number;
    content: string;
    [key: string]: any; // Allow other properties
}

interface Comment extends CommentData {
    id: number;
    created_at: Date;
    updated_at: Date;
}

interface CommentWithUser extends Comment {
    username: string;
    avatar_url: string;
}

const criar = async (tableName: string, parentIdColumn: string, commentData: CommentData): Promise<Comment> => {
    const { user_id, content } = commentData;
    const parentId = commentData[parentIdColumn];
    const query = `
        INSERT INTO ${tableName} (${parentIdColumn}, user_id, content, created_at, updated_at)
        VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING *;
    `;
    const { rows } = await (pool as Pool).query(query, [parentId, user_id, content]);
    return rows[0];
};

const buscarPorParentId = async (tableName: string, parentIdColumn: string, parentId: number, { limit = 10, offset = 0 }): Promise<CommentWithUser[]> => {
    const query = `
        SELECT c.*, u.nickname as username, u.photo_url as avatar_url
        FROM ${tableName} c
        JOIN users u ON c.user_id = u.id
        WHERE c.${parentIdColumn} = $1
        ORDER BY c.created_at DESC
        LIMIT $2 OFFSET $3;
    `;
    const { rows } = await (pool as Pool).query(query, [parentId, limit, offset]);
    return rows;
};

const buscarPorId = async (tableName: string, commentId: number): Promise<Comment> => {
    const query = `
        SELECT * FROM ${tableName} WHERE id = $1;
    `;
    const { rows } = await (pool as Pool).query(query, [commentId]);
    return rows[0];
};

const atualizar = async (tableName: string, commentId: number, updates: { content: string }): Promise<Comment> => {
    const { content } = updates;
    const query = `
        UPDATE ${tableName}
        SET content = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING *;
    `;
    const { rows } = await (pool as Pool).query(query, [content, commentId]);
    return rows[0];
};

const deletar = async (tableName: string, commentId: number): Promise<boolean> => {
    const query = `DELETE FROM ${tableName} WHERE id = $1`;
    const res = await (pool as Pool).query(query, [commentId]);
    return (res && res.rowCount) ? res.rowCount > 0 : false;
};

export default {
    criar,
    buscarPorParentId,
    buscarPorId,
    atualizar,
    deletar
};
