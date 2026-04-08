
// backend/ServicosBackend/Servicos.Publicacao.Comentarios.Feed.ts
import { createCommentRepository } from '../Repositorios/Repositorio.Estrutura.Comentarios.js';
import Comment from '../models/Models.Estrutura.Comentarios.js';

const FeedCommentRepository = createCommentRepository('feed_comments', 'post_id');

const checkPermissions = (userId: any, commentModel: any) => {
    if (!commentModel || !commentModel.autorId) {
        throw new Error('Incomplete comment data for permission check.');
    }
    return commentModel.autorId === userId;
};

const criarComentario = async (commentBody: any, postId: any, userId: any) => {
    const { content } = commentBody;
    if (!content) {
        throw new Error('Comment content cannot be empty.');
    }

    const newComment = new Comment({
        postId: postId,
        autorId: userId,
        conteudo: content
    });

    const createdComment = await FeedCommentRepository.createComment(newComment.paraBancoDeDados());
    const commentModel = Comment.deBancoDeDados(createdComment);
    if (!commentModel) {
        throw new Error('Failed to create comment model.');
    }
    return commentModel.paraRespostaHttp();
};

const obterComentariosPorPostId = async (postId: any, options: any) => {
    if (!postId) {
        throw new Error('Post ID is required to fetch comments.');
    }
    const queryOptions = { limit: 10, offset: 0, ...options };
    const commentsFromDb = await FeedCommentRepository.findCommentsByParentId(postId, queryOptions);
    
    return commentsFromDb.map((data: any) => {
        const commentModel = Comment.deBancoDeDados(data);
        if (!commentModel) {
            return null;
        }
        return commentModel.paraRespostaHttp();
    }).filter((comment: any) => comment !== null);
};

const atualizarComentario = async (commentId: any, updates: any, userId: any) => {
    const { content } = updates;
    if (!content) {
        throw new Error('Update content cannot be empty.');
    }

    const commentData = await FeedCommentRepository.findCommentById(commentId);
    if (!commentData) {
        throw new Error('Comment not found.');
    }

    const commentModel = Comment.deBancoDeDados(commentData);

    if (!checkPermissions(userId, commentModel)) {
        throw new Error('You do not have permission to edit this comment.');
    }

    const updatedComment = await FeedCommentRepository.updateComment(commentId, { conteudo: content });
    const updatedModel = Comment.deBancoDeDados(updatedComment);
    if (!updatedModel) {
        throw new Error('Failed to update comment model.');
    }
    return updatedModel.paraRespostaHttp();
};

const deletarComentario = async (commentId: any, userId: any) => {
    const commentData = await FeedCommentRepository.findCommentById(commentId);
    if (!commentData) {
        throw new Error('Comment not found.');
    }
    
    const commentModel = Comment.deBancoDeDados(commentData);

    if (!checkPermissions(userId, commentModel)) {
        throw new Error('You do not have permission to delete this comment.');
    }

    await FeedCommentRepository.deleteComment(commentId);
};

export default {
    criarComentario,
    obterComentariosPorPostId,
    atualizarComentario,
    deletarComentario
};
