
import validator from 'validator';

const validarNovaSessao = (data) => {
    const erros = [];

    if (!data.user_id || !validator.isUUID(data.user_id)) {
        erros.push("ID de usuário é obrigatório e deve ser um UUID válido.");
    }

    if (!data.token || validator.isEmpty(data.token.trim())) {
        erros.push("Token é obrigatório.");
    }

    if (!data.expires_at || !validator.isISO8601(data.expires_at.toISOString())) {
        erros.push("A data de expiração é obrigatória e deve ser uma data válida.");
    }

    if (!data.ip_address || !validator.isIP(data.ip_address)) {
        erros.push("Endereço de IP é obrigatório e deve ser um IP válido.");
    }

    if (data.user_agent && typeof data.user_agent !== 'string') {
        erros.push("User-Agent, se fornecido, deve ser uma string.");
    }

    if (erros.length > 0) {
        throw new Error(`Erros de validação da sessão: ${erros.join(", ")}`);
    }

    // Retorna um objeto limpo e validado
    return {
        user_id: data.user_id,
        token: data.token.trim(),
        expires_at: data.expires_at,
        ip_address: data.ip_address,
        user_agent: data.user_agent ? data.user_agent.trim() : null,
    };
};

export default {
    validarNovaSessao
};
