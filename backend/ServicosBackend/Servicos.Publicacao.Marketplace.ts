
// backend/ServicosBackend/Servicos.Publicacao.Marketplace.ts
import repositorioMarketplace from '../Repositorios/Repositorio.Publicacao.Marketplace.js';
import ItemMarketplace from '../models/Models.Estrutura.Publicacao.Marketplace.js';

class AppError extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
    }
}

const criarItem = async (itemData: any, user: any) => {
    if (!user || !user.id) {
        throw new AppError('Autenticação necessária para criar um item.', 401);
    }

    const novoItem = new ItemMarketplace({
        usuarioId: user.id,
        titulo: itemData.name,
        descricao: itemData.description,
        preco: itemData.price,
        categoria: itemData.category,
        localizacao: itemData.location,
        urlsImagens: itemData.imageUrls
    });

    if (!novoItem.titulo || !novoItem.preco) {
        throw new AppError('Título e preço são obrigatórios.', 400);
    }

    const itemCriadoDb = await repositorioMarketplace.createItem(novoItem.paraBancoDeDados());
    const item = ItemMarketplace.deBancoDeDados(itemCriadoDb);

    if (!item) {
        throw new AppError('Falha ao mapear o item criado a partir dos dados do banco.', 500);
    }

    return item.paraRespostaHttp();
};

const obterTodosOsItens = async (options: any) => {
    const itensDb = await repositorioMarketplace.findAllItems(options);
    const itens = itensDb
        .map(ItemMarketplace.deBancoDeDados)
        .filter((item: ItemMarketplace | null): item is ItemMarketplace => item !== null);
        
    return itens.map((item: ItemMarketplace) => item.paraRespostaHttp());
};

const obterItemPorId = async (itemId: any) => {
    const itemDb = await repositorioMarketplace.findItemById(itemId);
    if (!itemDb) {
        throw new AppError('Item não encontrado.', 404);
    }
    const item = ItemMarketplace.deBancoDeDados(itemDb);
    if (!item) {
        throw new AppError('Falha ao mapear o item a partir dos dados do banco.', 500);
    }
    return item.paraRespostaHttp();
};

const atualizarItem = async (itemId: any, itemData: any, user: any) => {
    if (!user || !user.id) {
        throw new AppError('Autenticação necessária.', 401);
    }

    const itemExistente = await obterItemPorId(itemId);

    if (itemExistente.usuarioId !== user.id) {
        throw new AppError('Usuário não autorizado a editar este item.', 403);
    }

    const itemAtualizadoDb = await repositorioMarketplace.updateItem(itemId, itemData);
    const itemAtualizado = ItemMarketplace.deBancoDeDados(itemAtualizadoDb);

    if (!itemAtualizado) {
        throw new AppError('Falha ao mapear o item atualizado a partir dos dados do banco.', 500);
    }

    return itemAtualizado.paraRespostaHttp();
};

const deletarItem = async (itemId: any, user: any) => {
    if (!user || !user.id) {
        throw new AppError('Autenticação necessária.', 401);
    }

    const itemExistente = await obterItemPorId(itemId);

    if (itemExistente.usuarioId !== user.id) {
        throw new AppError('Usuário não autorizado a deletar este item.', 403);
    }

    const sucesso = await repositorioMarketplace.deleteItem(itemId);
    if (!sucesso) {
        throw new AppError('Falha ao deletar o item.', 500);
    }

    return { message: 'Item deletado com sucesso.' };
};

export default {
    criarItem,
    obterTodosOsItens,
    obterItemPorId,
    atualizarItem,
    deletarItem,
};
