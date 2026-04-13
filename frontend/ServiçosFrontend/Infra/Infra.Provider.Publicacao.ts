
import { possibilidadeClienteHttp } from '../Comunicacao/Comunicacao.Backend.Requisicoes';
import API_ENDPOINTS from '../../constants/api';

class InfraProviderPublicacao {

    // --- Feed ---
    public async buscarPosts(): Promise<any[]> {
        return possibilidadeClienteHttp.get(API_ENDPOINTS.FEED.BASE);
    }

    public async buscarPostPorId(postId: string): Promise<any> {
        return possibilidadeClienteHttp.get(API_ENDPOINTS.FEED.POST(postId));
    }

    public async pesquisarPosts(query: string): Promise<any[]> {
        return possibilidadeClienteHttp.get(API_ENDPOINTS.FEED.BASE + '/search', { params: { query } });
    }

    public async criarPost(postData: FormData): Promise<any> {
        // CORREÇÃO: Removido o cabeçalho Content-Type. 
        // O navegador o definirá automaticamente com o boundary correto para FormData.
        return possibilidadeClienteHttp.post(API_ENDPOINTS.FEED.BASE, postData);
    }

    public async atualizarPost(postId: string, postData: any): Promise<any> {
        return possibilidadeClienteHttp.put(API_ENDPOINTS.FEED.POST(postId), postData);
    }

    public async deletarPost(postId: string): Promise<void> {
        return possibilidadeClienteHttp.delete(API_ENDPOINTS.FEED.POST(postId));
    }

    // --- Marketplace ---
    public async buscarItensMarketplace(): Promise<any[]> {
        return possibilidadeClienteHttp.get(API_ENDPOINTS.MARKETPLACE.BASE);
    }

    public async buscarItemMarketplacePorId(itemId: string): Promise<any> {
        return possibilidadeClienteHttp.get(API_ENDPOINTS.MARKETPLACE.ITEM(itemId));
    }

    public async criarItemMarketplace(itemData: FormData): Promise<any> {
        // CORREÇÃO: Removido o cabeçalho Content-Type.
        return possibilidadeClienteHttp.post(API_ENDPOINTS.MARKETPLACE.BASE, itemData);
    }
    
    // --- Reels ---
    public async buscarTodosReels(): Promise<any[]> {
        return possibilidadeClienteHttp.get(API_ENDPOINTS.REELS.BASE);
    }

    public async buscarReelPorId(reelId: string): Promise<any> {
        return possibilidadeClienteHttp.get(API_ENDPOINTS.REELS.REEL(reelId));
    }

    public async criarReel(reelData: FormData): Promise<any> {
        // CORREÇÃO: Removido o cabeçalho Content-Type.
        return possibilidadeClienteHttp.post(API_ENDPOINTS.REELS.BASE, reelData);
    }

    public async deletarReel(reelId: string): Promise<void> {
        return possibilidadeClienteHttp.delete(API_ENDPOINTS.REELS.REEL(reelId));
    }
}

export const infraProviderPublicacao = new InfraProviderPublicacao();
