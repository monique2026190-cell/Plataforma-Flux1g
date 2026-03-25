
import { OAuth2Client } from 'google-auth-library';
import servicoUsuario from '../ServicosBackend/Servico.Usuario.js';
import servicoSessao from '../ServicosBackend/Servico.Sessao.js';
import ServicoResposta from '../ServicosBackend/Servico.HTTP.Resposta.js';
import validadorUsuario from '../validators/Validator.Estrutura.Usuario.js';
import validadorSessao from '../validators/Validator.Estrutura.Sessao.js';
import variaveis from '../config/Variaveis.Backend.js';

const oAuth2Client = new OAuth2Client(
  variaveis.google.clientId,
  variaveis.google.clientSecret,
  variaveis.google.redirectUri
);

const registrar = async (req, res, next) => {
    const dadosRequisicao = { userAgent: req.headers['user-agent'], ipAddress: req.ip };

    try {
        const dadosUsuarioValidados = validadorUsuario.validarRegistro(req.body);
        console.log('Iniciando registro de usuário', { event: 'INICIANDO_REGISTRO', email: dadosUsuarioValidados.email });

        const usuario = await servicoUsuario.registrarNovoUsuario(dadosUsuarioValidados);

        const { token, dadosSessao } = await servicoSessao.prepararNovaSessao({ usuario, dadosRequisicao });

        const dadosSessaoValidados = validadorSessao.validarNovaSessao(dadosSessao);

        await servicoSessao.salvarSessao(dadosSessaoValidados);

        console.log('Registro de usuário bem-sucedido', { event: 'REGISTRO_SUCESSO', userId: usuario.id });
        return ServicoResposta.criado(res, { token, user: usuario.paraRespostaHttp() });

    } catch (error) {
        console.error('Falha no registro de usuário', { event: 'FALHA_REGISTRO', email: req.body.email, errorMessage: error.message });
        if (error.message.includes('está em uso')) {
            return ServicoResposta.requisicaoInvalida(res, error.message);
        }
        next(error);
    }
};

const login = async (req, res, next) => {
    const dadosRequisicao = { userAgent: req.headers['user-agent'], ipAddress: req.ip };

    try {
        const dadosLoginValidados = validadorUsuario.validarLogin(req.body);
        console.log('Iniciando login de usuário', { event: 'INICIANDO_LOGIN', email: dadosLoginValidados.email });

        const usuario = await servicoUsuario.autenticarUsuarioPorCredenciais(dadosLoginValidados);

        const { token, dadosSessao } = await servicoSessao.prepararNovaSessao({ usuario, dadosRequisicao });

        const dadosSessaoValidados = validadorSessao.validarNovaSessao(dadosSessao);

        await servicoSessao.salvarSessao(dadosSessaoValidados);

        console.log('Login de usuário bem-sucedido', { event: 'LOGIN_SUCESSO', userId: usuario.id });
        return ServicoResposta.sucesso(res, { token, user: usuario.paraRespostaHttp() });

    } catch (error) {
        console.error('Falha no login de usuário', { event: 'FALHA_LOGIN', email: req.body.email, errorMessage: error.message });
        if (error.message.includes('Credenciais inválidas')) {
            return ServicoResposta.naoAutorizado(res, error.message);
        }
        next(error);
    }
};

const googleAuth = async (req, res, next) => {
    const dadosRequisicao = { userAgent: req.headers['user-agent'], ipAddress: req.ip };
    
    try {
        const { code } = req.body;
        if (!code) {
            return ServicoResposta.requisicaoInvalida(res, "O código de autorização do Google é obrigatório.");
        }

        console.log('Iniciando autenticação com Google', { event: 'INICIANDO_GOOGLE_AUTH' });
        
        const { tokens } = await oAuth2Client.getToken(code);
        
        if (!tokens.id_token) {
            console.error('ID token do Google não obtido', { event: 'GOOGLE_AUTH_NO_ID_TOKEN' });
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

        console.log('Autenticação com Google bem-sucedida', { event: 'GOOGLE_AUTH_SUCESSO', userId: usuario.id });
        return ServicoResposta.sucesso(res, { 
            token, 
            user: usuario.paraRespostaHttp(),
            isNewUser
        });

    } catch (error) {
        console.error('Falha na autenticação com Google', { event: 'FALHA_GOOGLE_AUTH', errorMessage: error.message, error });
        if (error.message.includes('Faça login com sua senha')) {
            return ServicoResposta.requisicaoInvalida(res, error.message);
        }
        next(error);
    }
};

const logout = async (req, res, next) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return ServicoResposta.naoAutorizado(res, 'Token não fornecido');
        }
        await servicoSessao.encerrarSessao(token);
        console.log('Logout bem-sucedido', { event: 'LOGOUT_SUCESSO' });
        return ServicoResposta.sucesso(res, { message: 'Logout bem-sucedido' });

    } catch (error) {
        console.error('Falha no logout', { event: 'FALHA_LOGOUT', errorMessage: error.message });
        next(error);
    }
};

export default {
    registrar,
    login,
    googleAuth,
    logout
};
