import { z } from 'zod';
import LoggerParaInfra from '../SistemaObservabilidade/Log.Infra';

export class DadosBase {
    protected logger: LoggerParaInfra;

    constructor(loggerName: string) {
        this.logger = new LoggerParaInfra(loggerName);
    }

    protected async handleRequest<T>(
        validationSchema: z.ZodSchema<T>,
        data: unknown,
        apiCall: (validatedData: T) => Promise<any>
    ) {
        try {
            const dadosValidos = validationSchema.parse(data);
            return await apiCall(dadosValidos);
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                this.logger.error("Erro de validação Zod", { issues: error.issues });
                return { sucesso: false, mensagem: "Dados inválidos.", issues: error.issues };
            }
            
            this.logger.error("Erro na camada de dados", {
                error: {
                    message: error instanceof Error ? error.message : String(error),
                    stack: error instanceof Error ? error.stack : undefined,
                    name: error instanceof Error ? error.name : undefined,
                },
                data,
            });

            throw error;
        }
    }
}
