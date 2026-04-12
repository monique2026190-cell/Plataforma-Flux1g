
import validator from 'validator';
import createValidatorLogger from '../config/Log.Validator.js';

const logger = createValidatorLogger('Validator.Estrutura.Sessao.ts');

interface NovaSessaoData {
    user_id?: string;
    token?: string;
    expires_at?: string | Date;
    ipAddress?: string;
    userAgent?: string;
}

interface ValidatedSessaoData {
    user_id: string;
    token: string;
    expires_at: Date;
    ip_address: string;
    user_agent: string | null;
}

const validarNovaSessao = (data: NovaSessaoData): ValidatedSessaoData => {
    logger.info('Iniciando validação para nova sessão.', { userId: data.user_id });
    const erros: string[] = [];

    if (!data.user_id || !validator.isUUID(data.user_id, 4)) {
        erros.push('O campo user_id é obrigatório e deve ser um UUID v4.');
    }

    if (!data.token || validator.isEmpty(data.token, { ignore_whitespace: true })) {
        erros.push('O campo token é obrigatório.');
    }

    if (!data.expires_at || !validator.isISO8601(new Date(data.expires_at).toISOString())) {
        erros.push('O campo expires_at é obrigatório e deve estar em formato de data válido.');
    }

    if (!data.ipAddress || !validator.isIP(data.ipAddress)) {
        erros.push('O campo ipAddress é obrigatório e deve ser um endereço de IP válido.');
    }

    if (data.userAgent && typeof data.userAgent !== 'string') {
        erros.push('O campo userAgent, se fornecido, deve ser uma string.');
    }

    if (erros.length > 0) {
        const errorMsg = `Dados de sessão inválidos: ${erros.join(' ')}`.trim();
        logger.error(errorMsg, { data, erros });
        throw new Error(errorMsg);
    }
    
    logger.info('Validação de nova sessão bem-sucedida.', { userId: data.user_id });
    return {
        user_id: data.user_id!,
        token: data.token!.trim(),
        expires_at: new Date(data.expires_at!),
        ip_address: data.ipAddress!,
        user_agent: data.userAgent ? data.userAgent.trim() : null,
    };
};

export default {
    validarNovaSessao
};
