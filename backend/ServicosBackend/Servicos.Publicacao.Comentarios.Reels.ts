
// backend/ServicosBackend/Servicos.Publicacao.Comentarios.Reels.ts
import { createCommentRepository } from '../Repositorios/Repositorio.Estrutura.Comentarios.js';
import Comentario from '../models/Models.Estrutura.Comentarios.js';

const RepositorioComentariosReels = createCommentRepository('reel_comments', 'reel_id');

const checkPermissions = (userId: any, comentarioModel: Comentario) => {
    if (!comentarioModel.autorId) {
        throw new Error('Dados do comentário incompletos para verificação de permissão.');
    }
    return comentarioModel.autorId === userId;
};

const criarComentario = async (reelId: any, userId: any, content: any) => {
    if (!content) {
        throw new Error('O conteúdo do comentário não pode estar vazio.');
    }

    const novoComentario = new Comentario({
        postId: reelId, // No contexto de Reels, postId é o reelId
        autorId: userId,
        conteudo: content,
    });

    const comentarioCriado = await RepositorioComentariosReels.createComment(novoComentario.paraBancoDeDados());
    const comentarioModel = Comentario.deBancoDeDados(comentarioCriado);
    if (!comentarioModel) {
        throw new Error('Falha ao mapear o comentário criado a partir dos dados do banco.');
    }
    return comentarioModel.paraRespostaHttp();
};

const obterComentariosPorReelId = async (reelId: any, options: any) => {
    const comentariosDoBanco = await RepositorioComentariosReels.findCommentsByParentId(reelId, options);

    return comentariosDoBanco
        .map((dados: any) => Comentario.deBancoDeDados(dados))
        .filter((comentarioModel: Comentario | null): comentarioModel is Comentario => comentarioModel !== null)
        .map((comentarioModel: Comentario) => comentarioModel.paraRespostaHttp());
};

const atualizarComentario = async (commentId: any, userId: any, content: any) => {
    if (!content) {
        throw new Error('O conteúdo para atualização não pode ser vazio.');
    }

    const dadosComentario = await RepositorioComentariosReels.findCommentById(commentId);
    if (!dadosComentario) {
        throw new Error('Comentário não encontrado.');
    }

    const comentarioModel = Comentario.deBancoDeDados(dadosComentario);
    if (!comentarioModel) {
        throw new Error('Falha ao mapear o comentário a partir dos dados do banco.');
    }

    if (!checkPermissions(userId, comentarioModel)) {
        throw new Error('Você não tem permissão para editar este comentário.');
    }

    const comentarioAtualizado = await RepositorioComentariosReels.updateComment(commentId, { conteudo: content });
    const modeloAtualizado = Comentario.deBancoDeDados(comentarioAtualizado);
    if (!modeloAtualizado) {
        throw new Error('Falha ao mapear o comentário atualizado a partir dos dados do banco.');
    }
    return modeloAtualizado.paraRespostaHttp();
};

const deletarComentario = async (commentId: any, userId: any) => {
    const dadosComentario = await RepositorioComentariosReels.findCommentById(commentId);
    if (!dadosComentario) {
        throw new Error('Comentário não encontrado.');
    }

    const comentarioModel = Comentario.deBancoDeDados(dadosComentario);
    if (!comentarioModel) {
        throw new Error('Falha ao mapear o comentário a partir dos dados do banco.');
    }

    if (!checkPermissions(userId, comentarioModel)) {
        throw new Error('Você não tem permissão para deletar este comentário.');
    }

    await RepositorioComentariosReels.deleteComment(commentId);
};

export default {
    criarComentario, // Renomeado
    obterComentariosPorReelId, // Renomeado
    atualizarComentario, // Renomeado
    deletarComentario // Renomeado
};
