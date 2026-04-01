
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
    async getPosts() {
        return infraProviderPublicacao.getPosts();
    }

    async getPostById(id: string) {
        return infraProviderPublicacao.getPostById(id);
    }

    async createPost(postData: FormData) {
        try {
            // A chamada para a infraestrutura agora está dentro de um bloco try-catch.
            const result = await infraProviderPublicacao.createPost(postData);
            return result;
        } catch (error) {
            // Loga o erro usando o método da classe base.
            this.logError('createPost', error);
            // Relança o erro para que a camada de serviço e a UI possam reagir.
            throw error;
        }
    }

    async updatePost(id: string, postData: any) {
        return infraProviderPublicacao.updatePost(id, postData);
    }

    async deletePost(id: string) {
        return infraProviderPublicacao.deletePost(id);
    }

    // --- Marketplace ---
    async getMarketplaceItems() {
        return infraProviderPublicacao.getMarketplaceItems();
    }
}

export const dadosProviderPublicacao = new DadosProviderPublicacao();
