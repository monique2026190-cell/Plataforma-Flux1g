
import { Request, Response } from 'express';
import ServicoComentariosMarketplace from '../ServicosBackend/Servicos.Publicacao.Comentarios.Marketplace.js';
import { validarCriacaoComentario } from '../validators/Validator.Estrutura.Comentario.js';

interface AuthenticatedRequest extends Request {
    user?: { id: string };
}

const httpRes = {
    sucesso: (r: Response, dados: any, m: string = "Sucesso") => r.status(200).json({ sucesso: true, mensagem: m, dados }),
    criado: (r: Response, dados: any, m: string = "Criado com sucesso") => r.status(201).json({ sucesso: true, mensagem: m, dados }),
    erro: (r: Response, m: string = "Erro interno", s: number = 500) => r.status(s).json({ sucesso: false, mensagem: m }),
};

const criarComentario = async (req: AuthenticatedRequest, res: Response) => {
    const { itemId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
        return httpRes.erro(res, "Usuário não autenticado", 401);
    }

    console.log('Iniciando criação de comentário para item do Marketplace', { event: 'COMMENT_MARKETPLACE_CREATE_START', itemId, userId, body: req.body });

    try {
        const dadosParaValidar = { 
            texto: req.body.content,
            autorId: userId, 
            parenteId: itemId 
        };
        const dadosValidados = validarCriacaoComentario(dadosParaValidar);

        const novoComentario = await ServicoComentariosMarketplace.criarComentario(
            itemId, 
            userId, 
            dadosValidados.texto
        );
        
        console.log('Comentário de Marketplace criado com sucesso', { event: 'COMMENT_MARKETPLACE_CREATE_SUCCESS', commentId: novoComentario.id, itemId, userId });
        
        return httpRes.criado(res, novoComentario, "Comentário criado com sucesso");

    } catch (error: any) {
        console.error('Erro ao criar comentário de Marketplace', { 
            event: 'COMMENT_MARKETPLACE_CREATE_ERROR',
            errorMessage: error.message,
            itemId, 
            userId,
            data: req.body
        });

        return httpRes.erro(res, error.message, 400);
    }
};

const obterComentariosPorItemId = async (req: Request, res: Response) => {
    const { itemId } = req.params;
    console.log('Buscando comentários para item do Marketplace', { event: 'COMMENT_MARKETPLACE_GET_START', itemId });

    try {
        const comentarios = await ServicoComentariosMarketplace.obterComentariosPorItemId(itemId);

        console.log('Busca de comentários para item do Marketplace bem-sucedida', { event: 'COMMENT_MARKETPLACE_GET_SUCCESS', itemId, count: comentarios.length });

        return httpRes.sucesso(res, comentarios);
    } catch (error: any) {
        console.error('Erro ao buscar comentários de Marketplace', { event: 'COMMENT_MARKETPLACE_GET_ERROR', errorMessage: error.message, itemId });

        return httpRes.erro(res, 'Falha ao buscar comentários.', 500);
    }
};

const atualizarComentario = async (req: AuthenticatedRequest, res: Response) => {
    const { commentId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
        return httpRes.erro(res, "Usuário não autenticado", 401);
    }

    console.log('Iniciando atualização de comentário de Marketplace', { event: 'COMMENT_MARKETPLACE_UPDATE_START', commentId, userId });

    try {
        const comentarioAtualizado = await ServicoComentariosMarketplace.atualizarComentario(commentId, userId, req.body.content);
        
        console.log('Comentário de Marketplace atualizado com sucesso', { event: 'COMMENT_MARKETPLACE_UPDATE_SUCCESS', commentId, userId });
        
        return httpRes.sucesso(res, comentarioAtualizado, "Comentário atualizado com sucesso");
    } catch (error: any) {
        console.error('Erro ao atualizar comentário de Marketplace', { event: 'COMMENT_MARKETPLACE_UPDATE_ERROR', errorMessage: error.message, commentId, userId });

        return httpRes.erro(res, 'Falha ao atualizar comentário.', 500);
    }
};

const deletarComentario = async (req: AuthenticatedRequest, res: Response) => {
    const { commentId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
        return httpRes.erro(res, "Usuário não autenticado", 401);
    }

    console.log('Iniciando exclusão de comentário de Marketplace', { event: 'COMMENT_MARKETPLACE_DELETE_START', commentId, userId });

    try {
        await ServicoComentariosMarketplace.deletarComentario(commentId, userId);

        console.log('Comentário de Marketplace excluído com sucesso', { event: 'COMMENT_MARKETPLACE_DELETE_SUCCESS', commentId, userId });

        return httpRes.sucesso(res, null, "Comentário deletado com sucesso");
    } catch (error: any) {
        console.error('Erro ao excluir comentário de Marketplace', { event: 'COMMENT_MARKETPLACE_DELETE_ERROR', errorMessage: error.message, commentId, userId });
        
        return httpRes.erro(res, 'Falha ao deletar comentário.', 500);
    }
};

export default {
    criarComentario,
    obterComentariosPorItemId,
    atualizarComentario,
    deletarComentario
};
