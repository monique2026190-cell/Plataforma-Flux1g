
import LogProvider from './Sistema.Mensageiro.Cliente.Backend.ts';

/**
 * @file Log.Erros.ts
 * @description Módulo especializado para a captura e registro de exceções e falhas na aplicação.
 * Ele centraliza o tratamento de erros, garantindo que todos sejam logados com o máximo de detalhes possível.
 */
class LogErros {
    /**
     * Captura e loga um erro ocorrido na aplicação.
     * @param error - O objeto de erro (Error).
     * @param contexto - Um objeto com dados adicionais para ajudar na depuração (ex: { component: 'LoginButton', state: { ... } }).
     * @param traceId - O ID de rastreamento da requisição/fluxo.
     */
    public capturar(error: Error, contexto: Record<string, any> = {}, traceId?: string) {
        // Usa o método 'erro' do LogProvider para garantir que o erro seja logado com o nível correto
        // e com toda a estrutura de dados que definimos (stack trace, etc.).
        LogProvider.erro(
            'Log.Erros', // Módulo de origem
            `Exceção Capturada: ${error.message}`,
            {
                // Aninha o erro e o contexto para uma análise clara
                error: {
                    name: error.name,
                    message: error.message,
                    stack: error.stack,
                },
                contexto: contexto,
            },
            traceId
        );
    }
}

// Exporta uma instância singleton para ser usada em toda a aplicação
export default new LogErros();
