
// backend/controles/Controles.Publicacao.Feed.js
import servicoPublicacaoFeed from '../ServicosBackend/Servicos.Publicacao.Feed.js';
import { validarPublicacaoFeed } from '../validators/Validator.Estrutura.Publicacao.Feed.js';

const httpRes = {
    sucesso: (r, dados, m = "Sucesso") => r.status(200).json({ sucesso: true, mensagem: m, dados }),
    criado: (r, dados, m = "Criado com sucesso") => r.status(201).json({ sucesso: true, mensagem: m, dados }),
    erro: (r, m = "Erro interno", s = 500) => r.status(s).json({ sucesso: false, mensagem: m }),
};

const criarPost = async (req, res) => {
    if (!req.user || !req.user.id) {
        console.error('Tentativa de criar post sem autenticação ou ID de usuário', {
            event: 'POST_CREATE_AUTH_ERROR',
            data: req.body
        });
        return httpRes.erro(res, "Autenticação necessária.", 401);
    }
    const userId = req.user.id;
    console.log('Iniciando criação de postagem no feed', { event: 'POST_CREATE_START', userId, body: req.body });
    try {
        const dadosParaValidar = { ...req.body, autorId: userId };
        const dadosValidados = validarPublicacaoFeed(dadosParaValidar);

        const post = await servicoPublicacaoFeed.criarPost(dadosValidados, req.user);
        
        console.log('Postagem no feed criada com sucesso', { event: 'POST_CREATE_SUCCESS', postId: post.id, userId });
        
        httpRes.criado(res, post);

    } catch (error) {
        console.error('Erro ao criar postagem no feed', { 
            event: 'POST_CREATE_ERROR', 
            errorMessage: error.message,
            userId, 
            data: req.body 
        });
        httpRes.erro(res, error.message, 400); 
    }
};

const obterTodosOsPosts = async (req, res) => {
    console.log('Iniciando obtenção de todas as postagens do feed', { event: 'POSTS_GET_ALL_START' });
    try {
        const posts = await servicoPublicacaoFeed.obterTodosOsPosts(req.query);
        console.log('Todas as postagens do feed obtidas com sucesso', { event: 'POSTS_GET_ALL_SUCCESS', count: posts.length });
        httpRes.sucesso(res, posts);
    } catch (error) {
        console.error('Erro ao obter todas as postagens do feed', { event: 'POSTS_GET_ALL_ERROR', errorMessage: error.message, query: req.query });
        httpRes.erro(res, error.message, error.statusCode || 500);
    }
};

const obterPostPorId = async (req, res) => {
    const { postId } = req.params;
    console.log('Iniciando obtenção de postagem do feed por ID', { event: 'POST_GET_BY_ID_START', postId });
    try {
        const post = await servicoPublicacaoFeed.obterPostPorId(postId);
        console.log('Postagem do feed obtida por ID com sucesso', { event: 'POST_GET_BY_ID_SUCCESS', postId });
        httpRes.sucesso(res, post);
    } catch (error) {
        console.error('Erro ao obter postagem do feed por ID', { event: 'POST_GET_BY_ID_ERROR', errorMessage: error.message, postId });
        httpRes.erro(res, error.message, error.statusCode || 404);
    }
};

const atualizarPost = async (req, res) => {
    const { postId } = req.params;
    const userId = req.user.id;
    console.log('Iniciando atualização de postagem do feed', { event: 'POST_UPDATE_START', postId, userId });
    try {
        const updatedPost = await servicoPublicacaoFeed.atualizarPost(postId, req.body, req.user);
        console.log('Postagem do feed atualizada com sucesso', { event: 'POST_UPDATE_SUCCESS', postId, userId });
        httpRes.sucesso(res, updatedPost);
    } catch (error) {
        console.error('Erro ao atualizar postagem do feed', { event: 'POST_UPDATE_ERROR', errorMessage: error.message, postId, userId, data: req.body });
        httpRes.erro(res, error.message, error.statusCode || 400);
    }
};

const deletarPost = async (req, res) => {
    const { postId } = req.params;
    const userId = req.user.id;
    console.log('Iniciando exclusão de postagem do feed', { event: 'POST_DELETE_START', postId, userId });
    try {
        await servicoPublicacaoFeed.deletarPost(postId, req.user);
        console.log('Postagem do feed excluída com sucesso', { event: 'POST_DELETE_SUCCESS', postId, userId });
        httpRes.sucesso(res, null, "Post deletado com sucesso.");
    } catch (error) {
        console.error('Erro ao excluir postagem do feed', { event: 'POST_DELETE_ERROR', errorMessage: error.message, postId, userId });
        httpRes.erro(res, error.message, error.statusCode || 403);
    }
};

export default {
    criarPost,
    obterTodosOsPosts,
    obterPostPorId,
    atualizarPost,
    deletarPost,
};
