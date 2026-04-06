
import { Request, Response } from 'express';
import ServicoComentariosFeed from '../ServicosBackend/Servicos.Publicacao.Comentarios.Feed.js';
import { validarCriacaoComentario } from '../validators/Validator.Estrutura.Comentario.js';

interface AuthenticatedRequest extends Request {
    user?: { id: string };
}

const httpRes = {
    sucesso: (r: Response, dados: any, m: string = "Sucesso") => r.status(200).json({ sucesso: true, mensagem: m, dados }),
    criado: (r: Response, dados: any, m: string = "Criado com sucesso") => r.status(201).json({ sucesso: true, mensagem: m, dados }),
    erro: (r: Response, m: string = "Erro interno", s: number = 500) => r.status(s).json({ sucesso: false, mensagem: m }),
    semConteudo: (r: Response) => r.status(204).send(),
};

const criarComentario = async (req: AuthenticatedRequest, res: Response) => {
    const { postId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
        return httpRes.erro(res, "Usuário não autenticado", 401);
    }

    console.log('Iniciando criação de comentário no feed', { event: 'COMMENT_CREATE_START', postId, userId, body: req.body });
    try {
        const dadosParaValidar = { 
            ...req.body, 
            autorId: userId, 
            parenteId: postId
        };
        const dadosValidados = validarCriacaoComentario(dadosParaValidar);

        const comentario = await ServicoComentariosFeed.criarComentario(
            { texto: dadosValidados.texto },
            postId,
            userId
        );

        console.log('Comentário no feed criado com sucesso', { event: 'COMMENT_CREATE_SUCCESS', commentId: comentario.id, postId, userId });
        httpRes.criado(res, comentario);

    } catch (error: any) {
        console.error('Erro ao criar comentário no feed', { 
            event: 'COMMENT_CREATE_ERROR', 
            errorMessage: error.message,
            postId, 
            userId, 
            data: req.body 
        });
        httpRes.erro(res, error.message, 400);
    }
};

const obterComentariosPorPostId = async (req: Request, res: Response) => {
    const { postId } = req.params;
    console.log('Buscando comentários do feed', { event: 'COMMENTS_GET_START', postId });
    try {
        const comentarios = await ServicoComentariosFeed.obterComentariosPorPostId(postId, req.query);
        console.log('Comentários do feed obtidos com sucesso', { event: 'COMMENTS_GET_SUCCESS', postId, count: comentarios.length });
        httpRes.sucesso(res, comentarios);
    } catch (error: any) {
        console.error('Erro ao buscar comentários do feed', { event: 'COMMENTS_GET_ERROR', errorMessage: error.message, postId });
        httpRes.erro(res, error.message, error.statusCode || 500);
    }
};

const atualizarComentario = async (req: AuthenticatedRequest, res: Response) => {
    const { commentId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
        return httpRes.erro(res, "Usuário não autenticado", 401);
    }

    console.log('Iniciando atualização de comentário no feed', { event: 'COMMENT_UPDATE_START', commentId, userId });
    try {
        const comentarioAtualizado = await ServicoComentariosFeed.atualizarComentario(commentId, req.body, userId);
        console.log('Comentário no feed atualizado com sucesso', { event: 'COMMENT_UPDATE_SUCCESS', commentId, userId });
        httpRes.sucesso(res, comentarioAtualizado);
    } catch (error: any) {
        console.error('Erro ao atualizar comentário no feed', { event: 'COMMENT_UPDATE_ERROR', errorMessage: error.message, commentId, userId, data: req.body });
        httpRes.erro(res, error.message, error.statusCode || 500);
    }
};

const deletarComentario = async (req: AuthenticatedRequest, res: Response) => {
    const { commentId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
        return httpRes.erro(res, "Usuário não autenticado", 401);
    }

    console.log('Iniciando exclusão de comentário no feed', { event: 'COMMENT_DELETE_START', commentId, userId });
    try {
        await ServicoComentariosFeed.deletarComentario(commentId, userId);
        console.log('Comentário no feed excluído com sucesso', { event: 'COMMENT_DELETE_SUCCESS', commentId, userId });
        httpRes.semConteudo(res);
    } catch (error: any) {
        console.error('Erro ao excluir comentário no feed', { event: 'COMMENT_DELETE_ERROR', errorMessage: error.message, commentId, userId });
        httpRes.erro(res, error.message, error.statusCode || 500);
    }
};

export default {
    criarComentario,
    obterComentariosPorPostId,
    atualizarComentario,
    deletarComentario
};
