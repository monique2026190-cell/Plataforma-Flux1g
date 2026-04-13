import { possibilidadeClienteHttp } from '../Comunicacao/Comunicacao.Backend.Requisicoes';
import API_ENDPOINTS from '../../constants/api';

class InfraProviderChat {
    public async listarConversas(): Promise<any[]> {
        return possibilidadeClienteHttp.get(API_ENDPOINTS.CONVERSATIONS.BASE);
    }

    public async obterMensagens(conversaId: string): Promise<any[]> {
        return possibilidadeClienteHttp.get(API_ENDPOINTS.CONVERSATIONS.MESSAGES(conversaId));
    }

    public async enviarMensagem(conversaId: string, mensagem: any): Promise<any> {
        return possibilidadeClienteHttp.post(API_ENDPOINTS.CONVERSATIONS.MESSAGES(conversaId), mensagem);
    }
}

export const infraProviderChat = new InfraProviderChat();
