
// Interface para o objeto de usuário principal no frontend
export interface IUsuario {
    id?: any;
    nome: string;
    email: string;
    apelido?: string;
    bio?: string;
    site?: string;
    avatarUrl?: string;
    privado: boolean;
    perfilCompleto: boolean;
}

// Interface para o registro de um novo usuário
export interface IUsuarioRegistro {
    nome: string;
    email: string;
    senha?: string;
}

// Interface para o login de um usuário
export interface IUsuarioLogin {
    email: string;
    senha: string;
}

// Interface para a autenticação de um usuário com o Google
export interface IUsuarioGoogleAuth {
    nome?: string;
    email: string;
    google_id: string;
}

// Interface para a atualização de um usuário
export interface IUsuarioAtualizacao {
    nickname?: string;
    name?: string;
    bio?: string;
    is_private?: boolean;
    photo_url?: string;
    profile_completed?: boolean;
}
