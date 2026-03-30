
import { createLogger, ILogger } from '../Comunicacao/Comunicacao.Backend.Observabilidade';

/**
 * @class LoggerParaInfra
 * @description
 * Uma classe de logging especializada para a camada de infraestrutura (provedores).
 * 
 * Esta classe encapsula um logger, prefixando cada mensagem com o nome do provedor
 * que está sendo logado, facilitando a identificação da origem dos eventos.
 *
 * @example
 * const loggerDoMeuProvedor = new LoggerParaInfra('MeuProvedorDeDados');
 * loggerDoMeuProvedor.info('Operação iniciada.');
 * loggerDoMeuProvedor.error('Falha na comunicação com a API', { err });
 */
class LoggerParaInfra {
  private logger: ILogger;

  /**
   * @constructor
   * @param {string} nomeDoProvedor - O nome do provedor que será usado como prefixo nos logs.
   */
  constructor(private nomeDoProvedor: string) {
    this.logger = createLogger(`Infra.${nomeDoProvedor}`);
  }

  /**
   * Registra uma mensagem informativa.
   * @param {string} mensagem - A mensagem a ser registrada.
   * @param {any[]} [dados] - Dados adicionais para contextualizar o log.
   */
  info(mensagem: string, ...dados: any[]) {
    this.logger.info(mensagem, ...dados);
  }

  /**
   * Registra um aviso.
   * @param {string} mensagem - A mensagem de aviso.
   * @param {any[]} [dados] - Dados adicionais.
   */
  warn(mensagem: string, ...dados: any[]) {
    this.logger.warn(mensagem, ...dados);
  }

  /**
   * Registra um erro.
   * @param {string} mensagem - A descrição do erro.
   * @param {any[]} [dados] - O objeto de erro ou outros dados relevantes.
   */
  error(mensagem: string, ...dados: any[]) {
    this.logger.error(mensagem, ...dados);
  }
}

export default LoggerParaInfra;
