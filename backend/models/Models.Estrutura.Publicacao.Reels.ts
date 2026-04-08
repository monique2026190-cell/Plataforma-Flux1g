
interface IAutor {
    username: string;
    avatarUrl: string;
}

interface IPublicacaoReels {
    id?: number;
    usuarioId: number;
    urlVideo: string;
    descricao?: string;
    idMusica?: number;
    hashtags?: string[];
    localizacao?: string;
    dataCriacao?: Date;
    dataAtualizacao?: Date;
    contagemCurtidas?: number;
    contagemComentarios?: number;
    autor?: IAutor;
}

class PublicacaoReels implements IPublicacaoReels {
    id?: number;
    usuarioId: number;
    urlVideo: string;
    descricao?: string;
    idMusica?: number;
    hashtags: string[];
    localizacao?: string;
    dataCriacao?: Date;
    dataAtualizacao?: Date;
    contagemCurtidas: number;
    contagemComentarios: number;
    autor?: IAutor;

    constructor({
        id,
        usuarioId,
        urlVideo,
        descricao,
        idMusica,
        hashtags = [],
        localizacao,
        dataCriacao,
        dataAtualizacao,
        contagemCurtidas = 0,
        contagemComentarios = 0,
        autor
    }: IPublicacaoReels) {
        this.id = id;
        this.usuarioId = usuarioId;
        this.urlVideo = urlVideo;
        this.descricao = descricao;
        this.idMusica = idMusica;
        this.hashtags = hashtags;
        this.localizacao = localizacao;
        this.dataCriacao = dataCriacao;
        this.dataAtualizacao = dataAtualizacao;
        this.contagemCurtidas = contagemCurtidas;
        this.contagemComentarios = contagemComentarios;
        this.autor = autor;
    }

    paraBancoDeDados() {
        return {
            user_id: this.usuarioId,
            video_url: this.urlVideo,
            description: this.descricao,
            music_id: this.idMusica,
            hashtags: this.hashtags,
            location: this.localizacao
        };
    }

    static deBancoDeDados(dados: any): PublicacaoReels | null {
        if (!dados) return null;

        const autor: IAutor = {
            username: dados.username,
            avatarUrl: dados.avatar_url
        };

        return new PublicacaoReels({
            id: dados.id,
            usuarioId: dados.user_id,
            urlVideo: dados.video_url,
            descricao: dados.description,
            idMusica: dados.music_id,
            hashtags: Array.isArray(dados.hashtags) ? dados.hashtags : JSON.parse(dados.hashtags || '[]'),
            localizacao: dados.location,
            dataCriacao: dados.created_at,
            dataAtualizacao: dados.updated_at,
            contagemCurtidas: parseInt(dados.likes_count, 10) || 0,
            contagemComentarios: parseInt(dados.comments_count, 10) || 0,
            autor: autor
        });
    }

    paraRespostaHttp() {
        return {
            id: this.id,
            usuarioId: this.usuarioId,
            urlVideo: this.urlVideo,
            descricao: this.descricao,
            idMusica: this.idMusica,
            hashtags: this.hashtags,
            localizacao: this.localizacao,
            dataCriacao: this.dataCriacao,
            dataAtualizacao: this.dataAtualizacao,
            contagemCurtidas: this.contagemCurtidas,
            contagemComentarios: this.contagemComentarios,
            autor: this.autor
        };
    }
}

export default PublicacaoReels;
