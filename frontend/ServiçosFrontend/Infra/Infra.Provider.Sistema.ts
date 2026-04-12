import { httpClient } from '../Comunicacao/Comunicacao.Backend.Requisicoes';
import API_ENDPOINTS from '../../constants/api';

class InfraProviderSistema {
    // --- Modo Hub ---
    public async buscarStatusHub(grupoId: string): Promise<any> {
        return httpClient.get(API_ENDPOINTS.SISTEMA.HUB_STATUS(grupoId));
    }

    public async definirStatusModoHub(grupoId: string, payload: any): Promise<any> {
        return httpClient.post(API_ENDPOINTS.SISTEMA.SET_HUB_STATUS(grupoId), payload);
    }

    // --- Notificações ---
    public async buscarNotificacoes(): Promise<any[]> {
        return httpClient.get(API_ENDPOINTS.SISTEMA.NOTIFICATIONS);
    }

    public async marcarComoLida(notificacaoId: string): Promise<boolean> {
        return httpClient.post(API_ENDPOINTS.SISTEMA.MARK_NOTIFICATION_READ(notificacaoId));
    }

    public async marcarTodasComoLidas(): Promise<boolean> {
        return httpClient.post(API_ENDPOINTS.SISTEMA.MARK_ALL_NOTIFICATIONS_READ);
    }

    // --- Push Notifications ---
    public async registrarTokenPush(token: string): Promise<any> {
        return httpClient.post(API_ENDPOINTS.SISTEMA.PUSH_REGISTRATION, { token });
    }
}

export const infraProviderSistema = new InfraProviderSistema();
