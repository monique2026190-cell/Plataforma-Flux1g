
// backend/Repositorios/Repositorio.Publicacao.Marketplace.js
import MarketplaceDB from '../database/GestaoDeDados/PostgreSQL/Consultas.Publicacao.Marketplace.js';

/**
 * O Repositório atua como uma camada de abstração entre o serviço e as consultas de banco de dados.
 */

const createItem = async (itemData) => {
    return MarketplaceDB.create(itemData);
};

const findAllItems = async (options) => {
    return MarketplaceDB.findAll(options);
};

const findItemById = async (itemId) => {
    return MarketplaceDB.findById(itemId);
};

const updateItem = async (itemId, updates) => {
    return MarketplaceDB.update(itemId, updates);
};

const deleteItem = async (itemId) => {
    return MarketplaceDB.remove(itemId);
};

export default {
    createItem,
    findAllItems,
    findItemById,
    updateItem,
    deleteItem
};
