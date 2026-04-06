
import { Pool } from 'pg';
import pool from '../../Processo.Conexao.Banco.Dados.js';

interface Reel {
    id: number;
    user_id: string;
    video_url: string;
    description?: string;
    music_id?: string;
    hashtags: string[];
    location?: string;
    created_at: Date;
    updated_at: Date;
    username: string; // from users table
    avatar_url: string; // from users table
    likes_count: number; // derived
    comments_count: number; // derived
}

interface ReelData {
    user_id: string;
    video_url: string;
    description?: string;
    music_id?: string;
    hashtags?: string[];
    location?: string;
}

interface UpdateData {
    description?: string;
    hashtags?: string[];
    location?: string;
}

const create = async (reelData: ReelData): Promise<Reel> => {
    const {
        user_id, video_url, description, music_id, hashtags, location
    } = reelData;
    
    const query = `
        INSERT INTO reels (user_id, video_url, description, music_id, hashtags, location, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING *;
    `;
    
    const values = [user_id, video_url, description, music_id, JSON.stringify(hashtags || []), location];
    const { rows } = await (pool as Pool).query(query, values);
    return rows[0];
};

const findAll = async ({ limit = 20, offset = 0 }: { limit?: number, offset?: number }): Promise<Reel[]> => {
    const query = `
        SELECT r.*, u.username, u.avatar_url, 
               (SELECT COUNT(*) FROM reel_likes WHERE reel_id = r.id) AS likes_count,
               (SELECT COUNT(*) FROM reel_comments WHERE reel_id = r.id) AS comments_count
        FROM reels r
        JOIN users u ON r.user_id = u.id
        ORDER BY r.created_at DESC
        LIMIT $1 OFFSET $2;
    `;
    const { rows } = await (pool as Pool).query(query, [limit, offset]);
    return rows;
};

const findById = async (reelId: number): Promise<Reel | undefined> => {
    const query = `
        SELECT r.*, u.username, u.avatar_url, 
               (SELECT COUNT(*) FROM reel_likes WHERE reel_id = r.id) AS likes_count,
               (SELECT COUNT(*) FROM reel_comments WHERE reel_id = r.id) AS comments_count
        FROM reels r
        JOIN users u ON r.user_id = u.id
        WHERE r.id = $1;
    `;
    const { rows } = await (pool as Pool).query(query, [reelId]);
    return rows[0];
};

const update = async (reelId: number, updates: UpdateData): Promise<Reel | undefined> => {
    const { description, hashtags, location } = updates;
    
    const query = `
        UPDATE reels
        SET 
            description = COALESCE($1, description),
            hashtags = COALESCE($2, hashtags),
            location = COALESCE($3, location),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $4
        RETURNING *;
    `;
    
    const values = [description, hashtags ? JSON.stringify(hashtags) : null, location, reelId];
    const { rows } = await (pool as Pool).query(query, values);
    return rows[0];
};

const remove = async (reelId: number): Promise<boolean> => {
    const { rowCount } = await (pool as Pool).query('DELETE FROM reels WHERE id = $1', [reelId]);
    return rowCount ? rowCount > 0 : false;
};

export default {
    create,
    findAll,
    findById,
    update,
    remove
};
