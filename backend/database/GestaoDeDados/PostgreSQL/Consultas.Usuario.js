
import pool from '../../Processo.Conexao.Banco.Dados.js';

// Função criar refatorada para inserir todos os dados na tabela 'users'
const criar = async (dadosUsuario) => {
    const cliente = await pool.connect();
    
    // Todas as colunas estão na tabela 'users'
    const { 
        id, name, email, password_hash, google_id, 
        nickname, bio, website, photo_url, is_private, profile_completed 
    } = dadosUsuario;

    // Apenas uma query para inserir tudo em 'users'
    const query = `
        INSERT INTO users (
            id, name, email, password_hash, google_id, 
            nickname, bio, website, photo_url, is_private, profile_completed
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING id;
    `;
    const values = [
        id, name, email, password_hash, google_id, 
        nickname, bio, website, photo_url, is_private, profile_completed
    ];

    try {
        await cliente.query('BEGIN');
        console.log('Iniciando transação para criar novo usuário.', { event: 'DB_TX_CREATE_USER_BEGIN', email });

        await cliente.query(query, values);
        console.log('Inserido na tabela users.', { event: 'DB_TX_CREATE_USER_INSERT_USERS', userId: id });

        await cliente.query('COMMIT');
        console.log('Transação concluída. Usuário criado com sucesso.', { event: 'DB_TX_CREATE_USER_COMMIT', userId: id });

        // Após criar, busca o usuário completo para retornar
        return await encontrarPorId(id, cliente); 

    } catch (error) {
        await cliente.query('ROLLBACK');
        console.error('Erro na transação de criação de usuário. Rollback executado.', {
            event: 'DB_TX_CREATE_USER_ROLLBACK',
            errorMessage: error.message,
            stack: error.stack,
            errorCode: error.code
        });
        if (error.code === '23505') { // unique_violation
            throw new Error('Email, nickname ou ID do Google já está em uso.');
        }
        throw new Error('Erro ao registrar usuário no banco de dados');
    } finally {
        cliente.release();
    }
};

// queryJoin removida, queries de busca simplificadas
const encontrarPorId = async (id, cliente = pool) => {
    const query = `SELECT * FROM users WHERE id = $1`;
    console.log(`Buscando usuário com o id: ${id}`, { event: 'DB_FIND_USER_BY_ID_START' });
    
    try {
        const { rows } = await cliente.query(query, [id]);
        return rows[0];
    } catch (error) {
        console.error('Erro ao buscar usuário por ID', {
            event: 'DB_FIND_USER_BY_ID_ERROR',
            errorMessage: error.message,
            stack: error.stack,
            userId: id
        });
        throw new Error('Erro ao buscar usuário no banco de dados');
    }
}

const encontrarPorEmail = async (email) => {
    const query = `SELECT * FROM users WHERE email = $1`;
    console.log(`Buscando usuário com o email: ${email}`, { event: 'DB_FIND_USER_BY_EMAIL_START' });
    
    try {
        const { rows } = await pool.query(query, [email]);
        return rows[0];
    } catch (error) {
        console.error('Erro ao buscar usuário por email', {
            event: 'DB_FIND_USER_BY_EMAIL_ERROR',
            errorMessage: error.message,
            stack: error.stack,
            email
        });
        throw new Error('Erro ao buscar usuário no banco de dados');
    }
};

const encontrarPorGoogleId = async (googleId) => {
    const query = `SELECT * FROM users WHERE google_id = $1`;
    console.log(`Buscando usuário com o Google ID: ${googleId}`, { event: 'DB_FIND_USER_BY_GOOGLE_ID_START' });

    try {
        const { rows } = await pool.query(query, [googleId]);
        return rows[0];
    } catch (error) {
        console.error('Erro ao buscar usuário por Google ID', {
            event: 'DB_FIND_USER_BY_GOOGLE_ID_ERROR',
            errorMessage: error.message,
            stack: error.stack,
            googleId
        });
        throw new Error('Erro ao buscar usuário no banco de dados');
    }
};

// Função de atualização simplificada para usar apenas a tabela 'users'
const atualizar = async (idUsuario, dados) => {
    const cliente = await pool.connect();

    try {
        await cliente.query('BEGIN');
        console.log(`Iniciando transação para atualizar o usuário ${idUsuario}.`, { event: 'DB_TX_UPDATE_USER_BEGIN' });

        if (Object.keys(dados).length > 0) {
            const { query, values } = buildUpdateQuery('users', dados, 'id', idUsuario);
            await cliente.query(query, values);
            console.log("Tabela 'users' atualizada.", { event: 'DB_TX_UPDATE_USER_USERS_UPDATED', userId: idUsuario });
        }

        await cliente.query('COMMIT');
        console.log(`Transação de atualização para o usuário ${idUsuario} concluída.`, { event: 'DB_TX_UPDATE_USER_COMMIT' });
        
        return await encontrarPorId(idUsuario, cliente);

    } catch (error) {
        await cliente.query('ROLLBACK');
        console.error(`Erro na transação de atualização. Rollback para o usuário ${idUsuario}.`, {
            event: 'DB_TX_UPDATE_USER_ROLLBACK',
            errorMessage: error.message,
            stack: error.stack,
            userId: idUsuario
        });
        throw new Error('Erro ao atualizar usuário no banco de dados');
    } finally {
        cliente.release();
    }
};

// Função deletar simplificada para remover apenas da tabela 'users'
const deletar = async (id) => {
    const cliente = await pool.connect();
    try {
        await cliente.query('BEGIN');
        await cliente.query('DELETE FROM users WHERE id = $1', [id]);
        await cliente.query('COMMIT');
        return true;
    } catch (error) {
        await cliente.query('ROLLBACK');
        console.error('Erro ao deletar usuário', { 
            errorMessage: error.message,
            stack: error.stack,
            userId: id 
        });
        return false;
    } finally {
        cliente.release();
    }
};

const buildUpdateQuery = (tabela, dados, colunaId, idUsuario) => {
    const fields = Object.keys(dados);
    const values = Object.values(dados);
    // Adiciona o timestamp de atualização
    const setClause = [...fields.map((field, index) => `"${field}" = $${index + 1}`), `"updated_at" = NOW()`].join(', ');
    
    const query = `UPDATE ${tabela} SET ${setClause} WHERE "${colunaId}" = $${fields.length + 1}`;
    
    return { query, values: [...values, idUsuario] };
};

const consultasUsuario = {
    criar,
    encontrarPorEmail,
    encontrarPorGoogleId,
    encontrarPorId, // Adicionado para exportar
    atualizar,
    deletar
};

export default consultasUsuario;
