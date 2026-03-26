
// backend/Repositorios/Repositorio.Estrutura.Comentarios.js
import CommentQueries from '../database/GestaoDeDados/PostgreSQL/Consultas.Estrutura.Comentarios.js';

const createComment = (tableName, parentIdColumn) => async (commentData) => {
    return CommentQueries.createComment(tableName, parentIdColumn, commentData);
};

const findCommentsByParentId = (tableName, parentIdColumn) => async (parentId, options) => {
    return CommentQueries.findCommentsByParentId(tableName, parentIdColumn, parentId, options);
};

const findCommentById = (tableName) => async (commentId) => {
    return CommentQueries.findCommentById(tableName, commentId);
};

const updateComment = (tableName) => async (commentId, updates) => {
    return CommentQueries.updateComment(tableName, commentId, updates);
};

const deleteComment = (tableName) => async (commentId) => {
    return CommentQueries.deleteComment(tableName, commentId);
};

// Factory to create a comment repository for a specific entity
const createCommentRepository = (tableName, parentIdColumn) => ({
    createComment: createComment(tableName, parentIdColumn),
    findCommentsByParentId: findCommentsByParentId(tableName, parentIdColumn),
    findCommentById: findCommentById(tableName),
    updateComment: updateComment(tableName),
    deleteComment: deleteComment(tableName),
});

export { createCommentRepository };
