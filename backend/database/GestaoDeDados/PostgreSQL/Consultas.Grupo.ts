
import { Pool } from 'pg';
import pool from '../../Processo.Conexao.Banco.Dados.js';

interface Grupo {
    id: string;
    name: string;
    description?: string;
    group_type: 'public' | 'private' | 'vip';
    price?: number;
    currency?: string;
    creator_id: string;
    created_at: Date;
    updated_at?: Date;
    member_limit?: number;
    cover_image?: string;
    access_type: 'link' | 'request' | 'paid';
    selected_provider_id?: string;
    expiration_date?: Date;
    vip_door?: boolean;
    pixel_id?: string;
    pixel_token?: string;
    is_vip: boolean;
    status: string;
}

interface DadosNovoGrupo {
    id: string;
    name: string;
    description?: string;
    group_type: 'public' | 'private' | 'vip';
    price?: number;
    currency?: string;
    creator_id: string;
    created_at: Date;
    member_limit?: number;
    cover_image?: string;
    access_type: 'link' | 'request' | 'paid';
    selected_provider_id?: string;
    expiration_date?: Date;
    vip_door?: boolean;
    pixel_id?: string;
    pixel_token?: string;
    is_vip: boolean;
    status: string;
}

interface UpdateData {
    [key: string]: any;
}

const buildUpdateQuery = (table: string, data: UpdateData, idColumn: string, idValue: string): { query: string, values: any[] } => {
    const fields = Object.keys(data);
    const values = Object.values(data);
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

export const inserirGrupo = async (dadosDoGrupo: DadosNovoGrupo): Promise<Grupo> => {
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
        const { rows } = await (pool as Pool).query(inserirGrupoQuery, values);
        return rows[0];
    } catch (error) {
        console.error("Erro em Consultas.Grupo.ts ao inserir grupo:", error);
        throw new Error("Falha ao salvar o grupo no banco de dados.");
    }
};

export const buscarGrupoPorId = async (id: string): Promise<Grupo | undefined> => {
    const query = 'SELECT * FROM groups WHERE id = $1';
    const { rows } = await (pool as Pool).query(query, [id]);
    return rows[0];
};

export const atualizarGrupo = async (id: string, updates: UpdateData): Promise<Grupo | undefined> => {
    if (Object.keys(updates).length === 0) {
        return buscarGrupoPorId(id);
    }

    const { query, values } = buildUpdateQuery('groups', updates, 'id', id);

    try {
        const { rows } = await (pool as Pool).query(query, values);
        return rows[0];
    } catch (error) {
        console.error("Erro em Consultas.Grupo.ts ao atualizar grupo:", error);
        throw new Error("Falha ao atualizar o grupo no banco de dados.");
    }
};

export const deletarGrupo = async (id: string): Promise<boolean> => {
    const { rowCount } = await (pool as Pool).query('DELETE FROM groups WHERE id = $1', [id]);
    return rowCount ? rowCount > 0 : false;
};
