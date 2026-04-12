
import createValidatorLogger from '../config/Log.Validator.js';

const logger = createValidatorLogger('Validator.Estrutura.Comentario.ts');

interface CriacaoComentarioData {
    autorId?: string;
    parenteId?: string;
    texto?: string;
}

interface ValidatedComentarioData {
    autorId: string;
    parenteId: string;
    texto: string;
}

/**
 * Valida os dados para a criação de um novo comentário.
 * É genérico e pode ser usado para comentários em qualquer tipo de publicação.
 */
function validarCriacaoComentario(data: CriacaoComentarioData): ValidatedComentarioData {
  logger.info('Iniciando validação para criação de comentário.', { parentId: data.parenteId, autorId: data.autorId });
  const erros: string[] = [];

  if (!data.autorId) {
    erros.push("Autor do comentário é obrigatório");
  }

  if (!data.parenteId) {
    erros.push("A ID da publicação-pai é obrigatória para o comentário");
  }

  if (!data.texto || data.texto.trim().length === 0) {
    erros.push("O texto do comentário não pode estar vazio");
  }

  if (data.texto && data.texto.length > 1000) {
    erros.push("O comentário excede o limite de 1000 caracteres");
  }

  if (erros.length > 0) {
    const errorMsg = `Erros de validação de comentário: ${erros.join(', ')}`;
    logger.error(errorMsg, { data, erros });
    throw new Error(errorMsg);
  }

  logger.info('Validação de criação de comentário bem-sucedida.');
  
  // Retorna um objeto limpo e seguro
  return {
    autorId: data.autorId!,
    parenteId: data.parenteId!,
    texto: data.texto!.trim()
  };
}

export default {
    validarCriacaoComentario
};
