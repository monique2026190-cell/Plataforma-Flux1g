
// backend/ServicosBackend/Servicos.Publicacao.Comentarios.Marketplace.ts
import { createCommentRepository } from '../Repositorios/Repositorio.Estrutura.Comentarios.js';
import Comentario from '../models/Models.Estrutura.Comentarios.js';

const RepositorioComentariosMarketplace = createCommentRepository('marketplace_comments', 'item_id');

const checkPermissions = (userId: any, comentarioModel: Comentario) => {
    if (!comentarioModel.autorId) {
        throw new Error('Dados do comentário incompletos para verificação de permissão.');
    }
    return comentarioModel.autorId === userId;
};

const criarComentario = async (itemId: any, userId: any, content: any) => {
    if (!content) {
        throw new Error('O conteúdo do comentário é obrigatório.');
    }

    const novoComentario = new Comentario({
        postId: itemId,
        autorId: userId,
        conteudo: content,
    });

    const comentarioCriado = await RepositorioComentariosMarketplace.createComment(novoComentario.paraBancoDeDados());
    const comentarioModel = Comentario.deBancoDeDados(comentarioCriado);
    if (!comentarioModel) {
        throw new Error('Falha ao mapear o comentário criado a partir dos dados do banco.');
    }
    return comentarioModel.paraRespostaHttp();
};

const obterComentariosPorItemId = async (itemId: any) => {
    const comentariosDoBanco = await RepositorioComentariosMarketplace.findCommentsByParentId(itemId, {});

    return comentariosDoBanco
        .map((dados: any) => Comentario.deBancoDeDados(dados))
        .filter((comentarioModel: Comentario | null): comentarioModel is Comentario => comentarioModel !== null)
        .map((comentarioModel: Comentario) => comentarioModel.paraRespostaHttp());
};

const atualizarComentario = async (commentId: any, userId: any, content: any) => {
    if (!content) {
        throw new Error('O conteúdo do comentário é obrigatório para atualização.');
    }

    const dadosComentario = await RepositorioComentariosMarketplace.findCommentById(commentId);
    if (!dadosComentario) {
        throw new Error('Comentário não encontrado.');
    }

    const comentarioModel = Comentario.deBancoDeDados(dadosComentario);
    if (!comentarioModel) {
        throw new Error('Falha ao mapear o comentário a partir dos dados do banco.');
    }

    if (!checkPermissions(userId, comentarioModel)) {
        throw new Error('Acesso negado. Você só pode editar seus próprios comentários.');
    }

    const comentarioAtualizado = await RepositorioComentariosMarketplace.updateComment(commentId, { conteudo: content });
    const modeloAtualizado = Comentario.deBancoDeDados(comentarioAtualizado);
    if (!modeloAtualizado) {
        throw new Error('Falha ao mapear o comentário atualizado a partir dos dados do banco.');
    }
    return modeloAtualizado.paraRespostaHttp();
};

const deletarComentario = async (commentId: any, userId: any) => {
    const dadosComentario = await RepositorioComentariosMarketplace.findCommentById(commentId);
    if (!dadosComentario) {
        throw new Error('Comentário não encontrado.');
    }

    const comentarioModel = Comentario.deBancoDeDados(dadosComentario);
    if (!comentarioModel) {
        throw new Error('Falha ao mapear o comentário a partir dos dados do banco.');
    }

    if (!checkPermissions(userId, comentarioModel)) {
        throw new Error('Acesso negado. Você só pode deletar seus próprios comentários.');
    }

    await RepositorioComentariosMarketplace.deleteComment(commentId);
};

export default {
    criarComentario,
    obterComentariosPorItemId,
    atualizarComentario,
    deletarComentario,
};
