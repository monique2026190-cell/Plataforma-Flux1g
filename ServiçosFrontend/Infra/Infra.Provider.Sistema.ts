import { httpClient } from './Infra.HttpClient';

class InfraProviderSistema {
    // --- Notificações ---
    public async buscarNotificacoes(): Promise<any[]> {
        return httpClient.get('/api/sistema/notificacoes');
    }

    public async marcarNotificacaoComoLida(notificacaoId: string): Promise<void> {
        return httpClient.post(`/api/sistema/notificacoes/${notificacaoId}/lida`);
    }

    public async marcarTodasComoLidas(): Promise<void> {
        return httpClient.post('/api/sistema/notificacoes/ler-todas');
    }

    // --- Servico de Notificacao (Push) ---
    public async registrarTokenPush(token: string): Promise<any> {
        return httpClient.post('/api/sistema/notificacoes/push/token', { token });
    }

    // --- Modo Hub ---
    public async buscarStatusHub(): Promise<any> {
        return httpClient.get('/api/sistema/hub/status');
    }
}

export const infraProviderSistema = new InfraProviderSistema();
