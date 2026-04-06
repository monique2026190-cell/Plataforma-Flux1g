
import { Request, Response, NextFunction } from 'express';
import ServicoGruposConfig from '../ServicosBackend/Servico.Grupos.Configuracoes.js';

const httpRes = {
    sucesso: (r: Response, dados: any, m: string = "Sucesso") => r.status(200).json({ sucesso: true, mensagem: m, dados }),
    naoEncontrado: (r: Response, m: string = "Recurso não encontrado") => r.status(404).json({ sucesso: false, mensagem: m }),
};

const atualizarConfiguracoes = async (req: Request, res: Response, next: NextFunction) => {
    const { groupId } = req.params;
    const configuracoes = req.body;

    try {
        console.log('Atualizando configurações do grupo', { event: 'GROUP_SETTINGS_UPDATE_START', groupId, configuracoes });
        const resultado = await ServicoGruposConfig.atualizarConfiguracoes(groupId, configuracoes);
        console.log('Configurações do grupo atualizadas com sucesso', { event: 'GROUP_SETTINGS_UPDATE_SUCCESS', groupId });
        return httpRes.sucesso(res, resultado);
    } catch (error: any) {
        console.error('Falha ao atualizar configurações do grupo', { event: 'GROUP_SETTINGS_UPDATE_ERROR', errorMessage: error.message, groupId });
        next(error);
    }
};

const obterConfiguracoes = async (req: Request, res: Response, next: NextFunction) => {
    const { groupId } = req.params;
    try {
        console.log('Obtendo configurações do grupo', { event: 'GROUP_SETTINGS_GET_START', groupId });
        const resultado = await ServicoGruposConfig.obterConfiguracoes(groupId);
        if(!resultado) {
            console.warn('Configurações do grupo não encontradas', { event: 'GROUP_SETTINGS_GET_NOT_FOUND', groupId });
            return httpRes.naoEncontrado(res, "Configurações do grupo não encontradas");
        }
        console.log('Configurações do grupo obtidas com sucesso', { event: 'GROUP_SETTINGS_GET_SUCCESS', groupId });
        return httpRes.sucesso(res, resultado);
    } catch (error: any) {
        console.error('Falha ao obter configurações do grupo', { event: 'GROUP_SETTINGS_GET_ERROR', errorMessage: error.message, groupId });
        next(error);
    }
};

const obterEstatisticas = async (req: Request, res: Response, next: NextFunction) => {
    const { groupId } = req.params;
    try {
        console.log('Obtendo estatísticas do grupo', { event: 'GROUP_STATS_GET_START', groupId });
        const resultado = {};
        console.log('Estatísticas do grupo obtidas com sucesso (simulado)', { event: 'GROUP_STATS_GET_SUCCESS', groupId });
        return httpRes.sucesso(res, resultado);
    } catch (error: any) {
        console.error('Falha ao obter estatísticas do grupo', { event: 'GROUP_STATS_GET_ERROR', errorMessage: error.message, groupId });
        next(error);
    }
};

const obterDiretrizes = async (req: Request, res: Response, next: NextFunction) => {
    const { groupId } = req.params;
    try {
        console.log('Obtendo diretrizes do grupo', { event: 'GROUP_GUIDELINES_GET_START', groupId });
        const resultado = await ServicoGruposConfig.obterDiretrizes(groupId);
        if(!resultado) {
            console.warn('Diretrizes do grupo não encontradas', { event: 'GROUP_GUIDELINES_GET_NOT_FOUND', groupId });
            return httpRes.naoEncontrado(res, "Diretrizes do grupo não encontradas");
        }
        console.log('Diretrizes do grupo obtidas com sucesso', { event: 'GROUP_GUIDELINES_GET_SUCCESS', groupId });
        return httpRes.sucesso(res, resultado);
    } catch (error: any) {
        console.error('Falha ao obter diretrizes do grupo', { event: 'GROUP_GUIDELINES_GET_ERROR', errorMessage: error.message, groupId });
        next(error);
    }
};

const atualizarDiretrizes = async (req: Request, res: Response, next: NextFunction) => {
    const { groupId } = req.params;
    const { diretrizes } = req.body;

    try {
        console.log('Atualizando diretrizes do grupo', { event: 'GROUP_GUIDELINES_UPDATE_START', groupId });
        const resultado = await ServicoGruposConfig.atualizarDiretrizes(groupId, diretrizes);
        console.log('Diretrizes do grupo atualizadas com sucesso', { event: 'GROUP_GUIDELINES_UPDATE_SUCCESS', groupId });
        return httpRes.sucesso(res, resultado);
    } catch (error: any) {
        console.error('Falha ao atualizar diretrizes do grupo', { event: 'GROUP_GUIDELINES_UPDATE_ERROR', errorMessage: error.message, groupId });
        next(error);
    }
};

export default {
    atualizarConfiguracoes,
    obterConfiguracoes,
    obterEstatisticas,
    obterDiretrizes,
    atualizarDiretrizes
};
