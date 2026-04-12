
import { z } from 'zod';

/**
 * Contrato de Comunicação para o Usuário.
 * Centraliza a definição de dados que trafegam entre Frontend e Backend.
 * Resolve as discrepâncias de nomeação (ex: avatarUrl vs photo_url).
 */

// --- Schemas de Validação (Zod) ---

export const UsuarioDtoSchema = z.object({
    id: z.string().uuid().optional(),
    nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres."),
    email: z.string().email("E-mail inválido."),
    apelido: z.string().min(3, "Apelido deve ter no mínimo 3 caracteres.").optional(),
    bio: z.string().max(150, "Bio deve ter no máximo 150 caracteres.").optional(),
    avatarUrl: z.string().url().optional().or(z.literal('')),
    privado: z.boolean().default(false),
    perfilCompleto: z.boolean().default(false),
    senha: z.string().min(6).optional(), // Adicionado para Auth/Registro
});

export type IUsuarioDto = z.infer<typeof UsuarioDtoSchema>;

// --- Mapeadores (Transformers) ---

/**
 * Mapeia os dados do Backend (API) para o formato do Frontend (App).
 * @param backendData Dados brutos vindos da API.
 */
export const mapearBackendParaFrontend = (backendData: any): IUsuarioDto => {
    return {
        id: backendData.id,
        nome: backendData.nome || backendData.name, // Suporta ambos durante a transição
        email: backendData.email,
        apelido: backendData.apelido || backendData.nickname,
        bio: backendData.bio,
        avatarUrl: backendData.urlFoto || backendData.photo_url,
        site: backendData.site || backendData.website,
        privado: backendData.privado ?? backendData.is_private ?? false,
        perfilCompleto: backendData.perfilCompleto ?? backendData.profile_completed ?? false,
    };
};

/**
 * Mapeia os dados do Frontend (App) para o formato que o Backend espera (API).
 * @param frontendData Dados da aplicação frontend.
 */
export const mapearFrontendParaBackend = (frontendData: Partial<IUsuarioDto>): any => {
    return {
        id: frontendData.id,
        nome: frontendData.nome,
        name: frontendData.nome, // Envia ambos para compatibilidade
        email: frontendData.email,
        nickname: frontendData.apelido,
        bio: frontendData.bio,
        website: frontendData.site,
        photo_url: frontendData.avatarUrl,
        is_private: frontendData.privado,
        profile_completed: frontendData.perfilCompleto,
        senha: frontendData.senha,
        password: frontendData.senha, // Mapeia para ambos para garantir recepção
    };
};
