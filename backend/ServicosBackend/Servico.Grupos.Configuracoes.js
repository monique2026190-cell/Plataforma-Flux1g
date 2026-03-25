
import Repositorio from '../Repositorios/Repositorio.Grupos.Configuracoes.js';
import ModeloConfig from '../models/Models.Estrutura.Configuracoes.Grupo.js';

class ServicoGruposConfiguracoes {

    /**
     * Atualiza as configurações de um grupo.
     */
    async atualizarConfiguracoes(idGrupo, dadosConfig) {
        console.log('Iniciando atualização de configurações do grupo', { event: 'ATUALIZAR_CONFIG_START', idGrupo });
        try {
            const dadosCompletos = { ...dadosConfig, idGrupo };
            const modelo = new ModeloConfig(dadosCompletos);
            const dadosValidados = modelo.toObject();

            const resultado = await Repositorio.atualizarConfiguracoes(dadosValidados);

            if (resultado.affectedRows === 0) {
                throw new Error('Nenhum grupo foi atualizado. Verifique o id do grupo.');
            }
            
            console.log('Configurações do grupo atualizadas com sucesso', { event: 'ATUALIZAR_CONFIG_SUCCESS', idGrupo });
            return { mensagem: "Configurações atualizadas com sucesso!" };

        } catch (error) {
            console.error('Erro ao atualizar configurações do grupo', { event: 'ATUALIZAR_CONFIG_ERROR', idGrupo, errorMessage: error.message });
            // Propaga o erro para ser tratado pelo controlador
            throw error;
        }
    }

    /**
     * Obtém as configurações de um grupo.
     */
    async obterConfiguracoes(idGrupo) {
        console.log('Iniciando obtenção de configurações do grupo', { event: 'OBTER_CONFIG_START', idGrupo });
        try {
            const dados = await Repositorio.obterConfiguracoes(idGrupo);
            if (!dados) {
                console.warn('Configurações do grupo não encontradas', { event: 'OBTER_CONFIG_NOT_FOUND', idGrupo });
                return null; // Ou lançar um erro de "não encontrado"
            }
            const modelo = ModeloConfig.fromObject(dados);
            console.log('Configurações do grupo obtidas com sucesso', { event: 'OBTER_CONFIG_SUCCESS', idGrupo });
            return modelo.toObject();

        } catch (error) {
            console.error('Erro ao obter configurações do grupo', { event: 'OBTER_CONFIG_ERROR', idGrupo, errorMessage: error.message });
            throw error;
        }
    }

    /**
     * Obtém as diretrizes de um grupo.
     */
    async obterDiretrizes(idGrupo) {
        console.log('Iniciando obtenção de diretrizes do grupo', { event: 'OBTER_DIRETRIZES_START', idGrupo });
        try {
            const dados = await Repositorio.obterDiretrizes(idGrupo);
            if (!dados) {
                 console.warn('Diretrizes do grupo não encontradas', { event: 'OBTER_DIRETRIZES_NOT_FOUND', idGrupo });
                return null;
            }
            console.log('Diretrizes do grupo obtidas com sucesso', { event: 'OBTER_DIRETRIZES_SUCCESS', idGrupo });
            return dados;
        } catch (error) {
            console.error('Erro ao obter diretrizes do grupo', { event: 'OBTER_DIRETRIZES_ERROR', idGrupo, errorMessage: error.message });
            throw error;
        }
    }

    /**
     * Atualiza as diretrizes de um grupo.
     */
    async atualizarDiretrizes(idGrupo, diretrizes) {
        console.log('Iniciando atualização de diretrizes do grupo', { event: 'ATUALIZAR_DIRETRIZES_START', idGrupo });
        try {
            const resultado = await Repositorio.atualizarDiretrizes(idGrupo, diretrizes);

            if (resultado.affectedRows === 0) {
                throw new Error('Nenhum grupo foi atualizado. Verifique o id do grupo.');
            }
            
            console.log('Diretrizes do grupo atualizadas com sucesso', { event: 'ATUALIZAR_DIRETRIZES_SUCCESS', idGrupo });
            return { mensagem: "Diretrizes atualizadas com sucesso!" };

        } catch (error) {
            console.error('Erro ao atualizar diretrizes do grupo', { event: 'ATUALIZAR_DIRETRIZES_ERROR', idGrupo, errorMessage: error.message });
            throw error;
        }
    }
}

export default new ServicoGruposConfiguracoes();
