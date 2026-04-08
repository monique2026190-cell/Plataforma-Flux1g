
import { v4 as uuidv4 } from 'uuid';
import repositorioSessao from '../Repositorios/Repositorio.Sessao.js';
import Sessao from '../models/Models.Estrutura.Sessao.js';
import createServicoLogger from '../config/Log.Servicos.Backend.js';
import Usuario from '../models/Models.Estrutura.Usuario.js';

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

    // LÓGICA JWT REMOVIDA CONFORME SOLICITADO PARA PERMITIR A COMPILAÇÃO.
    // A autenticação está INSEGURA.
    const token = `fake-token-${usuario.id}-${uuidv4()}`;
    const expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Expira em 7 dias

    const dadosSessao = {
        user_id: usuario.id,
        token,
        expires_at,
        ipAddress: dadosRequisicao.ipAddress,
        userAgent: dadosRequisicao.userAgent,
    };
    
    return { token, dadosSessao };
};

const salvarSessao = async (dadosSessaoValidados: any) => {
    logger.info(`Iniciando salvamento da sessão para o usuário ${dadosSessaoValidados.user_id}.`);
    
    const novaSessao = new Sessao({
        id: uuidv4(),
        ...dadosSessaoValidados,
    });

    // Usando o método mockado para evitar erros de compilação
    await (repositorioSessao as any).criar(novaSessao.paraBancoDeDados());
    logger.info(`Sessão para o usuário ${dadosSessaoValidados.user_id} salva com sucesso.`);
};

const encerrarSessao = async (token: string) => {
    logger.info('Iniciando processo de encerramento de sessão.');
    await repositorioSessao.deletarPorToken(token);
    logger.info('Sessão encerrada e removida com sucesso.');
    return { message: 'Logout realizado com sucesso.' };
};

export default {
    prepararNovaSessao,
    salvarSessao,
    encerrarSessao,
};
