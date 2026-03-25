
// backend/controles/Controles.Publicacao.Comentarios.Feed.js
import ServicoComentariosFeed from '../ServicosBackend/Servicos.Publicacao.Comentarios.Feed.js';
import ServicoHTTPResposta from '../ServicosBackend/Servico.HTTP.Resposta.js';
import { validarCriacaoComentario } from '../validators/Validator.Estrutura.Comentario.js';

const criarComentario = async (req, res) => {
    const { postId } = req.params;
    const userId = req.user.id;
    console.log('Iniciando criação de comentário no feed', { event: 'COMMENT_CREATE_START', postId, userId, body: req.body });
    try {
        // 1. Validar a entrada
        const dadosParaValidar = { 
            ...req.body, 
            autorId: userId, 
            parenteId: postId
        };
        const dadosValidados = validarCriacaoComentario(dadosParaValidar);

        // 2. Chamar o serviço com os dados validados
        const comentario = await ServicoComentariosFeed.criarComentario(
            { texto: dadosValidados.texto },
            postId,
            userId
        );

        console.log('Comentário no feed criado com sucesso', { event: 'COMMENT_CREATE_SUCCESS', commentId: comentario.id, postId, userId });
        
        // 3. Enviar a resposta
        ServicoHTTPResposta.criado(res, comentario);

    } catch (error) {
        console.error('Erro ao criar comentário no feed', { 
            event: 'COMMENT_CREATE_ERROR', 
            errorMessage: error.message,
            postId, 
            userId, 
            data: req.body 
        });
        ServicoHTTPResposta.erro(res, error.message, 400);
    }
};

const obterComentariosPorPostId = async (req, res) => {
    const { postId } = req.params;
    console.log('Buscando comentários do feed', { event: 'COMMENTS_GET_START', postId });
    try {
        const comentarios = await ServicoComentariosFeed.obterComentariosPorPostId(postId, req.query);
        console.log('Comentários do feed obtidos com sucesso', { event: 'COMMENTS_GET_SUCCESS', postId, count: comentarios.length });
        ServicoHTTPResposta.sucesso(res, comentarios);
    } catch (error) {
        console.error('Erro ao buscar comentários do feed', { event: 'COMMENTS_GET_ERROR', errorMessage: error.message, postId });
        ServicoHTTPResposta.erro(res, error.message, error.statusCode || 500, error.message);
    }
};

const atualizarComentario = async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user.id;
    console.log('Iniciando atualização de comentário no feed', { event: 'COMMENT_UPDATE_START', commentId, userId });
    try {
        const comentarioAtualizado = await ServicoComentariosFeed.atualizarComentario(commentId, req.body, userId);
        console.log('Comentário no feed atualizado com sucesso', { event: 'COMMENT_UPDATE_SUCCESS', commentId, userId });
        ServicoHTTPResposta.sucesso(res, comentarioAtualizado);
    } catch (error) {
        console.error('Erro ao atualizar comentário no feed', { event: 'COMMENT_UPDATE_ERROR', errorMessage: error.message, commentId, userId, data: req.body });
        ServicoHTTPResposta.erro(res, error.message, error.statusCode || 500, error.message);
    }
};

const deletarComentario = async (req, res) => {
    const { commentId } = req.params;
    const userId = req.user.id;
    console.log('Iniciando exclusão de comentário no feed', { event: 'COMMENT_DELETE_START', commentId, userId });
    try {
        await ServicoComentariosFeed.deletarComentario(commentId, userId);
        console.log('Comentário no feed excluído com sucesso', { event: 'COMMENT_DELETE_SUCCESS', commentId, userId });
        ServicoHTTPResposta.semConteudo(res);
    } catch (error) {
        console.error('Erro ao excluir comentário no feed', { event: 'COMMENT_DELETE_ERROR', errorMessage: error.message, commentId, userId });
        ServicoHTTPResposta.erro(res, error.message, error.statusCode || 500, error.message);
    }
};

export default {
    criarComentario,
    obterComentariosPorPostId,
    atualizarComentario,
    deletarComentario
};
