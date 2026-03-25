
import ServicoHTTPResposta from '../ServicosBackend/Servico.HTTP.Resposta.js';
import ServicoCriacaoGrupoPublico from '../ServicosBackend/Servicos.Criacao.Grupo.Publico.js';
import { validarCriacaoGrupo } from '../validators/Validator.Estrutura.Grupo.js';

class ControleCriacaoGrupoPublico {
    async handle(req, res) {
        const donoId = req.user.id;

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

            const resposta = grupoSalvo.paraRespostaHttp ? grupoSalvo.paraRespostaHttp() : grupoSalvo;
            return ServicoHTTPResposta.sucesso(res, resposta, 201);

        } catch (error) {
            console.error('Erro ao criar grupo público', { 
                event: 'GROUP_PUBLIC_CREATE_ERROR',
                errorMessage: error.message,
                donoId,
                requestBody: req.body
            });

            return ServicoHTTPResposta.erro(res, error.message, 400);
        }
    }
}

export default new ControleCriacaoGrupoPublico();
