
import ServicoHTTPResposta from '../ServicosBackend/Servico.HTTP.Resposta.js';
import * as feedCommentMetricsService from '../ServicosBackend/Servicos.Metricas.Comentario.Feed.js';

async function trackComment(req, res) {
    const { commentData } = req.body;
    console.log('Iniciando rastreamento de métrica de comentário', { event: 'METRIC_COMMENT_TRACK_START', postId: commentData?.postId });

    try {
        await feedCommentMetricsService.trackComment(commentData);
        console.log('Métrica de comentário rastreada com sucesso', { event: 'METRIC_COMMENT_TRACK_SUCCESS', postId: commentData?.postId });
        return ServicoHTTPResposta.sucesso(res, { message: 'Metric tracked successfully' });
    } catch (error) {
        console.error('Erro ao rastrear métrica de comentário', { event: 'METRIC_COMMENT_TRACK_ERROR', errorMessage: error.message, data: commentData });
        return ServicoHTTPResposta.erro(res, 'Error tracking metric', 500, error.message);
    }
}

async function trackCommentLike(req, res) {
    const { commentId } = req.body;
    console.log('Iniciando rastreamento de curtida em comentário', { event: 'METRIC_COMMENT_LIKE_TRACK_START', commentId });

    try {
        await feedCommentMetricsService.trackCommentLike(commentId);
        console.log('Curtida em comentário rastreada com sucesso', { event: 'METRIC_COMMENT_LIKE_TRACK_SUCCESS', commentId });
        return ServicoHTTPResposta.sucesso(res, { message: 'Metric tracked successfully' });
    } catch (error) {
        console.error('Erro ao rastrear curtida em comentário', { event: 'METRIC_COMMENT_LIKE_TRACK_ERROR', errorMessage: error.message, commentId });
        return ServicoHTTPResposta.erro(res, 'Error tracking metric', 500, error.message);
    }
}

async function trackCommentReply(req, res) {
    const { commentId, replyData } = req.body;
    console.log('Iniciando rastreamento de resposta a comentário', { event: 'METRIC_COMMENT_REPLY_TRACK_START', commentId });

    try {
        await feedCommentMetricsService.trackCommentReply(commentId, replyData);
        console.log('Resposta a comentário rastreada com sucesso', { event: 'METRIC_COMMENT_REPLY_TRACK_SUCCESS', commentId });
        return ServicoHTTPResposta.sucesso(res, { message: 'Metric tracked successfully' });
    } catch (error) {
        console.error('Erro ao rastrear resposta a comentário', { event: 'METRIC_COMMENT_REPLY_TRACK_ERROR', errorMessage: error.message, commentId, data: replyData });
        return ServicoHTTPResposta.erro(res, 'Error tracking metric', 500, error.message);
    }
}

export {
    trackComment,
    trackCommentLike,
    trackCommentReply,
};
