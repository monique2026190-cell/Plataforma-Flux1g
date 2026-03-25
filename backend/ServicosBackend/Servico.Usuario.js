
// backend/ServicosBackend/Servico.Usuario.js

import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import Usuario from '../models/Models.Estrutura.Usuario.js';
import repositorioUsuario from '../Repositorios/Repositorio.Usuario.js';

const registrarNovoUsuario = async (dadosUsuario) => {
    const { nome, email, senha } = dadosUsuario;
    
    console.log('Iniciando registro de novo usuário', { event: 'REGISTRATION_START', email });

    const usuarioExistente = await repositorioUsuario.encontrarPorEmail(email);
    if (usuarioExistente) {
        throw new Error('Este e-mail já está em uso.');
    }

    const novoUsuario = new Usuario({
        id: uuidv4(),
        nome,
        email,
        senha,
        apelido: email.split('@')[0],
    });

    await novoUsuario.criptografarSenha();

    const usuarioDb = await repositorioUsuario.criar(novoUsuario.paraBancoDeDados());
    console.log('Usuário registrado com sucesso', { event: 'REGISTRATION_SUCCESS', userId: usuarioDb.id, email });

    return Usuario.deBancoDeDados(usuarioDb);
};

const autenticarUsuarioPorCredenciais = async (credenciais) => {
    const { email, senha } = credenciais;
    
    console.log('Iniciando autenticação por credenciais', { event: 'AUTH_CREDENTIALS_START', email });

    const usuarioDb = await repositorioUsuario.encontrarPorEmail(email);
    if (!usuarioDb || !usuarioDb.password_hash) {
        throw new Error('Credenciais inválidas.');
    }

    const senhaValida = await bcrypt.compare(senha, usuarioDb.password_hash);
    if (!senhaValida) {
        throw new Error('Credenciais inválidas.');
    }

    console.log('Usuário autenticado com sucesso', { event: 'AUTH_CREDENTIALS_SUCCESS', email, userId: usuarioDb.id });
    return Usuario.deBancoDeDados(usuarioDb);
};

const autenticarOuCriarPorGoogle = async (dadosGoogle) => {
    const { nome, email, google_id } = dadosGoogle;
    
    console.log('Iniciando autenticação ou criação por Google', { event: 'AUTH_GOOGLE_START', email });

    let usuarioDb = await repositorioUsuario.encontrarPorGoogleId(google_id);
    let isNewUser = false;

    if (!usuarioDb) {
        const usuarioExistente = await repositorioUsuario.encontrarPorEmail(email);
        if (usuarioExistente) {
            throw new Error("Este e-mail já está cadastrado. Faça login com sua senha.");
        }

        isNewUser = true;
        const novoUsuario = new Usuario({
            id: uuidv4(),
            nome,
            email,
            google_id,
            apelido: email.split('@')[0],
            perfilCompleto: false,
        });
        
        usuarioDb = await repositorioUsuario.criar(novoUsuario.paraBancoDeDados());
        console.log('Novo usuário criado via Google', { event: 'AUTH_GOOGLE_NEW_USER', userId: usuarioDb.id, email });
    }

    return {
        usuario: Usuario.deBancoDeDados(usuarioDb),
        isNewUser: isNewUser
    };
};

const atualizarPerfilUsuario = async (idUsuario, dadosPerfil) => {
    console.log('Iniciando atualização de perfil de usuário', { event: 'PROFILE_UPDATE_START', userId: idUsuario });

    const usuarioExistente = await repositorioUsuario.encontrarPorId(idUsuario);
    if (!usuarioExistente) {
        throw new Error('Usuário não encontrado.');
    }

    const dadosParaAtualizar = Object.keys(dadosPerfil).reduce((acc, key) => {
        if (dadosPerfil[key] !== undefined) {
            acc[key] = dadosPerfil[key];
        }
        return acc;
    }, {});


    const usuarioAtualizadoDb = await repositorioUsuario.atualizar(idUsuario, dadosParaAtualizar);
    
    console.log('Perfil de usuário atualizado com sucesso', { event: 'PROFILE_UPDATE_SUCCESS', userId: idUsuario });

    return Usuario.deBancoDeDados(usuarioAtualizadoDb);
};

const encontrarUsuarioPorId = async (id) => {
    console.log('Buscando usuário por ID', { event: 'FIND_USER_BY_ID', userId: id });
    const usuarioDb = await repositorioUsuario.encontrarPorId(id);
    if (!usuarioDb) {
        return null;
    }
    return Usuario.deBancoDeDados(usuarioDb);
};

export default {
    registrarNovoUsuario,
    autenticarUsuarioPorCredenciais,
    autenticarOuCriarPorGoogle,
    atualizarPerfilUsuario,
    encontrarUsuarioPorId
};