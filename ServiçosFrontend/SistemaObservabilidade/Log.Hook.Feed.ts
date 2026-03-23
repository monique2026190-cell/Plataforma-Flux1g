import LogProvider from './Log.Provider';

const DOMAIN = 'Feed';

class LogHookFeed {
    public snapshot(estado: any, contexto: Record<string, any> = {}, traceId?: string) {
        LogProvider.info(`Log.Hook.${DOMAIN}`, `Snapshot`, { estado, ...contexto }, traceId);
    }

    public evento(nomeEvento: string, dados: Record<string, any> = {}, traceId?: string) {
        LogProvider.info(`Log.Hook.${DOMAIN}`, `Evento: ${nomeEvento}`, dados, traceId);
    }

    public erro(error: Error, contexto: Record<string, any> = {}, traceId?: string) {
        LogProvider.erro(`Log.Hook.${DOMAIN}`, `Erro no Hook`, {
            mensagem: error.message,
            stack: error.stack,
            ...contexto,
        }, traceId);
    }
}

export default new LogHookFeed();
