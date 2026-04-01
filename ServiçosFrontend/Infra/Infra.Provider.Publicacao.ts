import { httpClient } from '../Comunicacao/Comunicacao.Backend.Requisicoes';
import { API_ENDPOINTS } from '../../src/constants/api';

class InfraProviderPublicacao {

    // --- Feed ---
    public async buscarPosts(): Promise<any[]> {
        return httpClient.get(API_ENDPOINTS.FEED.BASE);
    }

    public async buscarPostPorId(postId: string): Promise<any> {
        return httpClient.get(API_ENDPOINTS.FEED.POST(postId));
    }

    public async pesquisarPosts(query: string): Promise<any[]> {
        return httpClient.get(API_ENDPOINTS.FEED.BASE + '/search', { params: { query } });
    }

    public async criarPost(postData: FormData): Promise<any> {
        return httpClient.post(API_ENDPOINTS.FEED.BASE, postData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    }

    public async atualizarPost(postId: string, postData: any): Promise<any> {
        return httpClient.put(API_ENDPOINTS.FEED.POST(postId), postData);
    }

    public async deletarPost(postId: string): Promise<void> {
        return httpClient.delete(API_ENDPOINTS.FEED.POST(postId));
    }

    // --- Marketplace ---
    public async buscarItensMarketplace(): Promise<any[]> {
        return httpClient.get(API_ENDPOINTS.MARKETPLACE.BASE);
    }

    public async buscarItemMarketplacePorId(itemId: string): Promise<any> {
        return httpClient.get(API_ENDPOINTS.MARKETPLACE.ITEM(itemId));
    }

    public async criarItemMarketplace(itemData: FormData): Promise<any> {
        return httpClient.post(API_ENDPOINTS.MARKETPLACE.BASE, itemData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    }
}

export const infraProviderPublicacao = new InfraProviderPublicacao();
