import { httpClient } from '../Comunicacao/Comunicacao.Backend.Requisicoes';

class InfraProviderSistema {
    // --- Modo Hub ---
    public async buscarStatusHub(grupoId: string): Promise<any> {
        return httpClient.get(`/api/sistema/hub/status/${grupoId}`);
    }

    public async definirStatusModoHub(grupoId: string, payload: any): Promise<any> {
        return httpClient.post(`/api/sistema/hub/status/${grupoId}`, payload);
    }

    // --- Notificações ---
    public async buscarNotificacoes(): Promise<any[]> {
        return httpClient.get('/api/sistema/notificacoes');
    }

    public async marcarComoLida(notificacaoId: string): Promise<boolean> {
        return httpClient.post(`/api/sistema/notificacoes/${notificacaoId}/ler`);
    }

    public async marcarTodasComoLidas(): Promise<boolean> {
        return httpClient.post('/api/sistema/notificacoes/ler-todas');
    }

    // --- Push Notifications ---
    public async registrarTokenPush(token: string): Promise<any> {
        return httpClient.post('/api/sistema/push/registro', { token });
    }
}

export const infraProviderSistema = new InfraProviderSistema();
