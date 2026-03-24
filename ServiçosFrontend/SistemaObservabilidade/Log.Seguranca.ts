
import LogProvider from './Sistema.Mensageiro.Cliente.Backend.ts';

// Placeholder para o futuro módulo de Logs de Segurança
class LogSeguranca {
    public tentativaSuspeita(tipo: string, dados: any, traceId?: string) {
        LogProvider.warn('Log.Seguranca', `Tentativa Suspeita: ${tipo}`, dados, traceId);
    }
}

export default new LogSeguranca();
