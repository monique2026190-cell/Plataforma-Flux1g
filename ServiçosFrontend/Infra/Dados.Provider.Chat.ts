import { DadosBase } from './Dados.Base';
import { infraProviderChat } from './Infra.Provider.Chat';

class DadosProviderChat extends DadosBase {
    constructor() {
        super('DadosProvider.Chat');
    }

    async listarConversas() {
        return infraProviderChat.listarConversas();
    }

    async obterMensagens(conversaId: string) {
        return infraProviderChat.obterMensagens(conversaId);
    }

    async enviarMensagem(conversaId: string, mensagem: any) {
        return infraProviderChat.enviarMensagem(conversaId, mensagem);
    }
}

export const dadosProviderChat = new DadosProviderChat();
