
/**
 * @file Sistema.Log.ts
 * @description Módulo centralizado de logging para toda a aplicação.
 */
class SistemaLog {

    /**
     * Gera um timestamp formatado para os logs.
     * @returns {string} Timestamp no formato YYYY-MM-DD HH:mm:ss
     */
    private static getTimestamp(): string {
        // Usa toISOString por ser um padrão universal (ISO 8601) e depois formata.
        // Formato: YYYY-MM-DDTHH:mm:ss.sssZ -> YYYY-MM-DD HH:mm:ss
        return new Date().toISOString().replace('T', ' ').substring(0, 19);
    }

    /**
     * Registra uma mensagem informativa.
     * @param modulo O nome do módulo ou contexto.
     * @param mensagem A mensagem a ser registrada.
     * @param dadosExtras Dados adicionais para incluir no log.
     */
    public static info(modulo: string, mensagem: string, dadosExtras?: object): void {
        const timestamp = this.getTimestamp();
        console.info(`${timestamp} [INFO] [${modulo}] ${mensagem}`, dadosExtras || '');
    }

    /**
     * Registra um aviso.
     * @param modulo O nome do módulo ou contexto.
     * @param mensagem A mensagem de aviso.
     * @param dadosExtras Dados adicionais para incluir no log.
     */
    public static aviso(modulo: string, mensagem: string, dadosExtras?: object): void {
        const timestamp = this.getTimestamp();
        console.warn(`${timestamp} [WARN] [${modulo}] ${mensagem}`, dadosExtras || '');
    }

    /**
     * Registra um erro.
     * @param modulo O nome do módulo ou contexto.
     * @param mensagem A mensagem de erro principal.
     * @param erro O objeto de erro ou dados extras associados.
     */
    public static erro(modulo: string, mensagem: string, erro?: any): void {
        const timestamp = this.getTimestamp();
        console.error(`${timestamp} [ERRO] [${modulo}] ${mensagem}`, erro || '');
    }

    /**
     * Registra uma mensagem de depuração.
     * @param modulo O nome do módulo ou contexto.
     * @param mensagem A mensagem de depuração.
     * @param dadosExtras Dados adicionais para incluir no log.
     */
    public static debug(modulo: string, mensagem: string, dadosExtras?: object): void {
        const timestamp = this.getTimestamp();
        console.debug(`${timestamp} [DEBUG] [${modulo}] ${mensagem}`, dadosExtras || '');
    }
}

export default SistemaLog;
