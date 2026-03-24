/**
 * @file Log.ClienteBackend.ts
 * @description Módulo de logging centralizado para todas as requisições HTTP feitas pelo ClienteBackend (Axios).
 * Utiliza interceptadores para capturar e logar informações detalhadas sobre cada chamada,
 * garantindo observabilidade completa do tráfego de rede.
 */

import MensageiroClienteBackend from './Sistema.Mensageiro.Cliente.Backend';

const CONTEXTO = 'HTTP';

// Palavras-chave para mascaramento de dados sensíveis
const sensitiveKeys = [
  'password',
  'token',
  'authorization',
  'cookie',
  'apiKey',
  'clientSecret',
  'refreshToken'
];

/**
 * Mascara dados sensíveis em um objeto.
 * Percorre recursivamente o objeto e substitui valores de chaves sensíveis por '[MASCARADO]'.
 * @param {any} obj - O objeto a ser mascarado.
 * @returns {any} - O objeto com dados sensíveis mascarados.
 */
const mascararDadosSensiveis = (obj: any): any => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(mascararDadosSensiveis);
  }

  return Object.keys(obj).reduce((acc, key) => {
    if (sensitiveKeys.includes(key.toLowerCase())) {
      acc[key] = '[MASCARADO]';
    } else {
      acc[key] = mascararDadosSensiveis(obj[key]);
    }
    return acc;
  }, {} as any);
};

/**
 * @namespace LogClienteBackend
 * @description Agrupa funções para logar o ciclo de vida de uma requisição HTTP.
 */
const LogClienteBackend = {
  /**
   * Loga o início de uma requisição HTTP.
   * @param {any} config - A configuração da requisição Axios.
   */
  logRequest: (config: any) => {
    const { method, url, data } = config;
    const requestData = mascararDadosSensiveis(data);

    MensageiroClienteBackend.info(`Request: ${method?.toUpperCase()} ${url}`,
      {
        contexto: CONTEXTO,
        tipo: 'request',
        metodo: method?.toUpperCase(),
        url,
        request: requestData,
      }
    );
  },

  /**
   * Loga uma resposta HTTP bem-sucedida.
   * @param {any} response - O objeto de resposta Axios.
   */
  logResponse: (response: any) => {
    const { config, status, data } = response;
    const { method, url } = config;
    const responseData = mascararDadosSensiveis(data);

    MensageiroClienteBackend.info(`Response: ${status} ${method?.toUpperCase()} ${url}`,
      {
        contexto: CONTEXTO,
        tipo: 'response',
        status,
        metodo: method?.toUpperCase(),
        url,
        response: responseData,
      }
    );
  },

  /**
   * Loga um erro de requisição HTTP.
   * @param {any} error - O objeto de erro Axios.
   */
  logError: (error: any) => {
    const { config, response, message } = error;
    const method = config?.method?.toUpperCase();
    const url = config?.url;
    const status = response?.status;
    const requestData = mascararDadosSensiveis(config?.data);
    const responseData = mascararDadosSensiveis(response?.data);

    MensageiroClienteBackend.error(`Error: ${status || message} ${method} ${url}`,
      {
        contexto: CONTEXTO,
        tipo: 'error',
        status: status || 'Network Error',
        metodo: method,
        url,
        mensagem: message,
        request: requestData,
        response: responseData,
        stack: error.stack,
      }
    );
  },
};

export default LogClienteBackend;
