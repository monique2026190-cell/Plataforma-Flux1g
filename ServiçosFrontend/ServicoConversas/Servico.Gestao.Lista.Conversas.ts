import { DadosChat } from '../../../types/Saida/Types.Estrutura.Chat';
import { dadosProviderChat } from '../Infra/Dados.Provider.Chat';

export const ServicoGestaoListaConversas = {
  async listarConversas(): Promise<DadosChat[]> {
    try {
      return await dadosProviderChat.listarConversas();
    } catch (error) {
      console.error("ServicoGestaoListaConversas: Erro ao listar conversas:", error);
      return [];
    }
  },
};
