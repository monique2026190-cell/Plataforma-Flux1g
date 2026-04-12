import 'multer';
import { Request, Response, NextFunction } from 'express';
import { Express } from 'express'; // Import Express
import servicoUsuario from '../ServicosBackend/Servico.Usuario.js';
import validadorUsuario from '../validators/Validator.Estrutura.Usuario.js';
import createControllerLogger from '../config/Log.Controles.js';

// Defina uma interface que estende a interface Request e inclui a propriedade 'file'
interface RequestWithFile extends Request {
  file?: Express.Multer.File; // Corrected type
}

const logger = createControllerLogger('Controle.Usuario.ts');

const httpRes = {
    sucesso: (res: Response, dados: any, mensagem = "Sucesso") => res.status(200).json({ sucesso: true, mensagem, dados }),
    criado: (res: Response, dados: any, mensagem = "Criado com sucesso") => res.status(201).json({ sucesso: true, mensagem, dados }),
    requisicaoInvalida: (res: Response, mensagem = "Requisição inválida") => res.status(400).json({ sucesso: false, mensagem }),
    naoEncontrado: (res: Response, mensagem = "Não encontrado") => res.status(404).json({ sucesso: false, mensagem }),
};

const completarPerfil = async (req: RequestWithFile, res: Response, next: NextFunction) => {
    const idUsuario = req.params.id; 
    const dadosPerfil = req.body;
    const avatar = req.file; 

    logger.info(`Recebida requisição para completar perfil do usuário ${idUsuario}.`, { idUsuario, dadosPerfil, avatar: avatar?.originalname });

    try {
        const dadosValidados = validadorUsuario.validarCompletarPerfil(dadosPerfil);
        
        const usuarioAtualizado = await servicoUsuario.completarPerfil(idUsuario, dadosValidados, avatar);
        
        if (!usuarioAtualizado) {
            logger.warn(`Usuário ${idUsuario} não encontrado para completar perfil.`);
            return httpRes.naoEncontrado(res, 'Usuário não encontrado.');
        }

        logger.info(`Perfil do usuário ${idUsuario} completado com sucesso.`);
        return httpRes.sucesso(res, usuarioAtualizado.paraRespostaHttp());

    } catch (error: any) {
        logger.error(`Erro ao completar perfil do usuário ${idUsuario}:`, { idUsuario, error: error.message, stack: error.stack });
        next(error);
    }
};

const atualizarPerfil = async (req: Request, res: Response, next: NextFunction) => {
    const idUsuario = req.params.id;
    const dadosPerfil = req.body;

    logger.info(`Recebida requisição para atualizar perfil do usuário ${idUsuario}.`, { idUsuario, dadosPerfil });

    try {
        const dadosValidados = validadorUsuario.validarAtualizacaoPerfil(dadosPerfil);

        const usuarioAtualizado = await servicoUsuario.atualizarPerfilUsuario(idUsuario, dadosValidados);
        
        if (!usuarioAtualizado) {
            logger.warn(`Usuário ${idUsuario} não encontrado para atualização de perfil.`);
            return httpRes.naoEncontrado(res, 'Usuário não encontrado');
        }

        logger.info(`Perfil do usuário ${idUsuario} atualizado com sucesso.`);
        return httpRes.sucesso(res, usuarioAtualizado.paraRespostaHttp(), "Perfil atualizado com sucesso");

    } catch (error: any) {
        logger.error(`Erro ao atualizar perfil do usuário ${idUsuario}:`, { idUsuario, error: error.message });
        next(error);
    }
};

const obterPerfil = async (req: Request, res: Response, next: NextFunction) => {
    const idUsuario = req.params.id;
    logger.info(`Buscando perfil para o usuário ${idUsuario}.`);

    try {
        const usuario = await servicoUsuario.obterUsuarioPorId(idUsuario);

        if (!usuario) {
            logger.warn(`Perfil do usuário ${idUsuario} não encontrado.`);
            return httpRes.naoEncontrado(res, 'Usuário não encontrado');
        }

        logger.info(`Perfil do usuário ${idUsuario} encontrado com sucesso.`);
        return httpRes.sucesso(res, usuario.paraRespostaHttp());

    } catch (error: any) {
        logger.error(`Erro ao buscar perfil do usuário ${idUsuario}:`, { idUsuario, error: error.message });
        next(error);
    }
};

const verificarStatusPerfil = async (req: Request, res: Response, next: NextFunction) => {
    const idUsuario = req.params.id;
    logger.info(`Verificando status do perfil para o usuário ${idUsuario}.`);

    try {
        const status = await servicoUsuario.verificarStatusPerfil(idUsuario);
        logger.info(`Status do perfil do usuário ${idUsuario} verificado com sucesso.`);
        return httpRes.sucesso(res, status);

    } catch (error: any) {
        logger.error(`Erro ao verificar status do perfil do usuário ${idUsuario}:`, { idUsuario, error: error.message });
        next(error);
    }
};

export default {
    completarPerfil,
    atualizarPerfil,
    obterPerfil,
    verificarStatusPerfil
};
