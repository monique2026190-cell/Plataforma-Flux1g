
import { Request, Response, NextFunction } from 'express';
import servicoUsuario from '../ServicosBackend/Servico.Usuario.js';
import validadorUsuario from '../validators/Validator.Estrutura.Usuario.js';
import createControllerLogger from '../config/Log.Controles.js';

// Interface para requisições autenticadas
interface AuthenticatedRequest extends Request {
    user?: { id: string };
}

const logger = createControllerLogger('Controle.Usuario.ts');

const httpRes = {
    sucesso: (r: Response, dados: any, m: string = "Sucesso") => r.status(200).json({ sucesso: true, mensagem: m, dados }),
    criado: (r: Response, dados: any, m: string = "Criado com sucesso") => r.status(201).json({ sucesso: true, mensagem: m, dados }),
    naoEncontrado: (r: Response, m: string = "Recurso não encontrado") => r.status(404).json({ sucesso: false, mensagem: m }),
    naoAutorizado: (r: Response, m: string = "Não autorizado") => r.status(401).json({ sucesso: false, mensagem: m }),
};

const completarPerfil = async (req: Request & { file?: any }, res: Response, next: NextFunction) => {
    const { idUsuario, apelido, nome, bio, tipoDeConta }: { idUsuario: string; apelido: string; nome: string; bio: string; tipoDeConta: string; } = req.body;
    const avatar = req.file;

    logger.info(`Iniciando processo de completar perfil para o usuário ${idUsuario}.`, { userId: idUsuario });

    try {
        const dadosPerfil = { apelido, nome, bio, tipoDeConta };
        // TODO: Adicionar validação para os dados do perfil
        const usuarioAtualizado = await servicoUsuario.completarPerfil(idUsuario, dadosPerfil, avatar);

        if (!usuarioAtualizado) {
            throw new Error('Falha ao completar o perfil. O serviço não retornou um usuário atualizado.');
        }

        logger.info(`Perfil do usuário ${idUsuario} completado com sucesso.`, { userId: idUsuario });
        return httpRes.sucesso(res, { user: usuarioAtualizado.paraRespostaHttp() }, "Perfil completado com sucesso.");

    } catch (error: any) {
        logger.error(`Erro ao completar o perfil do usuário ${idUsuario}:`, { userId: idUsuario, error });
        next(error);
    }
};

const atualizarPerfil = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user?.id) {
        return httpRes.naoAutorizado(res, "ID do usuário não fornecido na requisição.");
    }
    const idUsuario = req.user.id;
    logger.info(`Iniciando atualização de perfil para o usuário ${idUsuario}.`, { userId: idUsuario, body: req.body });

    try {
        const dadosValidados = validadorUsuario.validarAtualizacaoPerfil(req.body);
        const usuarioAtualizado = await servicoUsuario.atualizarPerfilUsuario(idUsuario, dadosValidados);

        if (!usuarioAtualizado) {
            throw new Error('Falha ao atualizar o perfil. O serviço não retornou um usuário atualizado.');
        }

        logger.info(`Perfil do usuário ${idUsuario} atualizado com sucesso.`, { userId: idUsuario });
        return httpRes.sucesso(res, { user: usuarioAtualizado.paraRespostaHttp() });

    } catch (error: any) {
        logger.error(`Erro ao atualizar o perfil do usuário ${idUsuario}:`, { userId: idUsuario, error });
        next(error);
    }
};

const obterPerfil = async (req: Request, res: Response, next: NextFunction) => {
    const { id: idUsuario } = req.params;
    logger.info(`Buscando perfil do usuário ${idUsuario}.`, { userId: idUsuario });

    try {
        const usuario = await servicoUsuario.encontrarUsuarioPorId(idUsuario);

        if (!usuario) {
            logger.warn(`Usuário com ID ${idUsuario} não encontrado.`, { userId: idUsuario });
            return httpRes.naoEncontrado(res, "Usuário não encontrado");
        }

        logger.info(`Perfil do usuário ${idUsuario} encontrado com sucesso.`, { userId: idUsuario });
        return httpRes.sucesso(res, { user: usuario.paraRespostaHttp() });

    } catch (error: any) {
        logger.error(`Erro ao buscar o perfil do usuário ${idUsuario}:`, { userId: idUsuario, error });
        next(error);
    }
}

export default {
    completarPerfil,
    atualizarPerfil,
    obterPerfil
};
