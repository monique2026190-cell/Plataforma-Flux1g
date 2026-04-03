
import servicoUsuario from '../ServicosBackend/Servico.Usuario.js';
import validadorUsuario from '../validators/Validator.Estrutura.Usuario.js';
import createControllerLogger from '../config/Log.Controles.js';

const logger = createControllerLogger('Controle.Usuario.js');

const httpRes = {
    sucesso: (r, dados, m = "Sucesso") => r.status(200).json({ sucesso: true, mensagem: m, dados }),
    criado: (r, dados, m = "Criado com sucesso") => r.status(201).json({ sucesso: true, mensagem: m, dados }),
    naoEncontrado: (r, m = "Recurso não encontrado") => r.status(404).json({ sucesso: false, mensagem: m }),
};

const completarPerfil = async (req, res, next) => {
    const { idUsuario, apelido, nome, bio, tipoDeConta } = req.body;
    const avatar = req.file;

    logger.info(`Iniciando processo de completar perfil para o usuário ${idUsuario}.`, { userId: idUsuario });

    try {
        const dadosPerfil = { apelido, nome, bio, tipoDeConta };
        // TODO: Adicionar validação para os dados do perfil
        const usuarioAtualizado = await servicoUsuario.completarPerfil(idUsuario, dadosPerfil, avatar);

        logger.info(`Perfil do usuário ${idUsuario} completado com sucesso.`, { userId: idUsuario });
        return httpRes.sucesso(res, { user: usuarioAtualizado.paraRespostaHttp() }, "Perfil completado com sucesso.");

    } catch (error) {
        logger.error(`Erro ao completar o perfil do usuário ${idUsuario}:`, { userId: idUsuario, error });
        next(error);
    }
};

const atualizarPerfil = async (req, res, next) => {
    const idUsuario = req.user.id;
    logger.info(`Iniciando atualização de perfil para o usuário ${idUsuario}.`, { userId: idUsuario, body: req.body });

    try {
        const dadosValidados = validadorUsuario.validarAtualizacaoPerfil(req.body);
        const usuarioAtualizado = await servicoUsuario.atualizarPerfilUsuario(idUsuario, dadosValidados);

        logger.info(`Perfil do usuário ${idUsuario} atualizado com sucesso.`, { userId: idUsuario });
        return httpRes.sucesso(res, { user: usuarioAtualizado.paraRespostaHttp() });

    } catch (error) {
        logger.error(`Erro ao atualizar o perfil do usuário ${idUsuario}:`, { userId: idUsuario, error });
        next(error);
    }
};

const obterPerfil = async (req, res, next) => {
    const idUsuario = req.params.id;
    logger.info(`Buscando perfil do usuário ${idUsuario}.`, { userId: idUsuario });

    try {
        const usuario = await servicoUsuario.encontrarUsuarioPorId(idUsuario);

        if (!usuario) {
            logger.warn(`Usuário com ID ${idUsuario} não encontrado.`, { userId: idUsuario });
            return httpRes.naoEncontrado(res, "Usuário não encontrado");
        }

        logger.info(`Perfil do usuário ${idUsuario} encontrado com sucesso.`, { userId: idUsuario });
        return httpRes.sucesso(res, { user: usuario.paraRespostaHttp() });

    } catch (error) {
        logger.error(`Erro ao buscar o perfil do usuário ${idUsuario}:`, { userId: idUsuario, error });
        next(error);
    }
}

export default {
    completarPerfil,
    atualizarPerfil,
    obterPerfil
};
