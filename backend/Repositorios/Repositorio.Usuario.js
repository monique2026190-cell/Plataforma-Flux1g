
import consultasUsuario from '../database/GestaoDeDados/PostgreSQL/Consultas.Usuario.js';
import ServicoLog from '../ServicosBackend/Servico.Logs.Backend.js';

const criar = async (dadosUsuario) => {
    const contexto = "Repositorio.Usuario.criar";
    ServicoLog.info(contexto, 'Chamando camada de gestão de dados para criar usuário.', { email: dadosUsuario.email });
    try {
        const novoUsuario = await consultasUsuario.criar(dadosUsuario);
        ServicoLog.info(contexto, 'Usuário criado com sucesso na gestão de dados.', { userId: novoUsuario.id });
        return novoUsuario;
    } catch (error) {
        ServicoLog.erro(contexto, 'Erro ao criar usuário na gestão de dados', error);
        throw error;
    }
};

const encontrarPorEmail = async (email) => {
    const contexto = "Repositorio.Usuario.encontrarPorEmail";
    ServicoLog.info(contexto, 'Chamando camada de gestão de dados para buscar usuário por email.', { email });
    try {
        const usuario = await consultasUsuario.encontrarPorEmail(email);
        ServicoLog.info(contexto, usuario ? 'Usuário encontrado.' : 'Usuário não encontrado.', { email });
        return usuario;
    } catch (error) {
        ServicoLog.erro(contexto, 'Erro ao buscar usuário por email na gestão de dados', error);
        throw error;
    }
};

const encontrarPorGoogleId = async (googleId) => {
    const contexto = "Repositorio.Usuario.encontrarPorGoogleId";
    ServicoLog.info(contexto, 'Chamando camada de gestão de dados para buscar usuário por Google ID.', { googleId });
    try {
        const usuario = await consultasUsuario.encontrarPorGoogleId(googleId);
        ServicoLog.info(contexto, usuario ? 'Usuário encontrado.' : 'Usuário não encontrado.', { googleId });
        return usuario;
    } catch (error) {
        ServicoLog.erro(contexto, 'Erro ao buscar usuário por Google ID na gestão de dados', error);
        throw error;
    }
};

const atualizar = async (idUsuario, dados) => {
    const contexto = "Repositorio.Usuario.atualizar";
    ServicoLog.info(contexto, 'Chamando camada de gestão de dados para atualizar usuário.', { idUsuario });
    try {
        const usuarioAtualizado = await consultasUsuario.atualizar(idUsuario, dados);
        ServicoLog.info(contexto, 'Usuário atualizado com sucesso na gestão de dados.', { idUsuario });
        return usuarioAtualizado;
    } catch (error) {
        ServicoLog.erro(contexto, 'Erro ao atualizar usuário na gestão de dados', error);
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
