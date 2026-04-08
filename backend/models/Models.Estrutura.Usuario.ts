
// backend/models/Models.Estrutura.Usuario.ts
import bcrypt from 'bcryptjs';

// Interface para dados recebidos do banco de dados
export interface IUsuarioDB {
    id?: any;
    name?: string;
    email?: string;
    google_id?: string;
    password_hash?: string;
    nickname?: string;
    bio?: string;
    website?: string;
    photo_url?: string;
    is_private?: boolean;
    profile_completed?: boolean;
    created_at?: Date;
    updated_at?: Date;
    seguidores?: any[];
    seguindo?: any[];
}

// Interface principal do usuário na aplicação
export interface IUsuario {
    id?: any;
    nome: string;
    email: string;
    googleId?: string;
    senhaHash?: string;
    apelido?: string;
    bio?: string;
    site?: string;
    urlFoto?: string;
    privado: boolean;
    perfilCompleto: boolean;
    dataCriacao?: Date;
    dataAtualizacao?: Date;
    seguidores: any[];
    seguindo: any[];
}

// Interfaces para casos de uso específicos
export interface IUsuarioRegistro {
    nome: string;
    email: string;
    senha?: string;
}

export interface IUsuarioLogin {
    email: string;
    senha?: string;
}

export interface IUsuarioGoogleAuth {
    nome?: string;
    email: string;
    google_id: string;
}

export interface IUsuarioAtualizacao {
    nickname?: string;
    name?: string;
    bio?: string;
    is_private?: boolean;
    photo_url?: string;
    profile_completed?: boolean;
}


class Usuario {
    id: any;
    nome: string;
    email: string;
    senha?: string; // Somente para criação
    googleId?: string;
    senhaHash?: string;
    apelido?: string;
    bio?: string;
    site?: string;
    urlFoto?: string;
    privado: boolean;
    perfilCompleto: boolean;
    seguidores: any[];
    seguindo: any[];
    dataCriacao?: Date;
    dataAtualizacao?: Date;

    constructor(data: Partial<IUsuario> & { senha?: string }) {
        this.id = data.id;
        this.nome = data.nome || '';
        this.email = data.email || '';
        this.senha = data.senha;
        this.googleId = data.googleId;
        this.senhaHash = data.senhaHash;
        this.apelido = data.apelido;
        this.bio = data.bio;
        this.site = data.site;
        this.urlFoto = data.urlFoto;
        this.privado = data.privado || false;
        this.perfilCompleto = data.perfilCompleto || false;
        this.seguidores = data.seguidores || [];
        this.seguindo = data.seguindo || [];
        this.dataCriacao = data.dataCriacao;
        this.dataAtualizacao = data.dataAtualizacao;
    }

    async criptografarSenha(): Promise<void> {
        if (this.senha) {
            const salt = await bcrypt.genSalt(10);
            this.senhaHash = await bcrypt.hash(this.senha, salt);
        }
    }

    paraBancoDeDados(): IUsuarioDB {
        const data: IUsuarioDB = {
            id: this.id,
            name: this.nome,
            email: this.email,
            nickname: this.apelido,
            bio: this.bio,
            website: this.site,
            photo_url: this.urlFoto,
            is_private: this.privado,
            profile_completed: this.perfilCompleto,
        };
        if (this.senhaHash) {
            data.password_hash = this.senhaHash;
        }
        if (this.googleId) {
            data.google_id = this.googleId;
        }
        return data;
    }

    static deBancoDeDados(dbData: IUsuarioDB): Usuario | null {
        if (!dbData) {
            return null;
        }

        return new Usuario({
            id: dbData.id,
            nome: dbData.name || '',
            email: dbData.email || '',
            googleId: dbData.google_id,
            senhaHash: dbData.password_hash,
            apelido: dbData.nickname,
            bio: dbData.bio,
            site: dbData.website,
            urlFoto: dbData.photo_url,
            privado: dbData.is_private,
            perfilCompleto: dbData.profile_completed,
            dataCriacao: dbData.created_at,
            dataAtualizacao: dbData.updated_at,
            seguidores: dbData.seguidores || [],
            seguindo: dbData.seguindo || [],
        });
    }

    paraRespostaHttp(): any {
        return {
            id: this.id,
            nome: this.nome,
            email: this.email,
            apelido: this.apelido,
            bio: this.bio,
            site: this.site,
            urlFoto: this.urlFoto,
            privado: this.privado,
            perfilCompleto: this.perfilCompleto,
            contagemSeguidores: this.seguidores.length,
            contagemSeguindo: this.seguindo.length,
            dataCriacao: this.dataCriacao,
            dataAtualizacao: this.dataAtualizacao,
        };
    }
}

export default Usuario;
