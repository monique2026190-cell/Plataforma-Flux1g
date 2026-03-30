import { httpClient } from '../Comunicacao/Comunicacao.Backend.Requisicoes';
import { createLogger } from '../Comunicacao/Comunicacao.Backend.Observabilidade';

class InfraProviderChat {
    public async listarConversas(): Promise<any[]> {
        return httpClient.get('/api/chat/conversas');
    }

    public async obterMensagens(conversaId: string): Promise<any[]> {
        return httpClient.get(`/api/chat/conversas/${conversaId}/mensagens`);
    }

    public async enviarMensagem(conversaId: string, mensagem: any): Promise<any> {
        return httpClient.post(`/api/chat/conversas/${conversaId}/mensagens`, mensagem);
    }
}

export const infraProviderChat = new InfraProviderChat();
