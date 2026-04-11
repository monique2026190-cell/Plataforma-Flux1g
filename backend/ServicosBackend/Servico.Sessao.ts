
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import repositorioSessao from '../Repositorios/Repositorio.Sessao.js';
import servicoUsuario from '../ServicosBackend/Servico.Usuario.js';
import Sessao from '../models/Models.Estrutura.Sessao.js';
import createServicoLogger from '../config/Log.Servicos.Backend.js';
import Usuario from '../models/Models.Estrutura.Usuario.js';
import configFinal from '../config/Variaveis.Backend.js';

const logger = createServicoLogger('Servico.Sessao.ts');

interface PrepararSessaoParams {
    usuario: Usuario;
    dadosRequisicao: { ipAddress?: string; userAgent?: string };
}

const prepararNovaSessao = async ({ usuario, dadosRequisicao }: PrepararSessaoParams) => {
    if (!usuario || !usuario.id) {
        logger.error('Tentativa de criar sessão com dados de usuário inválidos.', { usuario });
        throw new Error('Dados de usuário inválidos para criar a sessão.');
    }

    logger.info(`Preparando nova sessão para o usuário ${usuario.id}.`);

    const accessTokenExpiresIn = '15m'; // 15 minutos
    const refreshTokenExpiresIn = '7d';  // 7 dias

    const accessToken = jwt.sign({ userId: usuario.id }, configFinal.jwtSecret, { expiresIn: accessTokenExpiresIn });
    const refreshToken = jwt.sign({ userId: usuario.id }, configFinal.jwtSecret, { expiresIn: refreshTokenExpiresIn });
    
    const expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 dias a partir de agora

    const dadosSessao = {
        user_id: usuario.id,
        token: refreshToken, // Salva o refresh token no banco de dados
        expires_at,
        ipAddress: dadosRequisicao.ipAddress,
        userAgent: dadosRequisicao.userAgent,
    };
    
    return { accessToken, refreshToken, dadosSessao };
};

const salvarSessao = async (dadosSessaoValidados: any) => {
    logger.info(`Iniciando salvamento da sessão para o usuário ${dadosSessaoValidados.user_id}.`);
    
    const novaSessao = new Sessao({
        id: uuidv4(),
        ...dadosSessaoValidados,
    });

    await repositorioSessao.criar(novaSessao.paraBancoDeDados());
    logger.info(`Sessão para o usuário ${dadosSessaoValidados.user_id} salva com sucesso.`);
};

const encerrarSessao = async (token: string) => {
    logger.info('Iniciando processo de encerramento de sessão.');
    await repositorioSessao.deletarPorToken(token);
    logger.info('Sessão encerrada e removida com sucesso.');
    return { message: 'Logout realizado com sucesso.' };
};

const renovarTokenDeAcesso = async (refreshToken: string) => {
    logger.info('Tentando renovar o token de acesso utilizando o refresh token.');

    try {
        const decoded = jwt.verify(refreshToken, configFinal.jwtSecret) as { userId: string };
        const user_id = decoded.userId;

        const sessao = await repositorioSessao.encontrarPorToken(refreshToken);
        if (!sessao) {
            throw new Error('Sessão não encontrada ou refresh token inválido.');
        }

        const usuario = await servicoUsuario.obterUsuarioPorId(user_id);
        if (!usuario) {
            throw new Error('Usuário não encontrado.');
        }

        const accessTokenExpiresIn = '15m';
        const accessToken = jwt.sign({ userId: usuario.id }, configFinal.jwtSecret, { expiresIn: accessTokenExpiresIn });

        logger.info(`Token de acesso renovado com sucesso para o usuário ${usuario.id}.`);
        return { accessToken, usuario };

    } catch (error: any) {
        logger.error('Erro ao renovar o token de acesso:', { error });
        throw new Error('Não foi possível renovar o token de acesso.');
    }
};


export default {
    prepararNovaSessao,
    salvarSessao,
    encerrarSessao,
    renovarTokenDeAcesso,
};
