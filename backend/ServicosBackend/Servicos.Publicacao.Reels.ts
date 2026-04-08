
// backend/ServicosBackend/Servicos.Publicacao.Reels.ts
import repositorioReels from '../Repositorios/Repositorio.Publicacao.Reels.js';
import Reel from '../models/Models.Estrutura.Publicacao.Reels.js';

class AppError extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
    }
}

const criarReel = async (reelData: any, user: any) => {
    if (!user || !user.id) {
        throw new AppError('Autenticação necessária para criar um reel.', 401);
    }

    const novoReel = new Reel({
        usuarioId: user.id,
        descricao: reelData.caption,
        urlVideo: reelData.videoUrl,
        idMusica: reelData.music
    });

    if (!novoReel.urlVideo) {
        throw new AppError('A URL do vídeo é obrigatória.', 400);
    }

    const reelCriadoDb = await repositorioReels.createReel(novoReel.paraBancoDeDados());
    const reel = Reel.deBancoDeDados(reelCriadoDb);

    if (!reel) {
        throw new AppError('Falha ao mapear o reel criado a partir dos dados do banco.', 500);
    }

    return reel.paraRespostaHttp();
};

const obterTodosOsReels = async (options: any) => {
    const reelsDb = await repositorioReels.findAllReels(options);
    const reels = reelsDb
        .map(Reel.deBancoDeDados)
        .filter((r: Reel | null): r is Reel => r !== null);
        
    return reels.map((r: Reel) => r.paraRespostaHttp());
};

const obterReelPorId = async (reelId: any) => {
    const reelDb = await repositorioReels.findReelById(reelId);
    if (!reelDb) {
        throw new AppError('Reel não encontrado.', 404);
    }
    const reel = Reel.deBancoDeDados(reelDb);
    if (!reel) {
        throw new AppError('Falha ao mapear o reel a partir dos dados do banco.', 500);
    }
    return reel.paraRespostaHttp();
};

const atualizarReel = async (reelId: any, reelData: any, user: any) => {
    if (!user || !user.id) {
        throw new AppError('Autenticação necessária.', 401);
    }

    const reelExistente = await obterReelPorId(reelId);

    if (reelExistente.usuarioId !== user.id) {
        throw new AppError('Usuário não autorizado a editar este reel.', 403);
    }

    const reelAtualizadoDb = await repositorioReels.updateReel(reelId, reelData);
    const reelAtualizado = Reel.deBancoDeDados(reelAtualizadoDb);

    if (!reelAtualizado) {
        throw new AppError('Falha ao mapear o reel atualizado a partir dos dados do banco.', 500);
    }

    return reelAtualizado.paraRespostaHttp();
};

const deletarReel = async (reelId: any, user: any) => {
    if (!user || !user.id) {
        throw new AppError('Autenticação necessária.', 401);
    }

    const reelExistente = await obterReelPorId(reelId);

    if (reelExistente.usuarioId !== user.id) {
        throw new AppError('Usuário não autorizado a deletar este reel.', 403);
    }

    const sucesso = await repositorioReels.deleteReel(reelId);
    if (!sucesso) {
        throw new AppError('Falha ao deletar o reel.', 500);
    }

    return { message: 'Reel deletado com sucesso.' };
};

export default {
    criarReel,
    obterTodosOsReels,
    obterReelPorId,
    atualizarReel,
    deletarReel,
};
