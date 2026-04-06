
// backend/models/Models.Estrutura.Usuario.ts

import bcrypt from 'bcryptjs';

interface IUsuarioData {
    id?: any;
    nome?: string;
    email?: string;
    senha?: string;
    google_id?: string;
    senha_hash?: string;
    apelido?: string;
    bio?: string;
    site?: string;
    urlFoto?: string;
    privado?: boolean;
    perfilCompleto?: boolean;
    seguidores?: any[];
    seguindo?: any[];
    dataCriacao?: Date;
    dataAtualizacao?: Date;
    name?: string; // for deBancoDeDados compatibility
    password_hash?: string; // for deBancoDeDados compatibility
    nickname?: string; // for deBancoDeDados compatibility
    website?: string; // for deBancoDeDados compatibility
    photo_url?: string; // for deBancoDeDados compatibility
    is_private?: boolean; // for deBancoDeDados compatibility
    profile_completed?: boolean; // for deBancoDeDados compatibility
    created_at?: Date; // for deBancoDeDados compatibility
    updated_at?: Date; // for deBancoDeDados compatibility
}

class Usuario {
    id?: any;
    nome: string;
    email: string;
    senha?: string;
    google_id?: string;
    senha_hash?: string;
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

    constructor(data: IUsuarioData) {
        this.id = data.id;
        this.nome = data.nome || data.name || '';
        this.email = data.email || '';
        this.senha = data.senha;
        this.google_id = data.google_id;
        this.senha_hash = data.senha_hash || data.password_hash;
        this.apelido = data.apelido || data.nickname;
        this.bio = data.bio;
        this.site = data.site || data.website;
        this.urlFoto = data.urlFoto || data.photo_url;
        this.privado = data.privado || data.is_private || false;
        this.perfilCompleto = data.perfilCompleto || data.profile_completed || false;
        this.seguidores = data.seguidores || [];
        this.seguindo = data.seguindo || [];
        this.dataCriacao = data.dataCriacao || data.created_at;
        this.dataAtualizacao = data.dataAtualizacao || data.updated_at;
    }

    async criptografarSenha(): Promise<void> {
        if (this.senha) {
            const salt = await bcrypt.genSalt(10);
            this.senha_hash = await bcrypt.hash(this.senha, salt);
        }
    }

    paraBancoDeDados(): any {
        const data: any = {
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
        if (this.senha_hash) {
            data.password_hash = this.senha_hash;
        }
        if (this.google_id) {
            data.google_id = this.google_id;
        }
        return data;
    }

    static deBancoDeDados(dbData: any): Usuario | null {
        if (!dbData) {
            return null;
        }

        return new Usuario({
            id: dbData.id,
            nome: dbData.name,
            email: dbData.email,
            google_id: dbData.google_id,
            senha_hash: dbData.password_hash,
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
        const nomeGarantido = this.nome || (this.email ? this.email.split('@')[0] : 'Usuário Anônimo');

        return {
            id: this.id,
            nome: nomeGarantido,
            name: nomeGarantido, // Compatibilidade
            email: this.email,
            apelido: this.apelido,
            nickname: this.apelido, // Compatibilidade
            bio: this.bio,
            site: this.site,
            website: this.site, // Compatibilidade
            urlFoto: this.urlFoto,
            photo_url: this.urlFoto, // Compatibilidade
            privado: this.privado,
            is_private: this.privado, // Compatibilidade
            perfilCompleto: this.perfilCompleto,
            profile_completed: this.perfilCompleto, // Compatibilidade
            contagemSeguidores: (this.seguidores || []).length,
            contagemSeguindo: (this.seguindo || []).length,
            dataCriacao: this.dataCriacao,
            dataAtualizacao: this.dataAtualizacao,
        };
    }
}

export default Usuario;
