
import { Request, Response, NextFunction } from 'express';
import ServicoCriacaoGrupoPublico from '../ServicosBackend/Servicos.Criacao.Grupo.Publico.js';
import { validarCriacaoGrupo } from '../validators/Validator.Estrutura.Grupo.js';

interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
    };
}

const httpRes = {
    criado: (r: Response, dados: any, m: string = "Criado com sucesso") => r.status(201).json({ sucesso: true, mensagem: m, dados }),
};

const criarGrupoPublico = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user?.id) {
        return res.status(401).json({ sucesso: false, mensagem: 'Não autorizado: ID do usuário ausente.' });
    }
    const donoId: string = req.user.id;

    try {
        const dadosParaValidar = {
            ...req.body,
            donoId,
            tipo: 'publico'
        };
        const dadosValidados = validarCriacaoGrupo(dadosParaValidar);

        console.log('Iniciando criação de grupo público', { event: 'GROUP_PUBLIC_CREATE_START', donoId, nome: dadosValidados.nome });

        const grupoSalvo = await ServicoCriacaoGrupoPublico.criar(dadosValidados);

        console.log('Grupo público criado com sucesso', { event: 'GROUP_PUBLIC_CREATE_SUCCESS', groupId: grupoSalvo.id, donoId });

        const resposta = grupoSalvo;
        return httpRes.criado(res, resposta);

    } catch (error: any) {
        console.error('Erro ao criar grupo público', { 
            event: 'GROUP_PUBLIC_CREATE_ERROR',
            errorMessage: error.message,
            donoId,
            requestBody: req.body
        });
        next(error);
    }
};

export default { criarGrupoPublico };
