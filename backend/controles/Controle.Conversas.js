
import servicoConversas from '../ServicosBackend/Servico.Conversas.js';
import ServicoRespostaHTTP from '../ServicosBackend/Servico.HTTP.Resposta.js';

const obterConversas = async (req, res, next) => {
    const userId = req.user.id;
    console.log('Buscando conversas do usuário', { event: 'CONVERSAS_GET_START', userId });

    try {
        const conversas = await servicoConversas.obterConversas(userId);
        
        console.log('Conversas do usuário obtidas com sucesso', { event: 'CONVERSAS_GET_SUCCESS', userId, count: conversas.length });
        
        return ServicoRespostaHTTP.sucesso(res, conversas, "Conversas obtidas com sucesso");
    } catch (error) {
        console.error('Erro ao buscar conversas do usuário', { event: 'CONVERSAS_GET_ERROR', errorMessage: error.message, userId });
        next(error);
    }
};

export default {
    obterConversas,
};
