
import LogProvider from './Sistema.Mensageiro.Cliente.Backend.ts';

/**
 * @file Log.Eventos.Negocio.ts
 * @description Módulo dedicado ao registro de eventos de negócio de alto nível.
 * Estes são os eventos que descrevem a jornada do usuário e as interações críticas com a aplicação.
 */
class LogEventosNegocio {
    /**
     * Registra um evento de negócio significativo.
     * 
     * @param nomeEvento - O nome do evento (ex: 'USUARIO_LOGIN', 'COMPRA_REALIZADA', 'PERFIL_ATUALIZADO').
     * @param dadosEvento - Um objeto com dados que descrevem o evento em detalhes (ex: { produtoId: '123', valor: 99.99 }).
     * @param traceId - O ID de rastreamento para conectar o evento a uma requisição ou fluxo específico.
     */
    public registrar(nomeEvento: string, dadosEvento: Record<string, any> = {}, traceId?: string) {
        LogProvider.info(
            'Log.Eventos.Negocio', // Módulo de origem
            `Evento de Negócio: ${nomeEvento}`,
            {
                eventName: nomeEvento,
                eventData: dadosEvento,
            },
            traceId
        );
    }
}

// Exporta uma instância singleton
export default new LogEventosNegocio();
