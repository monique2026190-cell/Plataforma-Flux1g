
// backend/ServicosBackend/Servicos.Publicacao.Comentarios.Feed.js
import { createCommentRepository } from '../Repositorios/Repositorio.Estrutura.Comentarios.js';
import Comment from '../models/Models.Estrutura.Comentarios.js';

const FeedCommentRepository = createCommentRepository('feed_comments', 'post_id');

const checkPermissions = (userId, commentModel) => {
    if (!commentModel || !commentModel.authorId) {
        throw new Error('Incomplete comment data for permission check.');
    }
    return commentModel.authorId === userId;
};

const createComment = async (commentBody, postId, userId) => {
    const { content } = commentBody;
    if (!content) {
        throw new Error('Comment content cannot be empty.');
    }

    const newComment = new Comment({
        postId: postId,
        authorId: userId,
        content: content
    });

    const createdComment = await FeedCommentRepository.createComment(newComment.toDatabaseFormat());
    const commentModel = Comment.fromDatabase(createdComment);
    return commentModel.toHttpResponse();
};

const getCommentsByPostId = async (postId, options) => {
    if (!postId) {
        throw new Error('Post ID is required to fetch comments.');
    }
    const queryOptions = { limit: 10, offset: 0, ...options };
    const commentsFromDb = await FeedCommentRepository.findCommentsByParentId(postId, queryOptions);
    
    return commentsFromDb.map(data => {
        const commentModel = Comment.fromDatabase(data);
        return commentModel.toHttpResponse();
    });
};

const updateComment = async (commentId, updates, userId) => {
    const { content } = updates;
    if (!content) {
        throw new Error('Update content cannot be empty.');
    }

    const commentData = await FeedCommentRepository.findCommentById(commentId);
    if (!commentData) {
        throw new Error('Comment not found.');
    }

    const commentModel = Comment.fromDatabase(commentData);

    if (!checkPermissions(userId, commentModel)) {
        throw new Error('You do not have permission to edit this comment.');
    }

    const updatedComment = await FeedCommentRepository.updateComment(commentId, { content });
    const updatedModel = Comment.fromDatabase(updatedComment);
    return updatedModel.toHttpResponse();
};

const deleteComment = async (commentId, userId) => {
    const commentData = await FeedCommentRepository.findCommentById(commentId);
    if (!commentData) {
        throw new Error('Comment not found.');
    }
    
    const commentModel = Comment.fromDatabase(commentData);

    if (!checkPermissions(userId, commentModel)) {
        throw new Error('You do not have permission to delete this comment.');
    }

    await FeedCommentRepository.deleteComment(commentId);
};

export default {
    createComment,
    getCommentsByPostId,
    updateComment,
    deleteComment
};
