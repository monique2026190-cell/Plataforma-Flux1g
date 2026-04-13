import { criarLogger } from './Comunicacao.Backend.Observabilidade';
import VariaveisFrontend from '../../SistemaFlux/Variaveis.Frontend.js';
import { processarResposta } from './Comunicacao.Backend.Respostas';

const logger = criarLogger('Infra.ClienteHttp');

const jsonSeguro = (obj: any): string => {
    try {
        return JSON.stringify(obj, (chave, valor) =>
            valor instanceof Error ? { mensagem: valor.message, stack: valor.stack } : valor
        );
    } catch (e) {
        return '[Erro na serialização]';
    }
};

type ItemFila = {
    resolver: (valor: any) => void;
    rejeitar: (motivo?: any) => void;
};

class ClienteHttp {
    public estaAtualizandoToken = false;
    public filaRequisicoes: ItemFila[] = [];

    public processarFila(erro: any, token: string | null = null) {
        this.filaRequisicoes.forEach(item => {
            if (erro) item.rejeitar(erro);
            else item.resolver(token);
        });
        this.filaRequisicoes = [];
    }

    public async requisicao(
        endpoint: string,
        opcoes: RequestInit = {},
        ehTentativaNovamente = false
    ): Promise<any> {
        const tempoInicio = performance.now();

        const urlBase = VariaveisFrontend.API_BASE_URL || '/api';
        let urlFinal = endpoint;

        if (!endpoint.startsWith('http') && !endpoint.startsWith(urlBase)) {
            const separador = (urlBase.endsWith('/') || endpoint.startsWith('/')) ? '' : '/';
            urlFinal = `${urlBase}${separador}${endpoint}`;
        }

        const cabecalhos: Record<string, string> = {};

        if (!(opcoes.body instanceof FormData)) {
            cabecalhos['Content-Type'] = 'application/json';
        }

        if (opcoes.headers) {
            const headersExtras = new Headers(opcoes.headers);
            headersExtras.forEach((valor, chave) => {
                cabecalhos[chave] = valor;
            });
        }

        const token = localStorage.getItem('auth_token');
        if (token) {
            cabecalhos['Authorization'] = `Bearer ${token}`;
        }

        const config: RequestInit = {
            ...opcoes,
            headers: cabecalhos,
            credentials: 'include'
        };

        logger.info(`Requisição: ${config.method || 'GET'} ${urlFinal}`, {
            url: urlFinal,
            metodo: config.method || 'GET'
        });

        try {
            const resposta = await fetch(urlFinal, config);

            return await processarResposta(
                this,
                resposta,
                urlFinal,
                tempoInicio,
                { endpoint, opcoes },
                ehTentativaNovamente
            );
        } catch (erro: any) {
            if (!(erro.response)) {
                logger.error(`Falha de conexão: ${urlFinal}`, {
                    erro: erro.message
                });
            }
            throw erro;
        }
    }

    public obter<T = any>(url: string, config?: any): Promise<T> {
        return this.requisicao(url, { ...config, method: 'GET' });
    }

    public enviar<T = any>(url: string, dados?: any, config?: any): Promise<T> {
        const corpo = (dados instanceof FormData || typeof dados === 'string')
            ? dados
            : jsonSeguro(dados);

        return this.requisicao(url, { ...config, method: 'POST', body: corpo });
    }

    public atualizar<T = any>(url: string, dados?: any, config?: any): Promise<T> {
        const corpo = (dados instanceof FormData || typeof dados === 'string')
            ? dados
            : jsonSeguro(dados);

        return this.requisicao(url, { ...config, method: 'PUT', body: corpo });
    }

    public remover<T = any>(url: string, config?: any): Promise<T> {
        return this.requisicao(url, { ...config, method: 'DELETE' });
    }
}

export const possibilidadeClienteHttp = new ClienteHttp();

console.log('[SISTEMA] Módulo Comunicacao.Backend.Requisicoes inicializado com sucesso.');