
// ServiçosFrontend/Contratos/Contrato.Usuario.ts

// Define a estrutura de tipo base para um usuário, usada em todo o frontend.
export interface IUsuario {
  id: string;
  nome: string;
  nickname: string;
  email: string;
  bio?: string;
  avatarUrl?: string;
  website?: string;
  perfilCompleto: boolean;
  googleId?: string; // Adicionado para integração com o login do Google
}
