
import { z } from 'zod';
import { DadosBase } from './Dados.Base';
import { infraProviderPublicacao } from './Infra.Provider.Publicacao';

const PostSchema = z.object({
    titulo: z.string().min(1, "O título é obrigatório."),
    conteudo: z.string().optional(),
    imagem: z.any().optional(),
});

class DadosProviderPublicacao extends DadosBase {
    constructor() {
        super('DadosProvider.Publicacao');
    }

    // --- Feed ---
    async buscarPosts() {
        return infraProviderPublicacao.buscarPosts();
    }

    async buscarPostPorId(id: string) {
        return infraProviderPublicacao.buscarPostPorId(id);
    }

    async criarPost(postData: FormData) {
        try {
            const result = await infraProviderPublicacao.criarPost(postData);
            return result;
        } catch (error) {
            // Correção: Usa this.logger.error em vez do inexistente this.logError
            this.logger.error('Erro em criarPost', error);
            throw error;
        }
    }

    async atualizarPost(id: string, postData: any) {
        return infraProviderPublicacao.atualizarPost(id, postData);
    }

    async deletarPost(id: string) {
        return infraProviderPublicacao.deletarPost(id);
    }

    // --- Marketplace ---
    async buscarItensMarketplace() {
        return infraProviderPublicacao.buscarItensMarketplace();
    }
}

export const dadosProviderPublicacao = new DadosProviderPublicacao();
