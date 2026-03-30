import { infraProviderUsuario } from './Infra.Provider.Usuario';
import { infraProviderSessao } from './Infra.Provider.Sessao';
import LoggerParaInfra from '../SistemaObservabilidade/Log.Infra';
import { z } from 'zod';

// --- Schemas de Validação Internos ---
// Definindo os schemas diretamente aqui para remover a dependência dos arquivos de Contrato.

const UsuarioRequestSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
  email: z.string().email("Formato de e-mail inválido."),
  senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
});

const PerfilUpdateRequestSchema = UsuarioRequestSchema.partial();

const LoginSchema = z.object({
  email: z.string().email('Email inválido.'),
  senha: z.string().min(1, 'A senha é obrigatória.'),
});

const LoginSocialSchema = z.object({
    nome: z.string(),
    email: z.string().email(),
    googleId: z.string(),
    avatarUrl: z.string().url().optional(),
    tokenProvider: z.string(),
});

const logger = new LoggerParaInfra('DadosProvider.Autenticacao');

/**
 * Camada de serviço que atua como intermediário entre a UI e a Camada de Infraestrutura.
 * Responsabilidades:
 * 1. Validar os dados de entrada (payloads) usando Zod.
 * 2. Chamar o método correspondente no `infraProviderSessao` ou `infraProviderUsuario` com os dados validados.
 * 3. Lidar com erros de validação e propagar erros da API.
 */
class C_DadosProvider {

  private async handleRequest(validationSchema: z.ZodSchema<any>, data: unknown, apiCall: (validatedData: any) => Promise<any>) {
    try {
      const dadosValidos = validationSchema.parse(data);
      return await apiCall(dadosValidos);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        logger.error("Erro de validação Zod", { issues: error.issues });
        // Estrutura de erro consistente para a UI
        return { sucesso: false, mensagem: "Dados inválidos.", issues: error.issues };
      }
      logger.error("Erro na camada de dados", error);
      // Propaga o erro da camada de infraestrutura ou um erro genérico
      throw error;
    }
  }

  async login(email: string, senha: string): Promise<any> {
    return this.handleRequest(LoginSchema, { email, senha }, (dadosValidos) => 
      infraProviderSessao.login(dadosValidos)
    );
  }

  async completarPerfil(perfilData: unknown): Promise<any> {
    return this.handleRequest(PerfilUpdateRequestSchema, perfilData, (dadosValidos) => 
      infraProviderUsuario.completarPerfil(dadosValidos)
    );
  }

  async lidarComLoginSocial(dadosLogin: unknown): Promise<any> {
    return this.handleRequest(LoginSocialSchema, dadosLogin, (dadosValidos) => 
      infraProviderSessao.lidarComLoginSocial(dadosValidos)
    );
  }

  async criarUsuario(dadosUsuario: unknown): Promise<any> {
    return this.handleRequest(UsuarioRequestSchema, dadosUsuario, (dadosValidos) => 
      infraProviderSessao.criarUsuario(dadosValidos)
    );
  }

  async buscarUsuarioPorId(id: string): Promise<any> {
    // IDs geralmente não precisam de validação complexa, chamamos a infra diretamente.
    try {
      return await infraProviderUsuario.buscarUsuarioPorId(id);
    } catch (error) {
        logger.error(`Erro ao buscar usuário por ID: ${id}`, error);
        throw error;
    }
  }

  async buscarUsuarioPorEmail(email: string): Promise<any> {
     // A validação de email pode ser feita aqui se necessário, mas por simplicidade, delegamos.
    try {
        return await infraProviderUsuario.buscarUsuarioPorEmail(email);
    } catch (error) {
        logger.error(`Erro ao buscar usuário por Email: ${email}`, error);
        throw error;
    }
  }
}

export const DadosProvider = new C_DadosProvider();
