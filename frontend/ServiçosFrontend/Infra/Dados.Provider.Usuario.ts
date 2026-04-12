import { z } from 'zod';
import { DadosBase } from './Dados.Base';
import { infraProviderUsuario } from './Infra.Provider.Usuario';
import { mapearFrontendParaBackend } from '../Contratos/Contrato.Comunicacao.Usuario';

// Esquemas de Sessão
const LoginSchema = z.object({
  email: z.string().email('Email inválido.'),
  senha: z.string().min(1, 'A senha é obrigatória.'),
});

const LoginSocialSchema = z.object({
    nome: z.string().optional(),
    email: z.string().email(),
    googleId: z.string(),
    avatarUrl: z.string().url().optional(),
    tokenProvider: z.string(),
});

// Esquemas de Usuário
const CriarUsuarioSchema = z.object({
  nome: z.string().min(3, "O nome deve ter pelo menos 3 caracteres."),
  email: z.string().email("Formato de e-mail inválido."),
  senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres."),
});

const CompletarPerfilSchema = z.object({
  apelido: z.string().min(3, "O apelido deve ter pelo menos 3 caracteres."),
  nome: z.string().min(3, "O nome de usuário deve ter pelo menos 3 caracteres."),
  bio: z.string().optional(),
});

const AtualizarPerfilSchema = CriarUsuarioSchema.pick({ email: true, nome: true }).partial();

class DadosProviderUsuario extends DadosBase {
    constructor() {
        super('DadosProvider.Usuario');
    }

    // Métodos de Sessão
    async login(credenciais: { email: string, senha: string }): Promise<any> {
        return this.handleRequest(LoginSchema, credenciais, (dadosValidos) => 
            infraProviderUsuario.login(mapearFrontendParaBackend(dadosValidos))
        );
    }

    async lidarComLoginSocial(dadosLogin: unknown): Promise<any> {
        return this.handleRequest(LoginSocialSchema, dadosLogin, (dadosValidos) => 
            infraProviderUsuario.lidarComLoginSocial(dadosValidos)
        );
    }

    async criarUsuario(dadosUsuario: unknown): Promise<any> {
        return this.handleRequest(CriarUsuarioSchema, dadosUsuario, (dadosValidos) => 
            infraProviderUsuario.criarUsuario(mapearFrontendParaBackend(dadosValidos))
        );
    }

    async completarPerfilInicial(idUsuario: string, dadosPerfil: FormData): Promise<any> {
        dadosPerfil.append('idUsuario', idUsuario);

        // A validação com Zod é complexa para FormData. 
        // A validação será feita no backend.
        try {
            return await infraProviderUsuario.completarPerfilInicial(dadosPerfil);
        } catch (error) {
            this.log.error('Erro de requisição ao completar perfil inicial', { error });
            throw error;
        }
    }

    async verificarSessao(): Promise<any> {
        const token = localStorage.getItem('auth_token');
        if (token) {
            return await infraProviderUsuario.verificarSessao(token);
        }
        return Promise.resolve({ sucesso: false, mensagem: "Token não encontrado." });
    }

    // Métodos de Gerenciamento de Usuário
    async atualizarPerfil(perfilData: unknown): Promise<any> {
        return this.handleRequest(AtualizarPerfilSchema, perfilData, (dadosValidos) => 
            infraProviderUsuario.atualizarPerfil(dadosValidos)
        );
    }

    async buscarUsuarioPorId(id: string): Promise<any> {
        try {
            return await infraProviderUsuario.buscarUsuarioPorId(id);
        } catch (error) {
            this.logger.error(`Erro ao buscar usuário por ID: ${id}`, error);
            throw error;
        }
    }

    async buscarUsuarioPorEmail(email: string): Promise<any> {
        try {
            return await infraProviderUsuario.buscarUsuarioPorEmail(email);
        } catch (error) {
            this.logger.error(`Erro ao buscar usuário por Email: ${email}`, error);
            throw error;
        }
    }
    async verificarStatusPerfil(): Promise<any> {
      return infraProviderUsuario.verificarStatusPerfil();
    }
}

export const dadosProviderUsuario = new DadosProviderUsuario();
