
import { Pool } from 'pg';
import pool from '../../Processo.Conexao.Banco.Dados.js';

interface GroupSettings {
    group_id: string;
    name?: string;
    privacy?: 'public' | 'private';
    guidelines?: string;
    [key: string]: any;
}

interface SettingsData {
    [key: string]: any;
}

const buildUpdateQuery = (table: string, data: SettingsData, idColumn: string, idValue: string): { query: string, values: any[] } => {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const setClause = fields
        .map((field, index) => `"${field}" = $${index + 1}`)
        .join(', ');

    const query = `UPDATE "${table}" SET ${setClause} WHERE "${idColumn}" = $${fields.length + 1}`;

    return { query, values: [...values, idValue] };
};

export const atualizarConfiguracoes = async (groupId: string, settingsData: SettingsData): Promise<boolean> => {
    const validData = Object.entries(settingsData)
        .filter(([_, value]) => value !== undefined)
        .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});

    if (Object.keys(validData).length === 0) {
        return true;
    }

    const { query, values } = buildUpdateQuery('group_settings', validData, 'group_id', groupId);
    const result = await (pool as Pool).query(query, values);
    return result.rowCount ? result.rowCount > 0 : false;
};

export const obterConfiguracoes = async (groupId: string): Promise<GroupSettings | null> => {
    const query = `
        SELECT * FROM group_settings WHERE group_id = $1;
    `;
    const { rows } = await (pool as Pool).query(query, [groupId]);
    return rows[0] || null;
};

export const obterDiretrizes = async (groupId: string): Promise<string | null> => {
    const query = `
        SELECT guidelines FROM group_settings WHERE group_id = $1;
    `;
    const { rows } = await (pool as Pool).query(query, [groupId]);
    return rows[0] ? rows[0].guidelines : null;
};

export const atualizarDiretrizes = async (groupId: string, guidelines: string): Promise<boolean> => {
    const query = `
        UPDATE group_settings 
        SET guidelines = $1
        WHERE group_id = $2;
    `;
    const values = [guidelines, groupId];
    const result = await (pool as Pool).query(query, values);
    return result.rowCount ? result.rowCount > 0 : false;
};
