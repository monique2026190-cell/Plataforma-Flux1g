
// backend/Repositorios/Repositorio.Publicacao.Reels.js
import ReelsDB from '../database/GestaoDeDados/PostgreSQL/Consultas.Publicacao.Reels.js';

/**
 * O Repositório atua como uma camada de abstração entre o serviço e as consultas de banco de dados,
 * permitindo uma separação clara de responsabilidades.
 */

const createReel = async (reelData) => {
    return ReelsDB.create(reelData);
};

const findAllReels = async (options) => {
    return ReelsDB.findAll(options);
};

const findReelById = async (reelId) => {
    return ReelsDB.findById(reelId);
};

const updateReel = async (reelId, updates) => {
    return ReelsDB.update(reelId, updates);
};

const deleteReel = async (reelId) => {
    return ReelsDB.remove(reelId);
};

export default {
    createReel,
    findAllReels,
    findReelById,
    updateReel,
    deleteReel
};
