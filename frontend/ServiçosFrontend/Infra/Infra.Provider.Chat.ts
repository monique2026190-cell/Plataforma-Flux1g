import { httpClient } from '../Comunicacao/Comunicacao.Backend.Requisicoes';
import API_ENDPOINTS from '../../constants/api';

class InfraProviderChat {
    public async listarConversas(): Promise<any[]> {
        return httpClient.get(API_ENDPOINTS.CONVERSATIONS.BASE);
    }

    public async obterMensagens(conversaId: string): Promise<any[]> {
        return httpClient.get(API_ENDPOINTS.CONVERSATIONS.MESSAGES(conversaId));
    }

    public async enviarMensagem(conversaId: string, mensagem: any): Promise<any> {
        return httpClient.post(API_ENDPOINTS.CONVERSATIONS.MESSAGES(conversaId), mensagem);
    }
}

export const infraProviderChat = new InfraProviderChat();
