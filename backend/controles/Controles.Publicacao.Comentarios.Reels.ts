
import { Request, Response } from 'express';
import ServicoComentariosReels from '../ServicosBackend/Servicos.Publicacao.Comentarios.Reels.js';
import validarCriacaoComentario from '../validators/Validator.Estrutura.Comentario.js';

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
    const { reelId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
        return httpRes.erro(res, "Usuário não autenticado", 401);
    }

    console.log('Iniciando criação de comentário no reels', { event: 'REELS_COMMENT_CREATE_START', reelId, userId, body: req.body });
    try {
        const dadosParaValidar = { 
            ...req.body, 
            autorId: userId, 
            parenteId: reelId
        };
        const dadosValidados = validarCriacaoComentario.validarCriacaoComentario(dadosParaValidar);

        const comentario = await ServicoComentariosReels.criarComentario(
            reelId,
            userId,
            dadosValidados.texto
        );

        console.log('Comentário no reels criado com sucesso', { event: 'REELS_COMMENT_CREATE_SUCCESS', commentId: comentario.id, reelId, userId });
        httpRes.criado(res, comentario);

    } catch (error: any) {
        console.error('Erro ao criar comentário no reels', { 
            event: 'REELS_COMMENT_CREATE_ERROR', 
            errorMessage: error.message,
            reelId, 
            userId, 
            data: req.body 
        });
        httpRes.erro(res, error.message, 400);
    }
};

const obterComentariosPorReelId = async (req: Request, res: Response) => {
    const { reelId } = req.params;
    console.log('Buscando comentários do reels', { event: 'REELS_COMMENTS_GET_START', reelId });
    try {
        const comentarios = await ServicoComentariosReels.obterComentariosPorReelId(reelId, req.query);
        console.log('Comentários do reels obtidos com sucesso', { event: 'REELS_COMMENTS_GET_SUCCESS', reelId, count: comentarios.length });
        httpRes.sucesso(res, comentarios);
    } catch (error: any) {
        console.error('Erro ao buscar comentários do reels', { event: 'REELS_COMMENTS_GET_ERROR', errorMessage: error.message, reelId });
        httpRes.erro(res, error.message, error.statusCode || 500);
    }
};

const atualizarComentario = async (req: AuthenticatedRequest, res: Response) => {
    const { commentId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
        return httpRes.erro(res, "Usuário não autenticado", 401);
    }

    console.log('Iniciando atualização de comentário no reels', { event: 'REELS_COMMENT_UPDATE_START', commentId, userId });
    try {
        const comentarioAtualizado = await ServicoComentariosReels.atualizarComentario(commentId, req.body.texto, userId);
        console.log('Comentário no reels atualizado com sucesso', { event: 'REELS_COMMENT_UPDATE_SUCCESS', commentId, userId });
        httpRes.sucesso(res, comentarioAtualizado);
    } catch (error: any) {
        console.error('Erro ao atualizar comentário no reels', { event: 'REELS_COMMENT_UPDATE_ERROR', errorMessage: error.message, commentId, userId, data: req.body });
        httpRes.erro(res, error.message, error.statusCode || 500);
    }
};

const deletarComentario = async (req: AuthenticatedRequest, res: Response) => {
    const { commentId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
        return httpRes.erro(res, "Usuário não autenticado", 401);
    }

    console.log('Iniciando exclusão de comentário no reels', { event: 'REELS_COMMENT_DELETE_START', commentId, userId });
    try {
        await ServicoComentariosReels.deletarComentario(commentId, userId);
        console.log('Comentário no reels excluído com sucesso', { event: 'REELS_COMMENT_DELETE_SUCCESS', commentId, userId });
        httpRes.semConteudo(res);
    } catch (error: any) {
        console.error('Erro ao excluir comentário no reels', { event: 'REELS_COMMENT_DELETE_ERROR', errorMessage: error.message, commentId, userId });
        httpRes.erro(res, error.message, error.statusCode || 500);
    }
};

export default {
    criarComentario,
    obterComentariosPorReelId,
    atualizarComentario,
    deletarComentario
};
