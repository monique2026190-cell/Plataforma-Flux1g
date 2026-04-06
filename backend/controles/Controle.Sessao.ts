
import { Request, Response, NextFunction } from 'express';
import { OAuth2Client } from 'google-auth-library';
import servicoUsuario from '../ServicosBackend/Servico.Usuario.js';
import servicoSessao from '../ServicosBackend/Servico.Sessao.js';
import validadorUsuario from '../validators/Validator.Estrutura.Usuario.js';
import validadorSessao from '../validators/Validator.Estrutura.Sessao.js';
import variaveis from '../config/Variaveis.Backend.js';
import createControllerLogger from '../config/Log.Controles.js';

const logger = createControllerLogger('Controle.Sessao.ts');

const httpRes = {
    sucesso: (r: Response, dados: any, m = "Sucesso") => r.status(200).json({ sucesso: true, mensagem: m, dados }),
    criado: (r: Response, dados: any, m = "Criado com sucesso") => r.status(201).json({ sucesso: true, mensagem: m, dados }),
    requisicaoInvalida: (r: Response, m = "Requisição inválida") => r.status(400).json({ sucesso: false, mensagem: m }),
    naoAutorizado: (r: Response, m = "Não autorizado") => r.status(401).json({ sucesso: false, mensagem: m }),
};

const oAuth2Client = new OAuth2Client(
  variaveis.google.clientId,
  variaveis.google.clientSecret,
  variaveis.google.redirectUri
);

const registrar = async (req: Request, res: Response, next: NextFunction) => {
    const dadosRequisicao = { userAgent: req.headers['user-agent'], ipAddress: req.ip };
    const { email } = req.body;
    logger.info(`Iniciando registro para o e-mail ${email}.`, { email, ...dadosRequisicao });

    try {
        const dadosUsuarioValidados = validadorUsuario.validarRegistro(req.body);
        const usuario = await servicoUsuario.registrarNovoUsuario(dadosUsuarioValidados);
        
        if (!usuario) {
            throw new Error('Falha ao registrar o usuário. O serviço não retornou um usuário.');
        }

        const { token, dadosSessao } = await servicoSessao.prepararNovaSessao({ usuario, dadosRequisicao });
        const dadosSessaoValidados = validadorSessao.validarNovaSessao(dadosSessao);
        await servicoSessao.salvarSessao(dadosSessaoValidados);

        logger.info(`Usuário ${usuario.id} registrado com sucesso.`, { userId: usuario.id });
        return httpRes.criado(res, { token, user: usuario.paraRespostaHttp() });

    } catch (error: any) {
        logger.error(`Erro no registro do e-mail ${email}:`, { email, error });
        if (error.message.includes('está em uso')) {
            return httpRes.requisicaoInvalida(res, error.message);
        }
        next(error);
    }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
    const dadosRequisicao = { userAgent: req.headers['user-agent'], ipAddress: req.ip };
    const { email } = req.body;
    logger.info(`Iniciando login para o e-mail ${email}.`, { email, ...dadosRequisicao });

    try {
        const dadosLoginValidados = validadorUsuario.validarLogin(req.body);
        const usuario = await servicoUsuario.autenticarUsuarioPorCredenciais(dadosLoginValidados);

        if (!usuario) {
            throw new Error('Falha ao autenticar o usuário. O serviço não retornou um usuário.');
        }

        const { token, dadosSessao } = await servicoSessao.prepararNovaSessao({ usuario, dadosRequisicao });
        const dadosSessaoValidados = validadorSessao.validarNovaSessao(dadosSessao);
        await servicoSessao.salvarSessao(dadosSessaoValidados);

        logger.info(`Usuário ${usuario.id} logado com sucesso.`, { userId: usuario.id });
        return httpRes.sucesso(res, { token, user: usuario.paraRespostaHttp() });

    } catch (error: any) {
        logger.error(`Erro no login do e-mail ${email}:`, { email, error });
        if (error.message.includes('Credenciais inválidas')) {
            return httpRes.naoAutorizado(res, error.message);
        }
        next(error);
    }
};

const googleAuth = async (req: Request, res: Response, next: NextFunction) => {
    const dadosRequisicao = { userAgent: req.headers['user-agent'], ipAddress: req.ip };
    const code = req.query.code as string;
    logger.info('Callback do Google recebido.', { code, ...dadosRequisicao });

    try {
        if (!code) {
            return httpRes.requisicaoInvalida(res, "O código de autorização do Google é obrigatório.");
        }

        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);

        if (!tokens.id_token) {
            throw new Error('ID token não encontrado na resposta do Google.');
        }

        const loginTicket = await oAuth2Client.verifyIdToken({
            idToken: tokens.id_token,
            audience: variaveis.google.clientId,
        });

        const payload = loginTicket.getPayload();
        if (!payload) {
            throw new Error('Não foi possível obter os dados do usuário do Google.');
        }

        const dadosGoogle = { google_id: payload.sub, email: payload.email, nome: payload.name, foto: payload.picture };
        const dadosGoogleValidados = validadorUsuario.validarGoogleAuth(dadosGoogle);

        const { usuario, isNewUser } = await servicoUsuario.autenticarOuCriarPorGoogle(dadosGoogleValidados);
        
        if (!usuario || !usuario.id) {
            throw new Error('Falha ao autenticar ou criar usuário.');
        }

        const { token: sessionToken, dadosSessao } = await servicoSessao.prepararNovaSessao({ usuario, dadosRequisicao });
        const dadosSessaoValidados = validadorSessao.validarNovaSessao(dadosSessao);
        await servicoSessao.salvarSessao(dadosSessaoValidados);

        logger.info(`Usuário ${usuario.id} autenticado com Google com sucesso.`, { userId: usuario.id, isNewUser });
        
        const redirectUrl = new URL(variaveis.frontend.url + '/auth/google/success');
        redirectUrl.searchParams.append('token', sessionToken);
        res.redirect(redirectUrl.toString());

    } catch (error: any) {
        logger.error('Erro na autenticação com Google:', { error });
        const errorRedirectUrl = new URL(variaveis.frontend.url + '/auth/google/failure');
        errorRedirectUrl.searchParams.append('error', error.message || 'Erro desconhecido');
        res.redirect(errorRedirectUrl.toString());
    }
};

const logout = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1];
    logger.info(`Iniciando logout.`);

    try {
        if (!token) {
            return httpRes.naoAutorizado(res, 'Token não fornecido');
        }
        await servicoSessao.encerrarSessao(token);

        logger.info('Logout bem-sucedido.');
        return httpRes.sucesso(res, { message: 'Logout bem-sucedido' });

    } catch (error: any) {
        logger.error('Erro no logout:', { error });
        next(error);
    }
};

const googleLoginFromFrontend = async (req: Request, res: Response, next: NextFunction) => {
    const dadosRequisicao = { userAgent: req.headers['user-agent'], ipAddress: req.ip };
    const { email, googleId } = req.body;
    logger.info(`Iniciando login Google via Frontend para o e-mail ${email}.`, { email, ...dadosRequisicao });

    try {
        if (!email || !googleId) {
            return httpRes.requisicaoInvalida(res, "Email e googleId são obrigatórios.");
        }

        const dadosGoogle = { google_id: googleId, email, nome: '', foto: '' };
        const dadosGoogleValidados = validadorUsuario.validarGoogleAuth(dadosGoogle);

        const { usuario, isNewUser } = await servicoUsuario.autenticarOuCriarPorGoogle(dadosGoogleValidados);
        
        if (!usuario || !usuario.id) {
            throw new Error('Falha ao autenticar ou criar usuário via Google Frontend.');
        }

        const { token: sessionToken, dadosSessao } = await servicoSessao.prepararNovaSessao({ usuario, dadosRequisicao });
        const dadosSessaoValidados = validadorSessao.validarNovaSessao(dadosSessao);
        await servicoSessao.salvarSessao(dadosSessaoValidados);

        let redirectRoute = 'Feed';
        if (isNewUser) {
            redirectRoute = 'CompleteProfile';
        }

        logger.info(`Usuário ${usuario.id} autenticado com Google Frontend com sucesso.`, { userId: usuario.id, isNewUser, redirectRoute });
        
        return httpRes.sucesso(res, { 
            token: sessionToken, 
            user: usuario.paraRespostaHttp(),
            redirect: redirectRoute,
            isNewUser
        });

    } catch (error: any) {
        logger.error(`Erro no login Google via Frontend do e-mail ${email}:`, { email, error });
        next(error);
    }
};

export default {
    registrar,
    login,
    googleAuth,
    googleLoginFromFrontend,
    logout
};
