import { z } from 'zod';
import { DadosBase } from './Dados.Base';
import { infraProviderSistema } from './Infra.Provider.Sistema';

class DadosProviderSistema extends DadosBase {
    constructor() {
        super('DadosProvider.Sistema');
    }

    // --- Notificações ---
    async buscarNotificacoes() {
        return infraProviderSistema.buscarNotificacoes();
    }

    async marcarNotificacaoComoLida(id: string) {
        return infraProviderSistema.marcarNotificacaoComoLida(id);
    }

    async marcarTodasComoLidas() {
        return infraProviderSistema.marcarTodasComoLidas();
    }

    // --- Servico de Notificacao (Push) ---
    async registrarTokenPush(token: string) {
        return infraProviderSistema.registrarTokenPush(token);
    }

    // --- Modo Hub ---
    async buscarStatusHub() {
        return infraProviderSistema.buscarStatusHub();
    }
}

export const dadosProviderSistema = new DadosProviderSistema();
