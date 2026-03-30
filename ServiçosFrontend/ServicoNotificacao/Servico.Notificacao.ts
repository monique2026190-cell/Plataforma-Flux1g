import { dadosProviderSistema } from '../Infra/Dados.Provider.Sistema';
import { Notificacao } from '../../../types/Saida/Types.Estrutura.Notificacao';

/**
 * @file Serviço para gerenciar notificações.
 */
class ServicoNotificacao {

  /**
   * Busca a lista de notificações do usuário.
   */
  async getNotifications(): Promise<Notificacao[]> {
    try {
      return await dadosProviderSistema.buscarNotificacoes();
    } catch (error) {
      console.error("ServicoNotificacao: Erro ao buscar notificações:", error);
      return [];
    }
  }

  /**
   * Marca uma notificação específica como lida.
   */
  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      return await dadosProviderSistema.marcarComoLida(notificationId);
    } catch (error) {
      console.error("ServicoNotificacao: Erro ao marcar notificação como lida:", error);
      return false;
    }
  }

  /**
   * Marca todas as notificações do usuário como lidas.
   */
  async markAllAsRead(): Promise<boolean> {
    try {
      return await dadosProviderSistema.marcarTodasComoLidas();
    } catch (error) {
      console.error("ServicoNotificacao: Erro ao marcar todas as notificações como lidas:", error);
      return false;
    }
  }
}

const servicoNotificacao = new ServicoNotificacao();
export default servicoNotificacao;
