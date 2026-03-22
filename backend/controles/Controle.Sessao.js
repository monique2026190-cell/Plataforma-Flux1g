
// backend/controles/Controle.Sessao.js

import { OAuth2Client } from 'google-auth-library';
import servicoUsuario from '../ServicosBackend/Servico.Usuario.js';
import servicoSessao from '../ServicosBackend/Servico.Sessao.js';
import ServicoResposta from '../ServicosBackend/Servico.HTTP.Resposta.js';
import ServicoLog from '../ServicosBackend/Servico.Logs.Backend.js';
import validadorUsuario from '../validators/Validator.Estrutura.Usuario.js';
import validadorSessao from '../validators/Validator.Estrutura.Sessao.js';
import variaveis from '../config/Variaveis.Backend.js';

const oAuth2Client = new OAuth2Client(
  variaveis.google.clientId,
  variaveis.google.clientSecret,
  variaveis.google.redirectUri
);

const registrar = async (req, res) => {
    const contexto = "Controle.Sessao.registrar";
    const dadosRequisicao = { userAgent: req.headers['user-agent'], ipAddress: req.ip };

    try {
        const dadosUsuarioValidados = validadorUsuario.validarRegistro(req.body);
        ServicoLog.info(contexto, 'Iniciando registro de usuário', { email: dadosUsuarioValidados.email });

        const usuario = await servicoUsuario.registrarNovoUsuario(dadosUsuarioValidados);

        const { token, dadosSessao } = await servicoSessao.prepararNovaSessao({ usuario, dadosRequisicao });

        const dadosSessaoValidados = validadorSessao.validarNovaSessao(dadosSessao);

        await servicoSessao.salvarSessao(dadosSessaoValidados);

        ServicoLog.info(contexto, 'Registro e sessão criados com sucesso', { userId: usuario.id });
        return ServicoResposta.sucesso(res, { token, user: usuario.paraRespostaHttp() }, 201);

    } catch (error) {
        ServicoLog.erro(contexto, error.message, { email: req.body.email });
        if (error.message.includes('está em uso')) {
            return ServicoResposta.conflito(res, error.message);
        }
        return ServicoResposta.requisiçãoInválida(res, error.message);
    }
};

const login = async (req, res) => {
    const contexto = "Controle.Sessao.login";
    const dadosRequisicao = { userAgent: req.headers['user-agent'], ipAddress: req.ip };

    try {
        const dadosLoginValidados = validadorUsuario.validarLogin(req.body);
        ServicoLog.info(contexto, 'Iniciando login de usuário', { email: dadosLoginValidados.email });

        const usuario = await servicoUsuario.autenticarUsuarioPorCredenciais(dadosLoginValidados);

        const { token, dadosSessao } = await servicoSessao.prepararNovaSessao({ usuario, dadosRequisicao });

        const dadosSessaoValidados = validadorSessao.validarNovaSessao(dadosSessao);

        await servicoSessao.salvarSessao(dadosSessaoValidados);

        ServicoLog.info(contexto, 'Login e sessão criados com sucesso', { userId: usuario.id });
        return ServicoResposta.sucesso(res, { token, user: usuario.paraRespostaHttp() });

    } catch (error) {
        ServicoLog.erro(contexto, error.message, { email: req.body.email });
        if (error.message.includes('Credenciais inválidas')) {
            return ServicoResposta.nãoAutorizado(res, error.message);
        }
        return ServicoResposta.requisiçãoInválida(res, error.message);
    }
};

const googleAuth = async (req, res) => {
    const contexto = "Controle.Sessao.googleAuth";
    const dadosRequisicao = { userAgent: req.headers['user-agent'], ipAddress: req.ip };
    const { code } = req.body;

    if (!code) {
        return ServicoResposta.requisiçãoInválida(res, "O código de autorização do Google é obrigatório.");
    }

    try {
        ServicoLog.info(contexto, 'Iniciando troca de código de autorização Google');
        
        const { tokens } = await oAuth2Client.getToken(code);
        
        if (!tokens.id_token) {
            ServicoLog.erro(contexto, 'ID token não encontrado na resposta do Google');
            return ServicoResposta.erro(res, "Falha ao obter o ID token do Google.");
        }

        const loginTicket = await oAuth2Client.verifyIdToken({
            idToken: tokens.id_token,
            audience: variaveis.google.clientId,
        });

        const payload = loginTicket.getPayload();
        if (!payload) {
            throw new Error('Não foi possível obter os dados do usuário do Google.');
        }

        const dadosGoogle = {
            googleId: payload.sub,
            email: payload.email,
            nome: payload.name,
            foto: payload.picture,
        };

        const dadosGoogleValidados = validadorUsuario.validarGoogleAuth(dadosGoogle);

        const { usuario, isNewUser } = await servicoUsuario.autenticarOuCriarPorGoogle(dadosGoogleValidados);

        const { token, dadosSessao } = await servicoSessao.prepararNovaSessao({ usuario, dadosRequisicao });

        const dadosSessaoValidados = validadorSessao.validarNovaSessao(dadosSessao);
        await servicoSessao.salvarSessao(dadosSessaoValidados);

        ServicoLog.info(contexto, 'Autenticação Google e sessão processados com sucesso', { userId: usuario.id });
        return ServicoResposta.sucesso(res, { 
            token, 
            user: usuario.paraRespostaHttp(),
            isNewUser
        });

    } catch (error) {
        ServicoLog.erro(contexto, `Falha na autenticação com Google: ${error.message}`, { error });
        if (error.message.includes('Faça login com sua senha')) {
            return ServicoResposta.conflito(res, error.message);
        }
        return ServicoResposta.erro(res, `Erro no servidor durante a autenticação com Google: ${error.message}`);
    }
};

const logout = async (req, res) => {
    const contexto = "Controle.Sessao.logout";
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return ServicoResposta.nãoAutorizado(res, 'Token não fornecido');
        }
        await servicoSessao.encerrarSessao(token);
        return ServicoResposta.sucesso(res, { message: 'Logout bem-sucedido' });

    } catch (error) {
        ServicoLog.erro(contexto, error.message);
        return ServicoResposta.erro(res, 'Falha ao fazer logout');
    }
};

export default {
    registrar,
    login,
    googleAuth,
    logout
};
