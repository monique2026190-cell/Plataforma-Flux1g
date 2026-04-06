
import { Request, Response } from 'express';
import ServicoMarketplace from '../ServicosBackend/Servicos.Publicacao.Marketplace.js';
import { validarItemMarketplace } from '../validators/Validator.Estrutura.Publicacao.Marketplace.js';

interface AuthenticatedRequest extends Request {
    user?: { id: string };
}

const httpRes = {
    sucesso: (r: Response, dados: any, m: string = "Sucesso") => r.status(200).json({ sucesso: true, mensagem: m, dados }),
    criado: (r: Response, dados: any, m: string = "Criado com sucesso") => r.status(201).json({ sucesso: true, mensagem: m, dados }),
    erro: (r: Response, m: string = "Erro interno", s: number = 500) => r.status(s).json({ sucesso: false, mensagem: m }),
    naoEncontrado: (r: Response, m: string = "Recurso não encontrado") => r.status(404).json({ sucesso: false, mensagem: m }),
    semConteudo: (r: Response) => r.status(204).send(),
};

const criarItem = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
        return httpRes.erro(res, "Usuário não autenticado", 401);
    }

    console.log('Iniciando criação de item no marketplace', { event: 'ITEM_CREATE_START', userId, body: req.body });
    try {
        const dadosParaValidar = { ...req.body, autorId: userId };
        const dadosValidados = validarItemMarketplace(dadosParaValidar);

        const item = await ServicoMarketplace.criarItem(dadosValidados, req.user);

        console.log('Item do marketplace criado com sucesso', { event: 'ITEM_CREATE_SUCCESS', itemId: item.id, userId });
        
        httpRes.criado(res, item);

    } catch (error: any) {
        console.error('Erro ao criar item no marketplace', { 
            event: 'ITEM_CREATE_ERROR', 
            errorMessage: error.message, 
            userId, 
            data: req.body 
        });
        httpRes.erro(res, error.message, 400);
    }
};

const obterTodosItens = async (req: Request, res: Response) => {
    console.log('Iniciando obtenção de todos os itens do marketplace', { event: 'ITEMS_GET_ALL_START' });
    try {
        const items = await ServicoMarketplace.obterTodosItens(req.query);
        console.log('Itens do marketplace obtidos com sucesso', { event: 'ITEMS_GET_ALL_SUCCESS', count: items.length });
        httpRes.sucesso(res, items);
    } catch (error: any) {
        console.error('Erro ao obter itens do marketplace', { event: 'ITEMS_GET_ALL_ERROR', errorMessage: error.message });
        httpRes.erro(res, error.message, 500);
    }
};

const obterItemPorId = async (req: Request, res: Response) => {
    const { itemId } = req.params;
    console.log('Iniciando obtenção de item do marketplace por ID', { event: 'ITEM_GET_BY_ID_START', itemId });
    try {
        const item = await ServicoMarketplace.obterItemPorId(itemId);
        if (!item) {
            console.warn('Item do marketplace não encontrado', { event: 'ITEM_GET_BY_ID_NOT_FOUND', itemId });
            return httpRes.naoEncontrado(res, 'Item não encontrado.');
        }
        console.log('Item do marketplace obtido com sucesso por ID', { event: 'ITEM_GET_BY_ID_SUCCESS', itemId });
        httpRes.sucesso(res, item);
    } catch (error: any) {
        console.error('Erro ao obter item do marketplace por ID', { event: 'ITEM_GET_BY_ID_ERROR', errorMessage: error.message, itemId });
        httpRes.erro(res, error.message, 500);
    }
};

const atualizarItem = async (req: AuthenticatedRequest, res: Response) => {
    const { itemId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
        return httpRes.erro(res, "Usuário não autenticado", 401);
    }

    console.log('Iniciando atualização de item no marketplace', { event: 'ITEM_UPDATE_START', itemId, userId });
    try {
        const updatedItem = await ServicoMarketplace.atualizarItem(itemId, req.body, userId);
        console.log('Item do marketplace atualizado com sucesso', { event: 'ITEM_UPDATE_SUCCESS', itemId, userId });
        httpRes.sucesso(res, updatedItem);
    } catch (error: any) {
        console.error('Erro ao atualizar item no marketplace', { event: 'ITEM_UPDATE_ERROR', errorMessage: error.message, itemId, userId, data: req.body });
        httpRes.erro(res, error.message, 400);
    }
};

const deletarItem = async (req: AuthenticatedRequest, res: Response) => {
    const { itemId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
        return httpRes.erro(res, "Usuário não autenticado", 401);
    }

    console.log('Iniciando exclusão de item do marketplace', { event: 'ITEM_DELETE_START', itemId, userId });
    try {
        await ServicoMarketplace.deletarItem(itemId, userId);
        console.log('Item do marketplace excluído com sucesso', { event: 'ITEM_DELETE_SUCCESS', itemId, userId });
        httpRes.semConteudo(res);
    } catch (error: any) {
        console.error('Erro ao excluir item do marketplace', { event: 'ITEM_DELETE_ERROR', errorMessage: error.message, itemId, userId });
        httpRes.erro(res, error.message, 400);
    }
};

export default {
    criarItem,
    obterTodosItens,
    obterItemPorId,
    atualizarItem,
    deletarItem
};
