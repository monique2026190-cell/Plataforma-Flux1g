
class PublicacaoFeed {
    constructor({
        id,
        autorId,
        conteudo,
        urlMidia,
        idPostPai,
        tipo = 'text',
        opcoesEnquete = null,
        linkCta,
        textoCta,
        conteudoAdulto = false,
        dataCriacao,
        dataAtualizacao,
        // Campos adicionais do autor (via JOIN)
        autor
    }) {
        this.id = id;
        this.autorId = autorId;
        this.conteudo = conteudo;
        this.urlMidia = urlMidia;
        this.idPostPai = idPostPai;
        this.tipo = tipo;
        this.opcoesEnquete = opcoesEnquete;
        this.linkCta = linkCta;
        this.textoCta = textoCta;
        this.conteudoAdulto = conteudoAdulto;
        this.dataCriacao = dataCriacao;
        this.dataAtualizacao = dataAtualizacao;
        this.autor = autor; // Objeto com dados do autor
    }

    paraBancoDeDados() {
        return {
            author_id: this.autorId,
            content: this.conteudo,
            media_url: this.urlMidia,
            parent_post_id: this.idPostPai,
            type: this.tipo,
            poll_options: this.opcoesEnquete,
            cta_link: this.linkCta,
            cta_text: this.textoCta,
            is_adult_content: this.conteudoAdulto
        };
    }

    static deBancoDeDados(dados) {
        if (!dados) return null;

        const autor = {
            username: dados.username,
            avatarUrl: dados.avatar_url,
            nome: dados.name,
            apelido: dados.nickname
        };

        return new PublicacaoFeed({
            id: dados.id,
            autorId: dados.author_id,
            conteudo: dados.content,
            urlMidia: dados.media_url,
            idPostPai: dados.parent_post_id,
            tipo: dados.type,
            opcoesEnquete: dados.poll_options,
            linkCta: dados.cta_link,
            textoCta: dados.cta_text,
            conteudoAdulto: dados.is_adult_content,
            dataCriacao: dados.created_at,
            dataAtualizacao: dados.updated_at,
            autor: autor
        });
    }

    paraRespostaHttp() {
        return {
            id: this.id,
            autorId: this.autorId,
            conteudo: this.conteudo,
            urlMidia: this.urlMidia,
            idPostPai: this.idPostPai,
            tipo: this.tipo,
            opcoesEnquete: this.opcoesEnquete,
            linkCta: this.linkCta,
            textoCta: this.textoCta,
            conteudoAdulto: this.conteudoAdulto,
            dataCriacao: this.dataCriacao,
            dataAtualizacao: this.dataAtualizacao,
            autor: this.autor
        };
    }
}

export default PublicacaoFeed;
