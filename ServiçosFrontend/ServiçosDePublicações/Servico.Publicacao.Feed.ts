
import { dadosProviderPublicacao } from '../Infra/Dados.Provider.Publicacao';

class FeedPublicationService {
    async criarPost(formData: FormData): Promise<any> {
        try {
            const response = await dadosProviderPublicacao.criarPostFeed(formData);
            return response;
        } catch (error) {
            console.error("Erro no serviço ao criar a publicação do feed:", error);
            throw error;
        }
    }

    // Nova função para buscar um post específico pelo seu ID.
    async buscarPostPorId(id: string): Promise<any> {
        try {
            const response = await dadosProviderPublicacao.buscarPostPorId(id);
            return response;
        } catch (error) {
            console.error(`Erro no serviço ao buscar o post com ID ${id}:`, error);
            throw error;
        }
    }

    // Nova função para deletar um post específico pelo seu ID.
    async deletarPost(id: string): Promise<any> {
        try {
            const response = await dadosProviderPublicacao.deletarPost(id);
            return response;
        } catch (error) {
            console.error(`Erro no serviço ao deletar o post com ID ${id}:`, error);
            throw error;
        }
    }
}

export const feedPublicationService = new FeedPublicationService();
