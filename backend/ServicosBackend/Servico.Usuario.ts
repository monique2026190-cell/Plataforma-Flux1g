
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import Usuario, { IUsuario, IUsuarioAtualizacao, IUsuarioGoogleAuth, IUsuarioLogin, IUsuarioRegistro } from '../models/Models.Estrutura.Usuario.js';
import repositorioUsuario from '../Repositorios/Repositorio.Usuario.js';
import createServicoLogger from '../config/Log.Servicos.Backend.js';

const logger = createServicoLogger('Servico.Usuario.ts');

const completarPerfil = async (idUsuario: string, dadosPerfil: any, avatar: any) => {
    logger.info(`Iniciando o processo de completar perfil para o usuário ${idUsuario}.`);

    const usuarioExistente = await repositorioUsuario.encontrarPorId(idUsuario);
    if (!usuarioExistente) {
        logger.warn(`Usuário com ID ${idUsuario} não encontrado.`);
        throw new Error('Usuário não encontrado.');
    }

    let urlAvatar = usuarioExistente.urlFoto; // Corrigido
    if (avatar) {
        logger.info(`Simulando upload do avatar para o usuário ${idUsuario}.`);
        urlAvatar = `https://storage.googleapis.com/fictional-bucket/${avatar.originalname}`;
    }

    const dadosParaAtualizar: IUsuarioAtualizacao = {
        nickname: dadosPerfil.apelido,
        name: dadosPerfil.nome,
        bio: dadosPerfil.bio,
        is_private: dadosPerfil.tipoDeConta === 'private',
        photo_url: urlAvatar,
        profile_completed: true,
    };

    const usuarioAtualizadoDb = await repositorioUsuario.updateUser(idUsuario, dadosParaAtualizar);
    logger.info(`Perfil do usuário ${idUsuario} completado com sucesso.`);

    return Usuario.deBancoDeDados(usuarioAtualizadoDb);
};

const registrarNovoUsuario = async (dadosUsuario: IUsuarioRegistro) => {
    const { nome, email, senha } = dadosUsuario;
    logger.info(`Iniciando registro de novo usuário para o e-mail ${email}.`);

    const usuarioExistente = await repositorioUsuario.findByEmail(email);
    if (usuarioExistente) {
        logger.warn(`Tentativa de registro com e-mail ${email} que já está em uso.`);
        throw new Error('Este e-mail já está em uso.');
    }

    const novoUsuario = new Usuario({
        id: uuidv4(),
        nome,
        email,
        senha,
        apelido: email.split('@')[0],
        perfilCompleto: false, 
    });

    await novoUsuario.criptografarSenha();

    const usuarioDb = await repositorioUsuario.createUser(novoUsuario.paraBancoDeDados());
    logger.info(`Usuário ${usuarioDb.id} registrado com sucesso.`);

    return Usuario.deBancoDeDados(usuarioDb);
};

const autenticarUsuarioPorCredenciais = async (credenciais: IUsuarioLogin) => {
    const { email, senha } = credenciais;
    logger.info(`Iniciando autenticação por credenciais para o e-mail ${email}.`);

    const usuarioDb = await repositorioUsuario.findByEmail(email);
    // CORREÇÃO: A propriedade é 'senha' e não 'password_hash'
    if (!usuarioDb || !usuarioDb.senha) {
        logger.warn(`Tentativa de autenticação com credenciais inválidas para o e-mail ${email}.`);
        throw new Error('Credenciais inválidas.');
    }
    
    // CORREÇÃO: A propriedade é 'senha' e não 'password_hash'
    const senhaValida = await bcrypt.compare(senha, usuarioDb.senha);
    if (!senhaValida) {
        logger.warn(`Tentativa de autenticação com senha inválida para o e-mail ${email}.`);
        throw new Error('Credenciais inválidas.');
    }

    logger.info(`Usuário ${usuarioDb.id} autenticado com sucesso.`);
    return Usuario.deBancoDeDados(usuarioDb);
};

const autenticarOuCriarPorGoogle = async (dadosGoogle: IUsuarioGoogleAuth) => {
    const { nome, email, google_id } = dadosGoogle;
    logger.info(`Iniciando autenticação ou criação por Google para o e-mail ${email}.`);

    let usuarioDb = await repositorioUsuario.findByGoogleId(google_id);
    let isNewUser = false;

    if (!usuarioDb) {
        const usuarioExistente = await repositorioUsuario.findByEmail(email);
        if (usuarioExistente) {
            logger.warn(`Tentativa de criação de usuário Google com e-mail ${email} que já está em uso.`);
            throw new Error("Este e-mail já está cadastrado. Faça login com sua senha.");
        }

        isNewUser = true;
        const novoUsuario = new Usuario({
            id: uuidv4(),
            nome: nome || email.split('@')[0], // Garante que o nome não seja undefined
            email,
            googleId: google_id,
            apelido: email.split('@')[0],
            perfilCompleto: false,
        });
        
        usuarioDb = await repositorioUsuario.createUser(novoUsuario.paraBancoDeDados());
        logger.info(`Novo usuário ${usuarioDb.id} criado via Google.`);
    }

    const usuario = Usuario.deBancoDeDados(usuarioDb);
    return { usuario, isNewUser };
};

const atualizarPerfilUsuario = async (idUsuario: string, dadosPerfil: Partial<IUsuario>) => {
    logger.info(`Iniciando atualização de perfil para o usuário ${idUsuario}.`);

    const usuarioExistente = await repositorioUsuario.encontrarPorId(idUsuario);
    if (!usuarioExistente) {
        logger.warn(`Tentativa de atualização de perfil para usuário não encontrado com ID ${idUsuario}.`);
        throw new Error('Usuário não encontrado.');
    }
    
    // Mapeia os dados do perfil para o formato do banco de dados
    const dadosParaAtualizar: IUsuarioAtualizacao = {};
    if (dadosPerfil.apelido) dadosParaAtualizar.nickname = dadosPerfil.apelido;
    if (dadosPerfil.nome) dadosParaAtualizar.name = dadosPerfil.nome;
    if (dadosPerfil.bio) dadosParaAtualizar.bio = dadosPerfil.bio;
    if (dadosPerfil.privado !== undefined) dadosParaAtualizar.is_private = dadosPerfil.privado;
    if (dadosPerfil.urlFoto) dadosParaAtualizar.photo_url = dadosPerfil.urlFoto;

    const usuarioAtualizadoDb = await repositorioUsuario.updateUser(idUsuario, dadosParaAtualizar);
    
    logger.info(`Perfil do usuário ${idUsuario} atualizado com sucesso.`);

    return Usuario.deBancoDeDados(usuarioAtualizadoDb);
};

const encontrarUsuarioPorId = async (id: string) => {
    logger.info(`Buscando usuário por ID ${id}.`);
    const usuarioDb = await repositorioUsuario.encontrarPorId(id);
    if (!usuarioDb) {
        logger.warn(`Usuário não encontrado por ID ${id}.`);
        return null;
    }
    return Usuario.deBancoDeDados(usuarioDb);
};

const verificarStatusPerfil = async (idUsuario: string) => {
    logger.info(`Verificando status do perfil para o usuário ${idUsuario}.`);
    const usuario = await encontrarUsuarioPorId(idUsuario);
    if (!usuario) {
        throw new Error('Usuário não encontrado.');
    }
    return { perfilCompleto: usuario.perfilCompleto }; 
}; 

export default {
    completarPerfil,
    registrarNovoUsuario,
    autenticarUsuarioPorCredenciais,
    autenticarOuCriarPorGoogle,
    atualizarPerfilUsuario,
    encontrarUsuarioPorId,
    verificarStatusPerfil
};
