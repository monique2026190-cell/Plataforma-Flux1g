
import { Pool } from 'pg';
import pool from '../../Processo.Conexao.Banco.Dados.js';

interface MarketplaceItem {
    id: number;
    user_id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    location: string;
    image_urls: string[];
    created_at: Date;
    updated_at: Date;
    username: string; // from users table
    avatar_url: string; // from users table
    contact_info?: string; // from users table, for findById
}

interface ItemData {
    user_id: string;
    title: string;
    description: string;
    price: number;
    category: string;
    location: string;
    image_urls?: string[];
}

interface FindAllOptions {
    limit?: number;
    offset?: number;
    category?: string;
    min_price?: number;
    max_price?: number;
    location?: string;
}

interface UpdateData {
    title?: string;
    description?: string;
    price?: number;
    category?: string;
    location?: string;
    image_urls?: string[];
}

const create = async (itemData: ItemData): Promise<MarketplaceItem> => {
    const {
        user_id, title, description, price, category, location, image_urls
    } = itemData;
    
    const query = `
        INSERT INTO marketplace_items (user_id, title, description, price, category, location, image_urls, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING *;
    `;
    
    const values = [user_id, title, description, price, category, location, JSON.stringify(image_urls || [])];
    const { rows } = await (pool as Pool).query(query, values);
    return rows[0];
};

const findAll = async ({ limit = 20, offset = 0, category, min_price, max_price, location }: FindAllOptions): Promise<MarketplaceItem[]> => {
    let query = `
        SELECT m.*, u.username, u.avatar_url
        FROM marketplace_items m
        JOIN users u ON m.user_id = u.id
        WHERE 1=1
    `;
    const values: any[] = [];
    
    if (category) {
        values.push(category);
        query += ` AND m.category ILIKE $${values.length}`;
    }
    if (min_price) {
        values.push(min_price);
        query += ` AND m.price >= $${values.length}`;
    }
    if (max_price) {
        values.push(max_price);
        query += ` AND m.price <= $${values.length}`;
    }
    if (location) {
        values.push(`%${location}%`);
        query += ` AND m.location ILIKE $${values.length}`;
    }
    
    values.push(limit, offset);
    query += ` ORDER BY m.created_at DESC LIMIT $${values.length - 1} OFFSET $${values.length}`;
    
    const { rows } = await (pool as Pool).query(query, values);
    return rows;
};

const findById = async (itemId: number): Promise<MarketplaceItem | undefined> => {
    const query = `
        SELECT m.*, u.username, u.avatar_url, u.contact_info
        FROM marketplace_items m
        JOIN users u ON m.user_id = u.id
        WHERE m.id = $1;
    `;
    const { rows } = await (pool as Pool).query(query, [itemId]);
    return rows[0];
};

const update = async (itemId: number, updates: UpdateData): Promise<MarketplaceItem | undefined> => {
    const {
        title, description, price, category, location, image_urls
    } = updates;
    
    const query = `
        UPDATE marketplace_items
        SET 
            title = COALESCE($1, title),
            description = COALESCE($2, description),
            price = COALESCE($3, price),
            category = COALESCE($4, category),
            location = COALESCE($5, location),
            image_urls = COALESCE($6, image_urls),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $7
        RETURNING *;
    `;
    
    const values = [title, description, price, category, location, image_urls ? JSON.stringify(image_urls) : null, itemId];
    const { rows } = await (pool as Pool).query(query, values);
    return rows[0];
};

const remove = async (itemId: number): Promise<boolean> => {
    const { rowCount } = await (pool as Pool).query('DELETE FROM marketplace_items WHERE id = $1', [itemId]);
    return rowCount ? rowCount > 0 : false;
};

export default {
    create,
    findAll,
    findById,
    update,
    remove
};
