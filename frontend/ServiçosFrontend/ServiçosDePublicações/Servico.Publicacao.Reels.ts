
import { dadosProviderPublicacao } from '../Infra/Dados.Provider.Publicacao';

class ReelsPublicationService {
    async create(data: { descricao: string; arquivoVideo: File; authorId: string }): Promise<any> {
        try {
            const formData = new FormData();
            formData.append('descricao', data.descricao);
            formData.append('authorId', data.authorId);
            formData.append('video', data.arquivoVideo);
            
            const response = await dadosProviderPublicacao.criarReel(formData);
            return response;
        } catch (error) {
            console.error("Erro no serviço ao criar a publicação do reel:", error);
            throw error;
        }
    }

    async getAll(): Promise<any> {
        try {
            const response = await dadosProviderPublicacao.buscarTodosReels();
            return response;
        } catch (error) {
            console.error("Erro no serviço ao buscar todos os reels:", error);
            throw error;
        }
    }
    
    async buscarReelPorId(id: string): Promise<any> {
        try {
            return await dadosProviderPublicacao.buscarReelPorId(id);
        } catch (error) {
            console.error(`Erro no serviço ao buscar o reel com ID ${id}:`, error);
            throw error;
        }
    }

    async deletarReel(id: string): Promise<any> {
        try {
            return await dadosProviderPublicacao.deletarReel(id);
        } catch (error) {
            console.error(`Erro no serviço ao deletar o reel com ID ${id}:`, error);
            throw error;
        }
    }
}

export const ServiçoPublicacaoReels = new ReelsPublicationService();
