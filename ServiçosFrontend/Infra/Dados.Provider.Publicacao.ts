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
        // Validação seria para o objeto antes de virar FormData, mas simplificaremos para o repasse.
        return infraProviderPublicacao.createPost(postData);
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
