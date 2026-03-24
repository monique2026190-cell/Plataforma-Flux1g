
import LogProvider from './Sistema.Mensageiro.Cliente.Backend.ts';

/**
 * @file Log.Performance.ts
 * @description Módulo para registrar métricas de performance, como tempos de execução de funções críticas,
 * renderização de componentes, ou durações de chamadas de API.
 */
class LogPerformance {
    /**
     * Inicia um timer de performance. Retorna um objeto com uma função `fim()` que, quando chamada,
     * calcula e loga a duração.
     * 
     * @param nomeMetrica - O nome da métrica a ser medida (ex: 'Render.HomePage', 'API.Fetch.UserData').
     * @param traceId - O ID de rastreamento para conectar esta métrica a um fluxo maior.
     */
    public iniciarTimer(nomeMetrica: string, traceId?: string) {
        const inicio = performance.now();

        return {
            /**
             * Finaliza a medição e registra a métrica de performance.
             * @param contexto - Dados adicionais relevantes para a medição (ex: { userId: '123', componentId: 'xyz' }).
             */
            fim: (contexto: Record<string, any> = {}) => {
                const fim = performance.now();
                const duracaoMs = parseFloat((fim - inicio).toFixed(2));

                LogProvider.info(
                    'Log.Performance', 
                    `Métrica: ${nomeMetrica}`,
                    {
                        metricName: nomeMetrica,
                        duration_ms: duracaoMs,
                        contexto: contexto,
                    },
                    traceId
                );

                return duracaoMs;
            }
        };
    }
}

// Exporta uma instância singleton
export default new LogPerformance();
