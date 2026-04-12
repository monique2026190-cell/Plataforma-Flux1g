
import createValidatorLogger from '../config/Log.Validator.js';

const logger = createValidatorLogger('Validator.Estrutura.Publicacao.Feed.ts');

interface PublicacaoFeedData {
    autorId?: string;
    texto?: string;
    urlMidia?: string;
}

interface ValidatedPublicacaoFeedData {
    autorId: string;
    texto: string;
    urlMidia: string | null;
}

/**
 * Valida os dados para a criação de uma publicação no Feed.
 * Garante que a publicação tenha o conteúdo mínimo necessário.
 */
export function validarPublicacaoFeed(data: PublicacaoFeedData): ValidatedPublicacaoFeedData {
  logger.info('Iniciando validação para publicação de feed.', { data });
  const erros: string[] = [];

  if (!data.autorId) {
    erros.push("Autor da publicação é obrigatório");
  }

  if (!data.texto || data.texto.trim().length === 0) {
    erros.push("O texto da publicação não pode estar vazio");
  }

  if (erros.length > 0) {
    const errorMsg = `Erros de validação de publicação do feed: ${erros.join(", ")}`;
    logger.error(errorMsg, { data, erros });
    throw new Error(errorMsg);
  }

  logger.info('Validação de publicação de feed bem-sucedida.');
  // Retorna um objeto limpo, garantindo que apenas os dados esperados passem
  return {
    autorId: data.autorId!,
    texto: data.texto!,
    urlMidia: data.urlMidia || null
  };
}

export default {
    validarPublicacaoFeed
};
