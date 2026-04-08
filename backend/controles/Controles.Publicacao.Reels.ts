
import { Request, Response } from 'express';
import ServicoReels from '../ServicosBackend/Servicos.Publicacao.Reels.js';
import { validarPublicacaoReels } from '../validators/Validator.Estrutura.Publicacao.Reels.js';

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

const createReel = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
        return httpRes.erro(res, "Usuário não autenticado", 401);
    }

    console.log('Iniciando criação de reel', { event: 'REEL_CREATE_START', userId, body: req.body });
    try {
        const dadosParaValidar = { ...req.body, autorId: userId };
        const dadosValidados = validarPublicacaoReels(dadosParaValidar);

        const reel = await ServicoReels.criarReel(dadosValidados, req.user);
        
        console.log('Reel criado com sucesso', { event: 'REEL_CREATE_SUCCESS', reelId: reel.id, userId });
        
        httpRes.criado(res, reel);

    } catch (error: any) {
        console.error('Erro ao criar reel', { 
            event: 'REEL_CREATE_ERROR', 
            errorMessage: error.message, 
            userId, 
            data: req.body 
        });
        httpRes.erro(res, error.message, 400);
    }
};

const getAllReels = async (req: Request, res: Response) => {
    console.log('Iniciando obtenção de todos os reels', { event: 'REELS_GET_ALL_START' });
    try {
        const reels = await ServicoReels.obterTodosOsReels(req.query);
        console.log('Todos os reels obtidos com sucesso', { event: 'REELS_GET_ALL_SUCCESS', count: reels.length });
        httpRes.sucesso(res, reels);
    } catch (error: any) {
        console.error('Erro ao obter todos os reels', { event: 'REELS_GET_ALL_ERROR', errorMessage: error.message });
        httpRes.erro(res, error.message, 500);
    }
};

const getReelById = async (req: Request, res: Response) => {
    const { reelId } = req.params;
    console.log('Iniciando obtenção de reel por ID', { event: 'REEL_GET_BY_ID_START', reelId });
    try {
        const reel = await ServicoReels.obterReelPorId(reelId);
        if (!reel) {
            console.warn('Reel não encontrado', { event: 'REEL_GET_BY_ID_NOT_FOUND', reelId });
            return httpRes.naoEncontrado(res, 'Reel não encontrado.');
        }
        console.log('Reel obtido por ID com sucesso', { event: 'REEL_GET_BY_ID_SUCCESS', reelId });
        httpRes.sucesso(res, reel);
    } catch (error: any) {
        console.error('Erro ao obter reel por ID', { event: 'REEL_GET_BY_ID_ERROR', errorMessage: error.message, reelId });
        httpRes.erro(res, error.message, 500);
    }
};

const updateReel = async (req: AuthenticatedRequest, res: Response) => {
    const { reelId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
        return httpRes.erro(res, "Usuário não autenticado", 401);
    }

    console.log('Iniciando atualização de reel', { event: 'REEL_UPDATE_START', reelId, userId });
    try {
        const updatedReel = await ServicoReels.atualizarReel(reelId, req.body, req.user);
        console.log('Reel atualizado com sucesso', { event: 'REEL_UPDATE_SUCCESS', reelId, userId });
        httpRes.sucesso(res, updatedReel);
    } catch (error: any) {
        console.error('Erro ao atualizar reel', { event: 'REEL_UPDATE_ERROR', errorMessage: error.message, reelId, userId, data: req.body });
        httpRes.erro(res, error.message, 400);
    }
};

const deleteReel = async (req: AuthenticatedRequest, res: Response) => {
    const { reelId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
        return httpRes.erro(res, "Usuário não autenticado", 401);
    }

    console.log('Iniciando exclusão de reel', { event: 'REEL_DELETE_START', reelId, userId });
    try {
        await ServicoReels.deletarReel(reelId, req.user);
        console.log('Reel excluído com sucesso', { event: 'REEL_DELETE_SUCCESS', reelId, userId });
        httpRes.semConteudo(res);
    } catch (error: any) {
        console.error('Erro ao excluir reel', { event: 'REEL_DELETE_ERROR', errorMessage: error.message, reelId, userId });
        httpRes.erro(res, error.message, 400);
    }
};

export default {
    createReel,
    getAllReels,
    getReelById,
    updateReel,
    deleteReel
};
