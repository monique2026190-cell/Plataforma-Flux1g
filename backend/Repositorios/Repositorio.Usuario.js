
import consultasUsuario from '../database/GestaoDeDados/PostgreSQL/Consultas.Usuario.js';

const criar = async (dadosUsuario) => {
    console.log('Chamando camada de gestão de dados para criar usuário.', { 
        event: 'DB_CREATE_USER_START',
        email: dadosUsuario.email 
    });
    try {
        const novoUsuario = await consultasUsuario.criar(dadosUsuario);
        console.log('Usuário criado com sucesso na gestão de dados.', { 
            event: 'DB_CREATE_USER_SUCCESS',
            userId: novoUsuario.id 
        });
        return novoUsuario;
    } catch (error) {
        console.error('Erro ao criar usuário na gestão de dados', { 
            event: 'DB_CREATE_USER_ERROR',
            errorMessage: error.message,
            stack: error.stack
        });
        throw error;
    }
};

const encontrarPorEmail = async (email) => {
    console.log('Chamando camada de gestão de dados para buscar usuário por email.', { 
        event: 'DB_FIND_BY_EMAIL_START',
        email 
    });
    try {
        const usuario = await consultasUsuario.encontrarPorEmail(email);
        console.log(usuario ? 'Usuário encontrado.' : 'Usuário não encontrado.', { 
            event: usuario ? 'DB_FIND_BY_EMAIL_FOUND' : 'DB_FIND_BY_EMAIL_NOT_FOUND',
            email 
        });
        return usuario;
    } catch (error) {
        console.error('Erro ao buscar usuário por email na gestão de dados', { 
            event: 'DB_FIND_BY_EMAIL_ERROR',
            errorMessage: error.message,
            stack: error.stack
         });
        throw error;
    }
};

const encontrarPorGoogleId = async (googleId) => {
    console.log('Chamando camada de gestão de dados para buscar usuário por Google ID.', { 
        event: 'DB_FIND_BY_GOOGLE_ID_START',
        googleId 
    });
    try {
        const usuario = await consultasUsuario.encontrarPorGoogleId(googleId);
        console.log(usuario ? 'Usuário encontrado.' : 'Usuário não encontrado.', { 
            event: usuario ? 'DB_FIND_BY_GOOGLE_ID_FOUND' : 'DB_FIND_BY_GOOGLE_ID_NOT_FOUND',
            googleId 
        });
        return usuario;
    } catch (error) {
        console.error('Erro ao buscar usuário por Google ID na gestão de dados', { 
            event: 'DB_FIND_BY_GOOGLE_ID_ERROR',
            errorMessage: error.message,
            stack: error.stack
         });
        throw error;
    }
};

const atualizar = async (idUsuario, dados) => {
    console.log('Chamando camada de gestão de dados para atualizar usuário.', { 
        event: 'DB_UPDATE_USER_START',
        idUsuario 
    });
    try {
        const usuarioAtualizado = await consultasUsuario.atualizar(idUsuario, dados);
        console.log('Usuário atualizado com sucesso na gestão de dados.', { 
            event: 'DB_UPDATE_USER_SUCCESS',
            idUsuario 
        });
        return usuarioAtualizado;
    } catch (error) {
        console.error('Erro ao atualizar usuário na gestão de dados', { 
            event: 'DB_UPDATE_USER_ERROR',
            errorMessage: error.message,
            stack: error.stack
        });
        throw error;
    }
};


const repositorioUsuario = {
    criar,
    encontrarPorEmail,
    encontrarPorGoogleId,
    atualizar,
};

export default repositorioUsuario;
