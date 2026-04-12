
import createValidatorLogger from '../config/Log.Validator.js';

const logger = createValidatorLogger('Validator.Estrutura.Publicacao.Reels.ts');

interface PublicacaoReelsData {
    autorId?: string;
    urlMidia?: string;
    descricao?: string;
}

interface ValidatedReelsData {
    autorId: string;
    urlMidia: string;
    descricao: string | null;
}

/**
 * Valida os dados para a criação de um novo Reel.
 * Garante que a publicação tenha uma URL de mídia.
 */
export function validarPublicacaoReels(data: PublicacaoReelsData): ValidatedReelsData {
  logger.info('Iniciando validação para publicação de Reels.', { data });
  const erros: string[] = [];

  if (!data.autorId) {
    erros.push("Autor do Reel é obrigatório");
  }

  if (!data.urlMidia || data.urlMidia.trim().length === 0) {
    erros.push("A URL da mídia do Reel não pode estar vazia");
  } else {
    try {
      new URL(data.urlMidia);
    } catch (_) {
      erros.push("A URL da mídia fornecida é inválida");
    }
  }
  
  if (data.descricao && data.descricao.length > 2000) {
      erros.push("A descrição excede o limite de 2000 caracteres.");
  }

  if (erros.length > 0) {
    const errorMsg = `Erros de validação de Reels: ${erros.join(", ")}`;
    logger.error(errorMsg, { data, erros });
    throw new Error(errorMsg);
  }

  logger.info('Validação de publicação de Reels bem-sucedida.');
  return {
    autorId: data.autorId!,
    urlMidia: data.urlMidia!,
    descricao: data.descricao || null,
  };
}

export default {
    validarPublicacaoReels
};
