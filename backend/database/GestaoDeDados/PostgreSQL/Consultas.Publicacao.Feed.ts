
import { Pool } from 'pg';
import pool from '../../Processo.Conexao.Banco.Dados.js';

interface Post {
    id: number;
    author_id: string;
    content: string;
    media_url?: string;
    parent_post_id?: number;
    type: 'text' | 'image' | 'poll';
    poll_options?: any; // Consider a more specific type if possible
    cta_link?: string;
    cta_text?: string;
    is_adult_content: boolean;
    created_at: Date;
    updated_at: Date;
    username: string; // from users table
    avatar_url: string; // from users table
    name?: string; // from user_profiles table
    nickname?: string; // from user_profiles table
}

interface PostData {
    author_id: string;
    content: string;
    media_url?: string;
    parent_post_id?: number;
    type?: 'text' | 'image' | 'poll';
    poll_options?: any;
    cta_link?: string;
    cta_text?: string;
    is_adult_content?: boolean;
}

interface UpdateData {
    [key: string]: any;
}

const buildUpdateQuery = (table: string, data: UpdateData, idColumn: string, idValue: number): { query: string, values: any[] } => {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const setClause = [
        ...fields.map((field, index) => `"${field}" = $${index + 1}`),
        `"updated_at" = NOW()`
    ].join(', ');

    const query = `UPDATE "${table}" SET ${setClause} WHERE "${idColumn}" = $${fields.length + 1} RETURNING *`;

    return { query, values: [...values, idValue] };
};

export const criar = async (postData: PostData): Promise<Post> => {
    const { author_id, content, media_url, parent_post_id, type, poll_options, cta_link, cta_text, is_adult_content } = postData;
    const query = `
        INSERT INTO posts (author_id, content, media_url, parent_post_id, type, poll_options, cta_link, cta_text, is_adult_content)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *;
    `;
    const values = [author_id, content, media_url, parent_post_id, type || 'text', poll_options || null, cta_link, cta_text, is_adult_content || false];
    const { rows } = await (pool as Pool).query(query, values);
    return rows[0];
};

export const obterTodos = async ({ limit = 10, cursor, allowAdultContent = 'false' }: { limit?: number, cursor?: string, allowAdultContent?: string }): Promise<{ data: Post[], nextCursor: string | null }> => {
    const params: any[] = [];
    let whereClauses = ['p.parent_post_id IS NULL'];

    if (cursor) {
        params.push(cursor);
        whereClauses.push(`p.created_at < $${params.length}`);
    }

    if (allowAdultContent !== 'true') {
        whereClauses.push('p.is_adult_content = false');
    }

    params.push(limit);
    const limitParamIndex = params.length;

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
    
    const { rows } = await (pool as Pool).query(query, params);

    let nextCursor: string | null = null;
    if (rows.length === limit) {
        nextCursor = rows[rows.length - 1].created_at;
    }

    return { data: rows, nextCursor };
};

export const obterPorId = async (postId: number): Promise<Post | undefined> => {
    const query = `
        SELECT p.*, u.nickname as username, u.photo_url as avatar_url, up.name, up.nickname
        FROM posts p
        JOIN users u ON p.author_id = u.id
        LEFT JOIN user_profiles up ON p.author_id = up.id
        WHERE p.id = $1;
    `;
    const { rows } = await (pool as Pool).query(query, [postId]);
    return rows[0];
};

export const atualizar = async (postId: number, updates: UpdateData): Promise<Post | undefined> => {
    if (Object.keys(updates).length === 0) {
        return obterPorId(postId);
    }
    const { query, values } = buildUpdateQuery('posts', updates, 'id', postId);
    const { rows } = await (pool as Pool).query(query, values);
    return rows[0];
};

export const remover = async (postId: number): Promise<boolean> => {
    const { rowCount } = await (pool as Pool).query('DELETE FROM posts WHERE id = $1', [postId]);
    return rowCount ? rowCount > 0 : false;
};
