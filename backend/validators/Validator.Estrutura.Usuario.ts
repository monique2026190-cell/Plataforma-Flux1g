
import validator from 'validator';
import createValidatorLogger from '../config/Log.Validator.js';

const logger = createValidatorLogger('Validator.Estrutura.Usuario.ts');

// Interfaces for data input
interface UserRegistrationData {
    nome?: string;
    name?: string;
    email?: string;
    senha?: string;
    nickname?: string;
    apelido?: string;
}

interface UserLoginData {
    email?: string;
    senha?: string;
}

interface GoogleAuthData {
    email?: string;
    google_id?: string;
    nome?: string;
    name?: string;
}

interface UserProfileUpdateData {
    apelido?: string;
    nickname?: string;
    site?: string;
    website?: string;
    bio?: string;
    privado?: boolean;
    is_private?: boolean;
}

interface UserProfileCompletionData {
    nome?: string;
    apelido?: string;
    bio?: string;
    tipoDeConta?: string;
}

// Interfaces for validated data output
interface ValidatedUserRegistrationData {
    nome: string;
    email: string;
    senha: string;
    nickname: string | undefined;
}

interface ValidatedUserLoginData {
    email: string;
    senha: string;
}

interface ValidatedGoogleAuthData {
    email: string;
    google_id: string;
    nome?: string;
}

interface ValidatedUserProfileUpdateData {
    nickname?: string;
    website?: string;
    bio?: string;
    is_private?: boolean;
}

interface ValidatedUserProfileCompletionData {
    nome: string;
    apelido: string;
    bio: string;
    tipoDeConta: string;
}


export const validarRegistro = (data: UserRegistrationData = {}): ValidatedUserRegistrationData => {
    logger.info('Starting validation for new user registration.', { data });
    const erros: string[] = [];

    const nome = data.nome || data.name;
    const { email, senha } = data;

    if (!nome || validator.isEmpty(nome, { ignore_whitespace: true })) {
        erros.push("O nome é obrigatório.");
    }

    if (!email || !validator.isEmail(email)) {
        erros.push("E-mail é obrigatório e deve ser válido.");
    }

    if (!senha || !validator.isLength(senha, { min: 8 })) {
        erros.push("A senha é obrigatória e deve ter no mínimo 8 caracteres.");
    }

    if (erros.length > 0) {
        const errorMsg = `Erros de validação de registro: ${erros.join(', ')}`;
        logger.error(errorMsg, { data, erros });
        throw new Error(errorMsg);
    }
    
    logger.info('Registration validation successful.');
    return {
        nome: nome!.trim(),
        email: email!.toLowerCase().trim(),
        senha: senha!,
        nickname: data.nickname || data.apelido,
    };
};

export const validarLogin = (data: UserLoginData = {}): ValidatedUserLoginData => {
    logger.info('Starting validation for login.', { email: data.email });
    const erros: string[] = [];
    const { email, senha } = data;

    if (!email || !validator.isEmail(email)) {
        erros.push("E-mail é obrigatório e deve ser válido.");
    }

    if (!senha || validator.isEmpty(senha)) {
        erros.push("A senha é obrigatória.");
    }

    if (erros.length > 0) {
        const errorMsg = `Erros de validação de login: ${erros.join(', ')}`;
        logger.error(errorMsg, { email: data.email, erros });
        throw new Error(errorMsg);
    }

    logger.info('Login validation successful.');
    return {
        email: email!.toLowerCase().trim(),
        senha: senha!,
    };
};

export const validarGoogleAuth = (data: GoogleAuthData = {}): ValidatedGoogleAuthData => {
    logger.info('Starting validation for Google authentication.', { email: data.email });
    const erros: string[] = [];
    const { email, google_id } = data;

    if (!email || !validator.isEmail(email)) {
        erros.push("E-mail do Google é obrigatório e deve ser válido.");
    }

    if (!google_id || validator.isEmpty(google_id, { ignore_whitespace: true })) {
        erros.push("Google ID é obrigatório.");
    }

    if (erros.length > 0) {
        const errorMsg = `Erros de validação Google Auth: ${erros.join(', ')}`;
        logger.error(errorMsg, { data, erros });
        throw new Error(errorMsg);
    }

    logger.info('Google Auth validation successful.');
    const dadosValidados: ValidatedGoogleAuthData = {
        email: email!.toLowerCase().trim(),
        google_id: google_id!.trim(),
    };

    const nome = data.nome || data.name;
    if (nome && !validator.isEmpty(nome, { ignore_whitespace: true })) {
        dadosValidados.nome = nome.trim();
    }

    return dadosValidados;
};

export const validarAtualizacaoPerfil = (data: UserProfileUpdateData = {}): ValidatedUserProfileUpdateData => {
    logger.info('Starting validation for profile update.', { data });
    const erros: string[] = [];
    const dadosValidados: ValidatedUserProfileUpdateData = {};

    const apelido = data.apelido || data.nickname;
    if (apelido !== undefined) {
        if (!validator.isLength(apelido.trim(), { min: 3 })) {
            erros.push("Apelido, se fornecido, deve ter no mínimo 3 caracteres.");
        } else {
            dadosValidados.nickname = apelido.trim();
        }
    }

    const site = data.site || data.website;
    if (site !== undefined) {
        const siteTrimmed = site.trim();
        if (siteTrimmed !== '' && !validator.isURL(siteTrimmed)) {
            erros.push("O site, se fornecido, deve ser uma URL válida.");
        } else {
            dadosValidados.website = siteTrimmed;
        }
    }
    
    if (data.bio !== undefined) {
        if (!validator.isLength(data.bio, { max: 150 })) {
            erros.push("A bio não pode exceder 150 caracteres.");
        } else {
            dadosValidados.bio = data.bio.trim();
        }
    }

    const privado = data.privado !== undefined ? data.privado : data.is_private;
    if (privado !== undefined) {
        if (typeof privado !== 'boolean') {
            erros.push("O campo 'privado', se fornecido, deve ser um valor booleano.");
        } else {
            dadosValidados.is_private = privado;
        }
    }

    if (erros.length > 0) {
        const errorMsg = `Erros de validação de perfil: ${erros.join(', ')}`;
        logger.error(errorMsg, { data, erros });
        throw new Error(errorMsg);
    }
    
    logger.info('Profile update validation successful.');
    return dadosValidados;
};

export const validarCompletarPerfil = (data: UserProfileCompletionData = {}): ValidatedUserProfileCompletionData => {
    logger.info('Starting validation for profile completion.', { data });
    const erros: string[] = [];
    
    const { nome, apelido, bio, tipoDeConta } = data;

    if (!nome || validator.isEmpty(nome, { ignore_whitespace: true })) {
        erros.push("O nome é obrigatório.");
    }

    if (!apelido || validator.isEmpty(apelido, { ignore_whitespace: true })) {
        erros.push("O apelido é obrigatório.");
    } else if (!validator.isLength(apelido.trim(), { min: 3 })) {
        erros.push("O apelido deve ter no mínimo 3 caracteres.");
    }

    if (bio === undefined) {
        erros.push("A bio é obrigatória.");
    } else if (!validator.isLength(bio, { max: 150 })) {
        erros.push("A bio não pode exceder 150 caracteres.");
    }

    if (!tipoDeConta || !['private', 'public'].includes(tipoDeConta)) {
        erros.push("O tipo de conta é obrigatório e deve ser 'private' ou 'public'.");
    }

    if (erros.length > 0) {
        const errorMsg = `Erros de validação ao completar perfil: ${erros.join(', ')}`;
        logger.error(errorMsg, { data, erros });
        throw new Error(errorMsg);
    }
    
    logger.info('Profile completion validation successful.');
    return {
      nome: nome!.trim(),
      apelido: apelido!.trim(),
      bio: bio!.trim(),
      tipoDeConta: tipoDeConta!
    };
};

export default {
    validarRegistro,
    validarLogin,
    validarGoogleAuth,
    validarAtualizacaoPerfil,
    validarCompletarPerfil
};
