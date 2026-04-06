
// backend/Repositorios/Repositorio.Estrutura.Comentarios.js
import CommentQueries from '../database/GestaoDeDados/PostgreSQL/Consultas.Estrutura.Comentarios.js';

const createComment = (tableName, parentIdColumn) => async (commentData) => {
    return CommentQueries.criar(tableName, parentIdColumn, commentData);
};

const findCommentsByParentId = (tableName, parentIdColumn) => async (parentId, options) => {
    return CommentQueries.buscarPorParentId(tableName, parentIdColumn, parentId, options);
};

const findCommentById = (tableName) => async (commentId) => {
    return CommentQueries.buscarPorId(tableName, commentId);
};

const updateComment = (tableName) => async (commentId, updates) => {
    return CommentQueries.atualizar(tableName, commentId, updates);
};

const deleteComment = (tableName) => async (commentId) => {
    return CommentQueries.deletar(tableName, commentId);
};

// Factory to create a comment repository for a specific entity
export const createCommentRepository = (tableName, parentIdColumn) => ({
    createComment: createComment(tableName, parentIdColumn),
    findCommentsByParentId: findCommentsByParentId(tableName, parentIdColumn),
    findCommentById: findCommentById(tableName),
    updateComment: updateComment(tableName),
    deleteComment: deleteComment(tableName),
});
