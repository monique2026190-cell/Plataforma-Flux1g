
import ServicoHTTPResposta from '../ServicosBackend/Servico.HTTP.Resposta.js';
import ServicoCriacaoGrupoPrivado from '../ServicosBackend/Servicos.Criacao.Grupo.Privado.js';
import { validarCriacaoGrupo } from '../validators/Validator.Estrutura.Grupo.js';

class ControleCriacaoGrupoPrivado {
    async handle(req, res) {
        const donoId = req.user.id;

        try {
            const dadosParaValidar = {
                ...req.body,
                donoId,
                tipo: 'privado'
            };
            const dadosValidados = validarCriacaoGrupo(dadosParaValidar);

            console.log('Iniciando criação de grupo privado', { event: 'GROUP_PRIVATE_CREATE_START', donoId, nome: dadosValidados.nome });

            const grupoSalvo = await ServicoCriacaoGrupoPrivado.criar(dadosValidados);

            console.log('Criação de grupo privado bem-sucedida', { event: 'GROUP_PRIVATE_CREATE_SUCCESS', groupId: grupoSalvo.id, donoId });

            const resposta = grupoSalvo.paraRespostaHttp ? grupoSalvo.paraRespostaHttp() : grupoSalvo;
            return ServicoHTTPResposta.sucesso(res, resposta, 201);

        } catch (error) {
            console.error('Erro na criação de grupo privado', {
                event: 'GROUP_PRIVATE_CREATE_ERROR',
                errorMessage: error.message,
                donoId,
                requestBody: req.body
            });

            return ServicoHTTPResposta.erro(res, error.message, 400);
        }
    }
}

export default new ControleCriacaoGrupoPrivado();
