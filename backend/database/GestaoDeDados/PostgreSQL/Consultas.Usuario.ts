
import { Pool, PoolClient } from 'pg';
import pool from '../../Processo.Conexao.Banco.Dados.js';
import createQueryLogger from '../../../config/Log.Queries.js';

const logger = createQueryLogger('Consultas.Usuario.ts');

interface UserProfile {
    id: string;
    name: string;
    email: string;
    password_hash?: string;
    google_id?: string;
    nickname?: string;
    bio?: string;
    website?: string;
    photo_url?: string;
    is_private: boolean;
    profile_completed: boolean;
    created_at: Date;
    updated_at: Date;
}

interface NewUserData {
    id: string;
    email: string;
    password_hash?: string;
    google_id?: string;
    nickname?: string;
    bio?: string;
    website?: string;
    photo_url?: string;
    is_private?: boolean;
    profile_completed?: boolean;
    name?: string;
}

interface UpdateUserData {
    name?: string;
    email?: string;
    nickname?: string;
    bio?: string;
    website?: string;
    photo_url?: string;
    is_private?: boolean;
    profile_completed?: boolean;
    [key: string]: any; // Allow other properties
}

const buildUpdateQuery = (tabela: string, dados: UpdateUserData, colunaId: string, idUsuario: string): { query: string; values: any[] } => {
    const fields = Object.keys(dados);
    const values = Object.values(dados);
    const setClause = [...fields.map((field, index) => `"${field}" = $${index + 1}`), `"updated_at" = NOW()`].join(', ');
    
    const query = `UPDATE ${tabela} SET ${setClause} WHERE "${colunaId}" = $${fields.length + 1}`;
    
    return { query, values: [...values, idUsuario] };
};

const criar = async (dadosUsuario: NewUserData): Promise<UserProfile> => {
    const cliente = await (pool as Pool).connect();
    const {
        id, email, password_hash, google_id,
        nickname, bio, website, photo_url, is_private, profile_completed
    } = dadosUsuario;
    const name = dadosUsuario.name || dadosUsuario.nickname;

    const query = `
        INSERT INTO user_profiles (
            id, name, email, password_hash, google_id, 
            nickname, bio, website, photo_url, is_private, profile_completed
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *;
    `;
    const values = [
        id, name, email, password_hash, google_id,
        nickname, bio, website, photo_url, is_private, profile_completed
    ];

    try {
        logger.info(`Executando INSERT para novo usuário com e-mail ${email}.`);
        const { rows } = await cliente.query(query, values);
        logger.info(`Usuário ${rows[0].id} criado com sucesso e retornado do banco de dados.`);
        return rows[0];
    } catch (error: any) {
        logger.error(`Erro ao registrar usuário com e-mail ${email} no banco de dados.`, { error });
        if (error.code === '23505') { // unique_violation
            throw new Error('Email, nickname ou ID do Google já está em uso.');
        }
        throw new Error('Erro ao registrar usuário no banco de dados');
    } finally {
        cliente.release();
    }
};

const encontrarPorId = async (id: string, cliente: Pool | PoolClient = pool as Pool): Promise<UserProfile | undefined> => {
    const query = `SELECT * FROM user_profiles WHERE id = $1`;
    logger.info(`Buscando usuário com o id: ${id}`);
    
    try {
        const { rows } = await cliente.query(query, [id]);
        return rows[0];
    } catch (error: any) {
        logger.error(`Erro ao buscar usuário por ID ${id}`, { error });
        throw new Error('Erro ao buscar usuário no banco de dados');
    }
}

const encontrarPorEmail = async (email: string): Promise<UserProfile | undefined> => {
    const query = `SELECT * FROM user_profiles WHERE email = $1`;
    logger.info(`Buscando usuário com o email: ${email}`);
    
    try {
        const { rows } = await (pool as Pool).query(query, [email]);
        return rows[0];
    } catch (error: any) {
        logger.error(`Erro ao buscar usuário por email ${email}`, { error });
        throw new Error('Erro ao buscar usuário no banco de dados');
    }
};

const encontrarPorGoogleId = async (googleId: string): Promise<UserProfile | undefined> => {
    const query = `SELECT * FROM user_profiles WHERE google_id = $1`;
    logger.info(`Buscando usuário com o Google ID: ${googleId}`);

    try {
        const { rows } = await (pool as Pool).query(query, [googleId]);
        return rows[0];
    } catch (error: any) {
        logger.error(`Erro ao buscar usuário por Google ID ${googleId}`, { error });
        throw new Error('Erro ao buscar usuário no banco de dados');
    }
};

const atualizar = async (idUsuario: string, dados: UpdateUserData): Promise<UserProfile | undefined> => {
    const cliente = await (pool as Pool).connect();

    try {
        await cliente.query('BEGIN');
        logger.info(`Iniciando transação para atualizar o usuário ${idUsuario}.`);

        if (Object.keys(dados).length > 0) {
            const { query, values } = buildUpdateQuery('user_profiles', dados, 'id', idUsuario);
            await cliente.query(query, values);
            logger.info(`Tabela 'user_profiles' atualizada para o usuário ${idUsuario}.`);
        }

        await cliente.query('COMMIT');
        logger.info(`Transação de atualização para o usuário ${idUsuario} concluída.`);
        
        return await encontrarPorId(idUsuario, cliente);

    } catch (error: any) {
        await cliente.query('ROLLBACK');
        logger.error(`Erro na transação de atualização. Rollback para o usuário ${idUsuario}.`, { error });
        throw new Error('Erro ao atualizar usuário no banco de dados');
    } finally {
        cliente.release();
    }
};

const deletar = async (id: string): Promise<boolean> => {
    const cliente = await (pool as Pool).connect();
    try {
        await cliente.query('BEGIN');
        const result = await cliente.query('DELETE FROM user_profiles WHERE id = $1', [id]);
        await cliente.query('COMMIT');
        return result.rowCount ? result.rowCount > 0 : false;
    } catch (error: any) {
        await cliente.query('ROLLBACK');
        logger.error(`Erro ao deletar usuário ${id}`, { error });
        return false;
    } finally {
        cliente.release();
    }
};

const consultasUsuario = {
    criar,
    encontrarPorEmail,
    encontrarPorGoogleId,
    encontrarPorId, 
    atualizar,
    deletar
};

export default consultasUsuario;
