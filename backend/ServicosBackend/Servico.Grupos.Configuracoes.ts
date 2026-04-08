
import Repositorio from '../Repositorios/Repositorio.Grupos.Configuracoes.js';
import ModeloConfig from '../models/Models.Estrutura.Configuracoes.Grupo.js';

class ServicoGruposConfiguracoes {

    /**
     * Atualiza as configurações de um grupo.
     */
    async atualizarConfiguracoes(idGrupo: any, dadosConfig: any) {
        console.log('Iniciando atualização de configurações do grupo', { event: 'ATUALIZAR_CONFIG_START', idGrupo });
        try {
            const dadosCompletos = { ...dadosConfig, idGrupo };
            const modelo = new ModeloConfig(dadosCompletos);
            const dadosValidados = modelo.toObject();
            
            // Remove idGrupo from the object to be sent to the repository, as it's passed as a separate parameter
            const { idGrupo: _, ...dadosParaAtualizar } = dadosValidados;

            const resultado = await Repositorio.atualizarConfiguracoes(idGrupo, dadosParaAtualizar);

            if (!resultado) {
                throw new Error('Nenhum grupo foi atualizado. Verifique o id do grupo.');
            }
            
            console.log('Configurações do grupo atualizadas com sucesso', { event: 'ATUALIZAR_CONFIG_SUCCESS', idGrupo });
            return { mensagem: "Configurações atualizadas com sucesso!" };

        } catch (error: any) {
            console.error('Erro ao atualizar configurações do grupo', { event: 'ATUALIZAR_CONFIG_ERROR', idGrupo, errorMessage: error.message });
            throw error;
        }
    }

    /**
     * Obtém as configurações de um grupo.
     */
    async obterConfiguracoes(idGrupo: any) {
        console.log('Iniciando obtenção de configurações do grupo', { event: 'OBTER_CONFIG_START', idGrupo });
        try {
            const dados = await Repositorio.obterConfiguracoes(idGrupo);
            if (!dados) {
                console.warn('Configurações do grupo não encontradas', { event: 'OBTER_CONFIG_NOT_FOUND', idGrupo });
                return null;
            }
            
            // Map database field `group_id` to model field `idGrupo`
            const privacidade: "publico" | "privado" | undefined = dados.privacy === 'public' ? 'publico' : dados.privacy === 'private' ? 'privado' : undefined;
            const dadosMapeados = {
                idGrupo: dados.group_id,
                nome: dados.name,
                privacidade: privacidade,
                diretrizes: dados.guidelines,
                notificacoes: dados.notificacoes
            };

            const modelo = ModeloConfig.fromObject(dadosMapeados);
            console.log('Configurações do grupo obtidas com sucesso', { event: 'OBTER_CONFIG_SUCCESS', idGrupo });
            return modelo.toObject();

        } catch (error: any) {
            console.error('Erro ao obter configurações do grupo', { event: 'OBTER_CONFIG_ERROR', idGrupo, errorMessage: error.message });
            throw error;
        }
    }

    /**
     * Obtém as diretrizes de um grupo.
     */
    async obterDiretrizes(idGrupo: any) {
        console.log('Iniciando obtenção de diretrizes do grupo', { event: 'OBTER_DIRETRIZES_START', idGrupo });
        try {
            const dados = await Repositorio.obterDiretrizes(idGrupo);
            if (!dados) {
                 console.warn('Diretrizes do grupo não encontradas', { event: 'OBTER_DIRETRIZES_NOT_FOUND', idGrupo });
                return null;
            }
            console.log('Diretrizes do grupo obtidas com sucesso', { event: 'OBTER_DIRETRIZES_SUCCESS', idGrupo });
            return dados;
        } catch (error: any) {
            console.error('Erro ao obter diretrizes do grupo', { event: 'OBTER_DIRETRIZES_ERROR', idGrupo, errorMessage: error.message });
            throw error;
        }
    }

    /**
     * Atualiza as diretrizes de um grupo.
     */
    async atualizarDiretrizes(idGrupo: any, diretrizes: any) {
        console.log('Iniciando atualização de diretrizes do grupo', { event: 'ATUALIZAR_DIRETRIZES_START', idGrupo });
        try {
            const resultado = await Repositorio.atualizarDiretrizes(idGrupo, diretrizes);

            if (!resultado) {
                throw new Error('Nenhum grupo foi atualizado. Verifique o id do grupo.');
            }
            
            console.log('Diretrizes do grupo atualizadas com sucesso', { event: 'ATUALIZAR_DIRETRIZES_SUCCESS', idGrupo });
            return { mensagem: "Diretrizes atualizadas com sucesso!" };

        } catch (error: any) {
            console.error('Erro ao atualizar diretrizes do grupo', { event: 'ATUALIZAR_DIRETRIZES_ERROR', idGrupo, errorMessage: error.message });
            throw error;
        }
    }
}

export default new ServicoGruposConfiguracoes();
