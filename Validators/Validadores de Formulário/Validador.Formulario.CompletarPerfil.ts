
import { z } from 'zod';

/**
 * Define o esquema de validação para o formulário de completar o perfil.
 * Garante que o nome de usuário, apelido e bio atendam aos critérios do sistema.
 */
const schemaCompletarPerfil = z.object({
  // Apelido do usuário, como será exibido para outros.
  nickname: z.string({
    required_error: "O apelido é obrigatório.",
  }).min(3, { message: "Seu apelido deve ter pelo menos 3 caracteres." }),

  // Nome de usuário único, usado para login, menções (@), etc.
  name: z.string({
    required_error: "O nome de usuário é obrigatório.",
  })
  .min(4, { message: "O nome de usuário deve ter pelo menos 4 caracteres." })
  .regex(/^[a-zA-Z0-9_\.]+$/, {
    message: "Use apenas letras, números, ou os símbolos _ e ."
  }),

  // Uma breve descrição do usuário.
  bio: z.string()
    .max(160, { message: "Sua bio não pode exceder 160 caracteres." })
    .optional(), // O campo bio é opcional.
});

// Exporta o tipo inferido do schema para garantir a tipagem no formulário.
export type CompletarPerfilFormData = z.infer<typeof schemaCompletarPerfil>;

// Exporta o validador para ser usado com react-hook-form.
export const validadorFormularioCompletarPerfil = schemaCompletarPerfil;
