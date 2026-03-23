
import ServicoLog from './ServicoDeLog.js';

/**
 * @file Log.Requisicoes.API.ts
 * @description Módulo especializado para registrar todas as interações com o backend.
 * Captura e loga informações detalhadas sobre requisições, respostas e erros de API.
 */
const LogRequisicoesAPI = {
  /**
   * Registra a saída de uma requisição da API.
   * @param {object} config - O objeto de configuração da requisição (do Axios).
   */
  logRequest: (config) => {
    const { method, url, metadata } = config;
    ServicoLog.info('Cliente.Backend.Request', `Requisição: ${method.toUpperCase()} ${url}`, {
      traceId: metadata?.traceId,
    });
  },

  /**
   * Registra a chegada de uma resposta bem-sucedida da API.
   * @param {object} response - O objeto de resposta (do Axios).
   */
  logResponse: (response) => {
    const { config, status } = response;
    ServicoLog.info('Cliente.Backend.Response', `Resposta: ${status} para ${config.method.toUpperCase()} ${config.url}`, {
      traceId: config?.metadata?.traceId,
    });
  },

  /**
   * Registra um erro ocorrido durante uma chamada da API.
   * @param {object} error - O objeto de erro (do Axios).
   */
  logError: (error) => {
    const { config, response, message } = error;
    const status = response?.status;
    const errorMessage = response?.data?.message || message;
    ServicoLog.erro('Cliente.Backend.Error', `Erro: ${status || 'Network Error'} para ${config?.method?.toUpperCase()} ${config?.url}`, {
      traceId: config?.metadata?.traceId,
      detalhes: { erro: errorMessage }
    });
  }
};

export default LogRequisicoesAPI;

