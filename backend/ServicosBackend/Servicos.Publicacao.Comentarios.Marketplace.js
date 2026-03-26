
// backend/ServicosBackend/Servicos.Publicacao.Comentarios.Marketplace.js
import { createCommentRepository } from '../Repositorios/Repositorio.Estrutura.Comentarios.js';
import Comentario from '../models/Models.Estrutura.Comentarios.js';

const RepositorioComentariosMarketplace = createCommentRepository('marketplace_comments', 'item_id');

const checkPermissions = (userId, comentarioModel) => {
    if (!comentarioModel || !comentarioModel.autorId) {
        throw new Error('Dados do comentário incompletos para verificação de permissão.');
    }
    return comentarioModel.autorId === userId;
};

const criarComentario = async (itemId, userId, content) => {
    if (!content) {
        throw new Error('O conteúdo do comentário é obrigatório.');
    }

    const novoComentario = new Comentario({
        postId: itemId,
        autorId: userId,
        conteudo: content
    });

    const comentarioCriado = await RepositorioComentariosMarketplace.createComment(novoComentario.paraBancoDeDados());
    const comentarioModel = Comentario.deBancoDeDados(comentarioCriado);
    return comentarioModel.paraRespostaHttp();
};

const obterComentariosPorItemId = async (itemId) => {
    const comentariosDoBanco = await RepositorioComentariosMarketplace.findCommentsByParentId(itemId, {});

    return comentariosDoBanco.map(dados => {
        const comentarioModel = Comentario.deBancoDeDados(dados);
        return comentarioModel.paraRespostaHttp();
    });
};

const atualizarComentario = async (commentId, userId, content) => {
    if (!content) {
        throw new Error('O conteúdo do comentário é obrigatório para atualização.');
    }

    const dadosComentario = await RepositorioComentariosMarketplace.findCommentById(commentId);
    if (!dadosComentario) {
        throw new Error('Comentário não encontrado.');
    }

    const comentarioModel = Comentario.deBancoDeDados(dadosComentario);

    if (!checkPermissions(userId, comentarioModel)) {
        throw new Error('Acesso negado. Você só pode editar seus próprios comentários.');
    }

    const comentarioAtualizado = await RepositorioComentariosMarketplace.updateComment(commentId, { content });
    const modeloAtualizado = Comentario.deBancoDeDados(comentarioAtualizado);
    return modeloAtualizado.paraRespostaHttp();
};

const deletarComentario = async (commentId, userId) => {
    const dadosComentario = await RepositorioComentariosMarketplace.findCommentById(commentId);
    if (!dadosComentario) {
        throw new Error('Comentário não encontrado.');
    }

    const comentarioModel = Comentario.deBancoDeDados(dadosComentario);

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
