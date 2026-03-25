
// backend/controles/Controle.Usuario.js
import servicoUsuario from '../ServicosBackend/Servico.Usuario.js';
import ServicoResposta from '../ServicosBackend/Servico.HTTP.Resposta.js';
import validadorUsuario from '../validators/Validator.Estrutura.Usuario.js';

const atualizarPerfil = async (req, res, next) => {
    const idUsuario = req.user.id;

    try {
        const dadosValidados = validadorUsuario.validarAtualizacaoPerfil(req.body);
        console.log('Iniciando atualização de perfil', { event: 'INICIANDO_ATUALIZACAO_PERFIL', userId: idUsuario });

        const usuarioAtualizado = await servicoUsuario.atualizarPerfilUsuario(idUsuario, dadosValidados);

        console.log('Perfil atualizado com sucesso', { event: 'PERFIL_ATUALIZADO_SUCESSO', userId: idUsuario });

        return ServicoResposta.sucesso(res, { user: usuarioAtualizado.paraRespostaHttp() });

    } catch (error) {
        console.error('Falha na atualização de perfil', { event: 'FALHA_ATUALIZACAO_PERFIL', userId: idUsuario, errorMessage: error.message });
        next(error);
    }
};

const obterPerfil = async (req, res, next) => {
    const idUsuario = req.params.id;

    try {
        console.log('Buscando perfil de usuário', { event: 'BUSCANDO_PERFIL_USUARIO', userId: idUsuario });

        const usuario = await servicoUsuario.encontrarUsuarioPorId(idUsuario);

        if (!usuario) {
            return ServicoResposta.naoEncontrado(res, "Usuário não encontrado");
        }

        return ServicoResposta.sucesso(res, { user: usuario.paraRespostaHttp() });

    } catch (error) {
        console.error('Falha ao buscar perfil', { event: 'FALHA_BUSCAR_PERFIL', userId: idUsuario, errorMessage: error.message });
        next(error);
    }
}

export default {
    atualizarPerfil,
    obterPerfil
};
