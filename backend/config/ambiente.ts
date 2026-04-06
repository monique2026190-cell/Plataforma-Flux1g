
import VariaveisBackend from './Variaveis.Backend.js';

// --- Tipos e Interfaces ---
type LogLevel = 'log' | 'info' | 'warn' | 'error';

interface LogEntry {
    level: LogLevel;
    message: string;
}

interface AmbienteDetectado {
    ambiente: 'producao' | 'local';
    provedor: 'Render' | 'Vercel' | 'Outro' | 'Nenhum';
}

// --- Classes e Funções ---
class LogBuilder {
    private logs: LogEntry[] = [];

    add(level: LogLevel, message: string): void {
        this.logs.push({ level, message });
    }

    imprimir(): void {
        this.logs.forEach(log => {
            // Usar um switch garante a segurança de tipo ao chamar o console
            switch (log.level) {
                case 'info':
                    console.info(log.message);
                    break;
                case 'warn':
                    console.warn(log.message);
                    break;
                case 'error':
                    console.error(log.message);
                    break;
                case 'log':
                default:
                    console.log(log.message);
                    break;
            }
        });
    }
}

const detectarAmbiente = (): AmbienteDetectado => {
    if (process.env.RENDER === 'true') return { ambiente: 'producao', provedor: 'Render' };
    if (process.env.VERCEL) return { ambiente: 'producao', provedor: 'Vercel' }; // Corrigido: Vercel env var é '1'
    if (process.env.NODE_ENV === 'production') return { ambiente: 'producao', provedor: 'Outro' };
    return { ambiente: 'local', provedor: 'Nenhum' };
};

// --- Execução e Lógica ---
const logBuilder = new LogBuilder();

logBuilder.add('log', '\n=======================================================');
logBuilder.add('log', '=== INICIANDO CONFIGURAÇÃO DE AMBIENTE (BACKEND) ===');
logBuilder.add('log', '=======================================================');

const { ambiente: ambienteAtual, provedor: provedorAtual } = detectarAmbiente();
const isProducao = ambienteAtual === 'producao';

logBuilder.add('info', `[INFO] Ambiente detectado: ${ambienteAtual.toUpperCase()}`);
if (isProducao) {
    logBuilder.add('info', `[INFO] Provedor de hospedagem: ${provedorAtual}`);
}

logBuilder.add('log', '\n--- Variáveis de ambiente carregadas e validadas por Variaveis.Backend.ts ---');

// Combina as informações de ambiente com as variáveis já carregadas
const backendConfig = {
    ...VariaveisBackend,
    ambiente: ambienteAtual,
    provedor: provedorAtual,
    isProducao,
};

logBuilder.add('log', '\n========================================================');
logBuilder.add('log', '=== CONFIGURAÇÃO DO BACKEND FINALIZADA COM SUCESSO ===');
logBuilder.add('log', '========================================================\n');

logBuilder.imprimir();

// --- Exportação ---

// Exporta a configuração final e unificada.
export { backendConfig };

// Exporta também o TIPO da configuração para ser usado em outras partes da aplicação.
export type BackendConfig = typeof backendConfig;
