
import consultasSessao from '../database/GestaoDeDados/PostgreSQL/Consultas.Sessao.js';

const criar = async (dadosSessao) => {
    console.log('Chamando camada de gestão de dados para criar sessão.', { event: 'DB_CREATE_SESSION_START' });
    try {
        const novaSessao = await consultasSessao.criar(dadosSessao);
        console.log('Sessão criada com sucesso na gestão de dados.', { event: 'DB_CREATE_SESSION_SUCCESS' });
        return novaSessao;
    } catch (error) {
        console.error('Erro ao criar sessão na gestão de dados', { 
            event: 'DB_CREATE_SESSION_ERROR',
            errorMessage: error.message,
            stack: error.stack
        });
        throw error;
    }
};

const encontrarPorToken = async (token) => {
    console.log('Chamando camada de gestão de dados para buscar sessão por token.', { event: 'DB_FIND_SESSION_BY_TOKEN_START' });
    try {
        const sessao = await consultasSessao.encontrarPorToken(token);
        console.log(sessao ? 'Sessão encontrada.' : 'Sessão não encontrada.', { 
            event: sessao ? 'DB_FIND_SESSION_BY_TOKEN_FOUND' : 'DB_FIND_SESSION_BY_TOKEN_NOT_FOUND'
        });
        return sessao;
    } catch (error) {
        console.error('Erro ao buscar sessão por token na gestão de dados', { 
            event: 'DB_FIND_SESSION_BY_TOKEN_ERROR',
            errorMessage: error.message,
            stack: error.stack
        });
        throw error;
    }
};

const deletarPorToken = async (token) => {
    console.log('Chamando camada de gestão de dados para deletar sessão por token.', { event: 'DB_DELETE_SESSION_BY_TOKEN_START' });
    try {
        const sessaoDeletada = await consultasSessao.deletarPorToken(token);
        console.log(sessaoDeletada ? 'Sessão deletada com sucesso.' : 'Sessão não encontrada para deleção.', { 
            event: sessaoDeletada ? 'DB_DELETE_SESSION_SUCCESS' : 'DB_DELETE_SESSION_NOT_FOUND'
        });
        return sessaoDeletada;
    } catch (error) {
        console.error('Erro ao deletar sessão por token na gestão de dados', { 
            event: 'DB_DELETE_SESSION_ERROR',
            errorMessage: error.message,
            stack: error.stack
         });
        throw error;
    }
};


const repositorioSessao = {
    criar,
    encontrarPorToken,
    deletarPorToken
};

export default repositorioSessao;
