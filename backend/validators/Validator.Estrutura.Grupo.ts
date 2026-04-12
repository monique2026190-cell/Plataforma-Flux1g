
import createValidatorLogger from '../config/Log.Validator.js';

const logger = createValidatorLogger('Validator.Estrutura.Grupo.ts');

interface CriacaoGrupoData {
    nome?: string;
    donoId?: string;
    tipo?: 'publico' | 'privado' | 'pago';
    preco?: number;
    moeda?: string;
    descricao?: string;
    limiteMembros?: number;
}

interface ValidatedGrupoData {
    nome: string;
    donoId: string;
    tipo: 'publico' | 'privado' | 'pago';
    preco: number;
    moeda: string | null;
    descricao: string;
    limiteMembros: number;
}

export function validarCriacaoGrupo(data: CriacaoGrupoData): ValidatedGrupoData {
  logger.info('Iniciando validação para criação de grupo.', { data });
  const erros: string[] = [];

  if (!data.nome || data.nome.trim().length === 0) {
    erros.push("Nome é obrigatório");
  }

  if (!data.donoId) {
    erros.push("Dono é obrigatório");
  }

  if (!data.tipo || !["publico", "privado", "pago"].includes(data.tipo)) {
    erros.push("Tipo inválido");
  }

  if (data.tipo === "pago") {
    if (!data.preco || data.preco <= 0) {
      erros.push("Preço deve ser maior que zero para grupos pagos");
    }

    if (!data.moeda) {
      erros.push("Moeda é obrigatória para grupos pagos");
    }
  }

  if (erros.length > 0) {
    const errorMsg = `Erros de validação de grupo: ${erros.join(", ")}`;
    logger.error(errorMsg, { data, erros });
    throw new Error(errorMsg);
  }

  logger.info('Validação de criação de grupo bem-sucedida.');
  return {
    nome: data.nome!,
    donoId: data.donoId!,
    tipo: data.tipo!,
    preco: data.preco || 0,
    moeda: data.moeda || null,
    descricao: data.descricao || "",
    limiteMembros: data.limiteMembros || 0
  };
}

export default {
    validarCriacaoGrupo
};
