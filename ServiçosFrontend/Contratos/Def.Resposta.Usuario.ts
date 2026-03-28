
// ServiçosFrontend/Contratos/Def.Resposta.Usuario.ts
import { z } from 'zod';

// Valida os dados da RESPOSTA do backend.
export const UsuarioResponseSchema = z.object({
  usuario: z.object({
    id: z.string(),
    nome: z.string(),
    nickname: z.string(),
    email: z.string(),
    bio: z.string().optional(),
    avatarUrl: z.string().optional(),
    website: z.string().optional(),
    perfilCompleto: z.boolean(),
    googleId: z.string().optional(), // Adicionado para integração com o login do Google
  })
});

// Tipo derivado do schema
export type IUsuarioResponse = z.infer<typeof UsuarioResponseSchema>;

// Função de validação
export const validarUsuarioResponse = (data: unknown): IUsuarioResponse => {
  return UsuarioResponseSchema.parse(data);
};
