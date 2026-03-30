import { httpClient } from './Infra.HttpClient';

class InfraProviderPublicacao {
    // --- Feed ---
    public async getPosts(): Promise<any[]> {
        return httpClient.get('/api/feed');
    }

    public async getPostById(postId: string): Promise<any> {
        return httpClient.get(`/api/feed/${postId}`);
    }

    public async searchPosts(query: string): Promise<any[]> {
        return httpClient.get('/api/feed/search', { params: { query } });
    }

    public async createPost(postData: FormData): Promise<any> {
        return httpClient.post('/api/feed', postData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    }

    public async updatePost(postId: string, postData: any): Promise<any> {
        return httpClient.put(`/api/feed/${postId}`, postData);
    }

    public async deletePost(postId: string): Promise<void> {
        return httpClient.delete(`/api/feed/${postId}`);
    }

    // --- Marketplace ---
    public async getMarketplaceItems(): Promise<any[]> {
        return httpClient.get('/api/marketplace');
    }

    public async getMarketplaceItemById(itemId: string): Promise<any> {
        return httpClient.get(`/api/marketplace/${itemId}`);
    }

    public async createMarketplaceItem(itemData: FormData): Promise<any> {
        return httpClient.post('/api/marketplace', itemData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    }
}

export const infraProviderPublicacao = new InfraProviderPublicacao();
