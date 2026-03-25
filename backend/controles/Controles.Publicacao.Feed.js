
// backend/controles/Controles.Publicacao.Feed.js
import servicoPublicacaoFeed from '../ServicosBackend/Servicos.Publicacao.Feed.js';
import ServicoHTTPResposta from '../ServicosBackend/Servico.HTTP.Resposta.js';
import { validarPublicacaoFeed } from '../validators/Validator.Estrutura.Publicacao.Feed.js';

const criarPost = async (req, res) => {
    const userId = req.user.id;
    console.log('Iniciando criação de postagem no feed', { event: 'POST_CREATE_START', userId, body: req.body });
    try {
        const dadosParaValidar = { ...req.body, autorId: userId };
        const dadosValidados = validarPublicacaoFeed(dadosParaValidar);

        const post = await servicoPublicacaoFeed.criarPost(dadosValidados, req.user);
        
        console.log('Postagem no feed criada com sucesso', { event: 'POST_CREATE_SUCCESS', postId: post.id, userId });
        
        ServicoHTTPResposta.criado(res, post);

    } catch (error) {
        console.error('Erro ao criar postagem no feed', { 
            event: 'POST_CREATE_ERROR', 
            errorMessage: error.message,
            userId, 
            data: req.body 
        });
        ServicoHTTPResposta.erro(res, error.message, 400); 
    }
};

const obterTodosOsPosts = async (req, res) => {
    console.log('Iniciando obtenção de todas as postagens do feed', { event: 'POSTS_GET_ALL_START' });
    try {
        const posts = await servicoPublicacaoFeed.obterTodosOsPosts(req.query);
        console.log('Todas as postagens do feed obtidas com sucesso', { event: 'POSTS_GET_ALL_SUCCESS', count: posts.length });
        ServicoHTTPResposta.sucesso(res, posts);
    } catch (error) {
        console.error('Erro ao obter todas as postagens do feed', { event: 'POSTS_GET_ALL_ERROR', errorMessage: error.message, query: req.query });
        ServicoHTTPResposta.erro(res, error.message, error.statusCode || 500, error.message);
    }
};

const obterPostPorId = async (req, res) => {
    const { postId } = req.params;
    console.log('Iniciando obtenção de postagem do feed por ID', { event: 'POST_GET_BY_ID_START', postId });
    try {
        const post = await servicoPublicacaoFeed.obterPostPorId(postId);
        console.log('Postagem do feed obtida por ID com sucesso', { event: 'POST_GET_BY_ID_SUCCESS', postId });
        ServicoHTTPResposta.sucesso(res, post);
    } catch (error) {
        console.error('Erro ao obter postagem do feed por ID', { event: 'POST_GET_BY_ID_ERROR', errorMessage: error.message, postId });
        ServicoHTTPResposta.erro(res, error.message, error.statusCode || 404, error.message);
    }
};

const atualizarPost = async (req, res) => {
    const { postId } = req.params;
    const userId = req.user.id;
    console.log('Iniciando atualização de postagem do feed', { event: 'POST_UPDATE_START', postId, userId });
    try {
        const updatedPost = await servicoPublicacaoFeed.atualizarPost(postId, req.body, req.user);
        console.log('Postagem do feed atualizada com sucesso', { event: 'POST_UPDATE_SUCCESS', postId, userId });
        ServicoHTTPResposta.sucesso(res, updatedPost);
    } catch (error) {
        console.error('Erro ao atualizar postagem do feed', { event: 'POST_UPDATE_ERROR', errorMessage: error.message, postId, userId, data: req.body });
        ServicoHTTPResposta.erro(res, error.message, error.statusCode || 400, error.message);
    }
};

const deletarPost = async (req, res) => {
    const { postId } = req.params;
    const userId = req.user.id;
    console.log('Iniciando exclusão de postagem do feed', { event: 'POST_DELETE_START', postId, userId });
    try {
        await servicoPublicacaoFeed.deletarPost(postId, req.user);
        console.log('Postagem do feed excluída com sucesso', { event: 'POST_DELETE_SUCCESS', postId, userId });
        ServicoHTTPResposta.sucesso(res, null, "Post deletado com sucesso.");
    } catch (error) {
        console.error('Erro ao excluir postagem do feed', { event: 'POST_DELETE_ERROR', errorMessage: error.message, postId, userId });
        ServicoHTTPResposta.erro(res, error.message, error.statusCode || 403, error.message);
    }
};

export default {
    criarPost,
    obterTodosOsPosts,
    obterPostPorId,
    atualizarPost,
    deletarPost,
};
