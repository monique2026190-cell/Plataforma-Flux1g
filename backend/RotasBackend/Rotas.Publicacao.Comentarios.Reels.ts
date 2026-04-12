
import express from 'express';
import comentariosReelsControle from '../controles/Controles.Publicacao.Comentarios.Reels.js';

const router = express.Router({ mergeParams: true });

// @route   POST /
// @desc    Criar um comentário em um Reel
// @access  Private
router.post('/', comentariosReelsControle.criarComentario);

// @route   GET /
// @desc    Obter todos os comentários de um Reel
// @access  Public
router.get('/', comentariosReelsControle.obterComentariosPorReelId);

// @route   PUT /:commentId
// @desc    Atualizar um comentário em um Reel
// @access  Private
router.put('/:commentId', comentariosReelsControle.atualizarComentario);

// @route   DELETE /:commentId
// @desc    Deletar um comentário em um Reel
// @access  Private
router.delete('/:commentId', comentariosReelsControle.deletarComentario);

export default router;
