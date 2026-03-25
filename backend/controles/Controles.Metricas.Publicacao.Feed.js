
// backend/controles/Controles.Metricas.Publicacao.Feed.js
import ServicoHTTPResposta from '../ServicosBackend/Servico.HTTP.Resposta.js';
import { getPostMetrics as getPostMetricsService } from '../ServicosBackend/Servicos.Metricas.Publicacao.Feed.js';

export const getPostMetrics = async (req, res, next) => {
    const { postId } = req.params;
    console.log('Iniciando obtenção de métricas de postagem do feed', { event: 'METRIC_POST_GET_START', postId });

    try {
        const metrics = await getPostMetricsService(postId);
        console.log('Métricas de postagem do feed obtidas com sucesso', { event: 'METRIC_POST_GET_SUCCESS', postId });
        return ServicoHTTPResposta.sucesso(res, metrics);
    } catch (error) {
        console.error('Erro ao obter métricas de postagem do feed', { event: 'METRIC_POST_GET_ERROR', errorMessage: error.message, postId });
        return ServicoHTTPResposta.erro(res, 'Failed to fetch post metrics', 500, error.message);
    }
};
