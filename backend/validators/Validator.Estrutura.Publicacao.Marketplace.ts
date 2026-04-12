
import createValidatorLogger from '../config/Log.Validator.js';

const logger = createValidatorLogger('Validator.Estrutura.Publicacao.Marketplace.ts');

interface ItemMarketplaceData {
    autorId?: string;
    titulo?: string;
    descricao?: string;
    preco?: number;
    moeda?: string;
}

interface ValidatedItemMarketplaceData {
    autorId: string;
    titulo: string;
    descricao: string | null;
    preco: number;
    moeda: string;
}

/**
 * Valida os dados para a criação de um item de Marketplace.
 * Garante que o item tenha título, preço e moeda válidos.
 */
export function validarItemMarketplace(data: ItemMarketplaceData): ValidatedItemMarketplaceData {
  logger.info('Iniciando validação para item de marketplace.', { data });
  const erros: string[] = [];

  if (!data.autorId) {
    erros.push("Autor do item é obrigatório");
  }

  if (!data.titulo || data.titulo.trim().length === 0) {
    erros.push("O título do item não pode estar vazio");
  } else if (data.titulo.length > 150) {
    erros.push("O título excede o limite de 150 caracteres.");
  }
  
  if (data.descricao && data.descricao.length > 3000) {
      erros.push("A descrição excede o limite de 3000 caracteres.");
  }

  if (data.preco === undefined || data.preco === null) {
    erros.push("Preço é obrigatório");
  } else if (typeof data.preco !== 'number' || data.preco <= 0) {
    erros.push("Preço deve ser um número maior que zero");
  }

  if (!data.moeda || typeof data.moeda !== 'string' || !/^[A-Z]{3}$/.test(data.moeda)) {
    erros.push("Moeda é obrigatória e deve ser um código ISO de 3 letras (ex: BRL, USD)");
  }
  
  if (erros.length > 0) {
    const errorMsg = `Erros de validação de item do marketplace: ${erros.join(", ")}`;
    logger.error(errorMsg, { data, erros });
    throw new Error(errorMsg);
  }

  logger.info('Validação de item de marketplace bem-sucedida.');
  return {
    autorId: data.autorId!,
    titulo: data.titulo!.trim(),
    descricao: data.descricao ? data.descricao.trim() : null,
    preco: data.preco!,
    moeda: data.moeda!,
  };
}

export default {
    validarItemMarketplace
};
