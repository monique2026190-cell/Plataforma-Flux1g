import { Notificacao } from '../../types/Saida/Types.Estrutura.Notificacao';
import servicoNotificacao from '../ServicoNotificacao/Servico.Notificacao';
import { createApplicationServiceLogger } from '../SistemaObservabilidade/Log.Aplication';

const logger = createApplicationServiceLogger('NotificacoesApplicationService');

interface NotificacoesState {
  notificacoes: Notificacao[];
  loading: boolean;
  error: string | null;
}

class NotificacoesApplicationService {
  private state: NotificacoesState = {
    notificacoes: [],
    loading: true,
    error: null,
  };

  private listeners: ((state: NotificacoesState) => void)[] = [];

  constructor() {
    // As notificações são carregadas sob demanda via método carregarNotificacoes()
  }

  public async carregarNotificacoes() {
    logger.logOperationStart('carregarNotificacoes');
    
    this.updateState({ loading: true, error: null });

    try {
      // O token agora é gerenciado internamente pelo HttpClient
      const notificacoes = await servicoNotificacao.getNotifications();
      this.updateState({ notificacoes, loading: false });
      logger.logOperationSuccess('carregarNotificacoes', { notificationCount: notificacoes.length });
    } catch (err: any) {
      logger.logOperationError('carregarNotificacoes', err);
      this.updateState({ error: err.message, loading: false, notificacoes: [] });
    }
  }

  public getState(): NotificacoesState {
    return this.state;
  }

  public subscribe(listener: (state: NotificacoesState) => void): () => void {
    this.listeners.push(listener);
    listener(this.state); // Envia o estado atual imediatamente
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private updateState(newState: Partial<NotificacoesState>) {
    this.state = { ...this.state, ...newState };
    this.listeners.forEach(listener => listener(this.state));
  }
}

export const notificacoesApplicationService = new NotificacoesApplicationService();
