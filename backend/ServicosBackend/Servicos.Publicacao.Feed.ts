
// backend/ServicosBackend/Servicos.Publicacao.Feed.ts
import { v4 as uuidv4 } from 'uuid';
import repositorioPublicacaoFeed from '../Repositorios/Repositorio.Publicacao.Feed.js';
import PublicacaoFeed from '../models/Models.Estrutura.Publicacao.Feed.js';

class AppError extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
    }
}

const criarPost = async (postData: any, user: any) => {
    if (!user || !user.id) {
        throw new AppError('Autenticação necessária para criar um post.', 401);
    }

    const novaPublicacao = new PublicacaoFeed({
        autorId: user.id,
        conteudo: postData.conteudo,
        urlMidia: postData.mediaUrl,
        idPostPai: postData.parentPostId,
        tipo: postData.type,
        opcoesEnquete: postData.pollOptions,
        linkCta: postData.ctaLink,
        textoCta: postData.ctaText
    });

    if (!novaPublicacao.conteudo || novaPublicacao.conteudo.trim().length === 0) {
        throw new AppError('O conteúdo do post é obrigatório.', 400);
    }

    const dadosParaBanco = novaPublicacao.paraBancoDeDados();
    const postCriadoDb = await repositorioPublicacaoFeed.criar(dadosParaBanco);
    const post = PublicacaoFeed.deBancoDeDados(postCriadoDb);

    if (!post) { // CORRIGIDO: Verificação de nulo
        throw new AppError('Falha ao mapear o post criado a partir dos dados do banco.', 500);
    }

    return post.paraRespostaHttp();
};

const obterTodosOsPosts = async (options: any) => {
    const { data: postsDb, nextCursor } = await repositorioPublicacaoFeed.obterTodos(options);
    const posts = postsDb
        .map(PublicacaoFeed.deBancoDeDados)
        .filter((p: PublicacaoFeed | null): p is PublicacaoFeed => p !== null); // CORRIGIDO: Filtra nulos
    
    const postsHttp = posts.map((p: PublicacaoFeed) => p.paraRespostaHttp());

    return { data: postsHttp, nextCursor };
};

const obterPostPorId = async (postId: any) => {
    const postDb = await repositorioPublicacaoFeed.obterPorId(postId);
    if (!postDb) {
        throw new AppError('Post não encontrado.', 404);
    }
    const post = PublicacaoFeed.deBancoDeDados(postDb);
    if (!post) { // CORRIGIDO: Verificação de nulo
        throw new AppError('Falha ao mapear o post a partir dos dados do banco.', 500);
    }
    return post.paraRespostaHttp();
};

const atualizarPost = async (postId: any, postData: any, user: any) => {
    if (!user || !user.id) {
        throw new AppError('Autenticação necessária.', 401);
    }

    const postExistente = await obterPostPorId(postId);

    if (postExistente.autorId !== user.id) {
        throw new AppError('Usuário não autorizado a editar este post.', 403);
    }

    const dadosParaAtualizar = {
        conteudo: postData.conteudo || postExistente.conteudo
    };

    const postAtualizadoDb = await repositorioPublicacaoFeed.atualizar(postId, dadosParaAtualizar);
    const postAtualizado = PublicacaoFeed.deBancoDeDados(postAtualizadoDb);
    
    if (!postAtualizado) { // CORRIGIDO: Verificação de nulo
        throw new AppError('Falha ao mapear o post atualizado a partir dos dados do banco.', 500);
    }
    
    return postAtualizado.paraRespostaHttp();
};

const deletarPost = async (postId: any, user: any) => {
    if (!user || !user.id) {
        throw new AppError('Autenticação necessária.', 401);
    }

    const postExistente = await obterPostPorId(postId);

    if (postExistente.autorId !== user.id) {
        throw new AppError('Usuário não autorizado a deletar este post.', 403);
    }

    const sucesso = await repositorioPublicacaoFeed.remover(postId);
    if (!sucesso) {
        throw new AppError('Falha ao deletar o post.', 500);
    }

    return { message: 'Post deletado com sucesso.' };
};

export default {
    criarPost,
    obterTodosOsPosts,
    obterPostPorId,
    atualizarPost,
    deletarPost,
};
