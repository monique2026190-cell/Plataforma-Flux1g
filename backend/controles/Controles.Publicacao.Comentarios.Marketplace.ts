
import { Request, Response } from 'express';
import ServicoComentariosMarketplace from '../ServicosBackend/Servicos.Publicacao.Comentarios.Marketplace.js';
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
    const { itemId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
        return httpRes.erro(res, "Usuário não autenticado", 401);
    }

    console.log('Iniciando criação de comentário no marketplace', { event: 'MARKETPLACE_COMMENT_CREATE_START', itemId, userId, body: req.body });
    try {
        const dadosParaValidar = { 
            ...req.body, 
            autorId: userId, 
            parenteId: itemId
        };
        const dadosValidados = validarCriacaoComentario.validarCriacaoComentario(dadosParaValidar);

        const comentario = await ServicoComentariosMarketplace.criarComentario(
            itemId,
            userId,
            dadosValidados.texto
        );

        console.log('Comentário no marketplace criado com sucesso', { event: 'MARKETPLACE_COMMENT_CREATE_SUCCESS', commentId: comentario.id, itemId, userId });
        httpRes.criado(res, comentario);

    } catch (error: any) {
        console.error('Erro ao criar comentário no marketplace', { 
            event: 'MARKETPLACE_COMMENT_CREATE_ERROR', 
            errorMessage: error.message,
            itemId, 
            userId, 
            data: req.body 
        });
        httpRes.erro(res, error.message, 400);
    }
};

const obterComentariosPorItemId = async (req: Request, res: Response) => {
    const { itemId } = req.params;
    console.log('Buscando comentários do marketplace', { event: 'MARKETPLACE_COMMENTS_GET_START', itemId });
    try {
        const comentarios = await ServicoComentariosMarketplace.obterComentariosPorItemId(itemId);
        console.log('Comentários do marketplace obtidos com sucesso', { event: 'MARKETPLACE_COMMENTS_GET_SUCCESS', itemId, count: comentarios.length });
        httpRes.sucesso(res, comentarios);
    } catch (error: any) {
        console.error('Erro ao buscar comentários do marketplace', { event: 'MARKETPLACE_COMMENTS_GET_ERROR', errorMessage: error.message, itemId });
        httpRes.erro(res, error.message, error.statusCode || 500);
    }
};

const atualizarComentario = async (req: AuthenticatedRequest, res: Response) => {
    const { commentId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
        return httpRes.erro(res, "Usuário não autenticado", 401);
    }

    console.log('Iniciando atualização de comentário no marketplace', { event: 'MARKETPLACE_COMMENT_UPDATE_START', commentId, userId });
    try {
        const comentarioAtualizado = await ServicoComentariosMarketplace.atualizarComentario(commentId, req.body.texto, userId);
        console.log('Comentário no marketplace atualizado com sucesso', { event: 'MARKETPLACE_COMMENT_UPDATE_SUCCESS', commentId, userId });
        httpRes.sucesso(res, comentarioAtualizado);
    } catch (error: any) {
        console.error('Erro ao atualizar comentário no marketplace', { event: 'MARKETPLACE_COMMENT_UPDATE_ERROR', errorMessage: error.message, commentId, userId, data: req.body });
        httpRes.erro(res, error.message, error.statusCode || 500);
    }
};

const deletarComentario = async (req: AuthenticatedRequest, res: Response) => {
    const { commentId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
        return httpRes.erro(res, "Usuário não autenticado", 401);
    }

    console.log('Iniciando exclusão de comentário no marketplace', { event: 'MARKETPLACE_COMMENT_DELETE_START', commentId, userId });
    try {
        await ServicoComentariosMarketplace.deletarComentario(commentId, userId);
        console.log('Comentário no marketplace excluído com sucesso', { event: 'MARKETPLACE_COMMENT_DELETE_SUCCESS', commentId, userId });
        httpRes.semConteudo(res);
    } catch (error: any) {
        console.error('Erro ao excluir comentário no marketplace', { event: 'MARKETPLACE_COMMENT_DELETE_ERROR', errorMessage: error.message, commentId, userId });
        httpRes.erro(res, error.message, error.statusCode || 500);
    }
};

export default {
    criarComentario,
    obterComentariosPorItemId,
    atualizarComentario,
    deletarComentario
};
