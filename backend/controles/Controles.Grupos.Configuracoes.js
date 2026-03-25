
// backend/controles/Controles.Grupos.Configuracoes.js
import ServicoHTTPResposta from '../ServicosBackend/Servico.HTTP.Resposta.js';
import ServicoGruposConfig from '../ServicosBackend/Servico.Grupos.Configuracoes.js';

class GruposConfiguracoesControle {

    async atualizarConfiguracoes(req, res) {
        const { groupId } = req.params;
        const configuracoes = req.body;

        try {
            console.log('Atualizando configurações do grupo', { event: 'GROUP_SETTINGS_UPDATE_START', groupId, configuracoes });
            const resultado = await ServicoGruposConfig.atualizarConfiguracoes(groupId, configuracoes);
            console.log('Configurações do grupo atualizadas com sucesso', { event: 'GROUP_SETTINGS_UPDATE_SUCCESS', groupId });
            return ServicoHTTPResposta.sucesso(res, resultado);
        } catch (error) {
            console.error('Falha ao atualizar configurações do grupo', { event: 'GROUP_SETTINGS_UPDATE_ERROR', errorMessage: error.message, groupId });
            return ServicoHTTPResposta.erro(res, 'Falha ao atualizar configurações do grupo.', 500, error.message);
        }
    }

    async obterConfiguracoes(req, res) {
        const { groupId } = req.params;
        try {
            console.log('Obtendo configurações do grupo', { event: 'GROUP_SETTINGS_GET_START', groupId });
            const resultado = await ServicoGruposConfig.obterConfiguracoes(groupId);
            if(!resultado) {
                console.warn('Configurações do grupo não encontradas', { event: 'GROUP_SETTINGS_GET_NOT_FOUND', groupId });
                return ServicoHTTPResposta.naoEncontrado(res, "Configurações do grupo não encontradas");
            }
            console.log('Configurações do grupo obtidas com sucesso', { event: 'GROUP_SETTINGS_GET_SUCCESS', groupId });
            return ServicoHTTPResposta.sucesso(res, resultado);
        } catch (error) {
            console.error('Falha ao obter configurações do grupo', { event: 'GROUP_SETTINGS_GET_ERROR', errorMessage: error.message, groupId });
            return ServicoHTTPResposta.erro(res, 'Falha ao obter configurações do grupo.', 500, error.message);
        }
    }
    
    async obterEstatisticas(req, res) {
        const { groupId } = req.params;
        try {
            console.log('Obtendo estatísticas do grupo', { event: 'GROUP_STATS_GET_START', groupId });
            // Simulação de implementação futura
            const resultado = {};
            console.log('Estatísticas do grupo obtidas com sucesso (simulado)', { event: 'GROUP_STATS_GET_SUCCESS', groupId });
            return ServicoHTTPResposta.sucesso(res, resultado);
        } catch (error) {
            console.error('Falha ao obter estatísticas do grupo', { event: 'GROUP_STATS_GET_ERROR', errorMessage: error.message, groupId });
            return ServicoHTTPResposta.erro(res, 'Falha ao obter estatísticas do grupo.', 500, error.message);
        }
    }

    async obterDiretrizes(req, res) {
        const { groupId } = req.params;
        try {
            console.log('Obtendo diretrizes do grupo', { event: 'GROUP_GUIDELINES_GET_START', groupId });
            const resultado = await ServicoGruposConfig.obterDiretrizes(groupId);
            if(!resultado) {
                console.warn('Diretrizes do grupo não encontradas', { event: 'GROUP_GUIDELINES_GET_NOT_FOUND', groupId });
                return ServicoHTTPResposta.naoEncontrado(res, "Diretrizes do grupo não encontradas");
            }
            console.log('Diretrizes do grupo obtidas com sucesso', { event: 'GROUP_GUIDELINES_GET_SUCCESS', groupId });
            return ServicoHTTPResposta.sucesso(res, resultado);
        } catch (error) {
            console.error('Falha ao obter diretrizes do grupo', { event: 'GROUP_GUIDELINES_GET_ERROR', errorMessage: error.message, groupId });
            return ServicoHTTPResposta.erro(res, 'Falha ao obter diretrizes do grupo.', 500, error.message);
        }
    }

    async atualizarDiretrizes(req, res) {
        const { groupId } = req.params;
        const { diretrizes } = req.body;

        try {
            console.log('Atualizando diretrizes do grupo', { event: 'GROUP_GUIDELINES_UPDATE_START', groupId });
            const resultado = await ServicoGruposConfig.atualizarDiretrizes(groupId, diretrizes);
            console.log('Diretrizes do grupo atualizadas com sucesso', { event: 'GROUP_GUIDELINES_UPDATE_SUCCESS', groupId });
            return ServicoHTTPResposta.sucesso(res, resultado);
        } catch (error) {
            console.error('Falha ao atualizar diretrizes do grupo', { event: 'GROUP_GUIDELINES_UPDATE_ERROR', errorMessage: error.message, groupId });
            return ServicoHTTPResposta.erro(res, 'Falha ao atualizar diretrizes do grupo.', 500, error.message);
        }
    }

}

export default new GruposConfiguracoesControle();
