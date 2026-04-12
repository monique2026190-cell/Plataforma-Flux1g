import { DadosBase } from './Dados.Base';
import { infraProviderSistema } from './Infra.Provider.Sistema';

class DadosProviderSistema extends DadosBase {
    constructor() {
        super('DadosProvider.Sistema');
    }

    // --- Modo Hub ---
    async buscarStatusHub(grupoId: string) {
        return infraProviderSistema.buscarStatusHub(grupoId);
    }

    async definirStatusModoHub(grupoId: string, payload: any) {
        return infraProviderSistema.definirStatusModoHub(grupoId, payload);
    }

    // --- Notificações ---
    async buscarNotificacoes() {
        return infraProviderSistema.buscarNotificacoes();
    }

    async marcarComoLida(notificacaoId: string) {
        return infraProviderSistema.marcarComoLida(notificacaoId);
    }

    async marcarTodasComoLidas() {
        return infraProviderSistema.marcarTodasComoLidas();
    }

    // --- Push Notifications ---
    async registrarTokenPush(token: string) {
        return infraProviderSistema.registrarTokenPush(token);
    }
}

export const dadosProviderSistema = new DadosProviderSistema();
