
import { Request, Response, NextFunction } from 'express';
import ServicoCriacaoGrupoPrivado from '../ServicosBackend/Servicos.Criacao.Grupo.Privado.js';
import { validarCriacaoGrupo } from '../validators/Validator.Estrutura.Grupo.js';

interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
    };
}

const httpRes = {
    criado: (r: Response, dados: any, m: string = "Criado com sucesso") => r.status(201).json({ sucesso: true, mensagem: m, dados }),
};

const criarGrupoPrivado = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user?.id) {
        return res.status(401).json({ sucesso: false, mensagem: 'Não autorizado: ID do usuário ausente.' });
    }
    const donoId: string = req.user.id;

    try {
        const dadosParaValidar = {
            ...req.body,
            donoId,
            tipo: 'privado'
        };
        const dadosValidados = validarCriacaoGrupo(dadosParaValidar);

        console.log('Iniciando criação de grupo privado', { event: 'GROUP_PRIVATE_CREATE_START', donoId, nome: dadosValidados.nome });

        const grupoSalvo = await ServicoCriacaoGrupoPrivado.criar(dadosValidados, donoId);

        if (!grupoSalvo) {
            throw new Error('Falha ao criar o grupo privado.');
        }

        console.log('Criação de grupo privado bem-sucedida', { event: 'GROUP_PRIVATE_CREATE_SUCCESS', groupId: grupoSalvo.id, donoId });

        const resposta = grupoSalvo;
        return httpRes.criado(res, resposta);

    } catch (error: any) {
        console.error('Erro na criação de grupo privado', {
            event: 'GROUP_PRIVATE_CREATE_ERROR',
            errorMessage: error.message,
            donoId,
            requestBody: req.body
        });
        next(error);
    }
};

export default { criarGrupoPrivado };
