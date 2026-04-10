// Arquivo: SistemaFlux/Variaveis.Frontend.ts

/**
 * Define a interface para as variáveis de ambiente injetadas pelo Vite.
 * Isso fornece ao TypeScript o conhecimento sobre a estrutura de `import.meta.env`.
 */
interface ImportMetaEnv {
  readonly VITE_STRIPE_PUBLIC_KEY?: string;
  readonly VITE_GOOGLE_CLIENT_ID?: string;
  readonly MODE: 'production' | 'development' | 'test';
}

/**
 * Define a estrutura do nosso objeto de configuração do frontend,
 * garantindo que todas as chaves sejam somente leitura.
 */
interface FrontendConfig {
  readonly API_BASE_URL: string;
  readonly stripePublicKey: string;
  readonly googleClientId: string;
  readonly mode: 'production' | 'development' | 'test';
}

// --- Processamento do Ambiente ---

// Cria uma referência segura para as variáveis de ambiente.
// O `as any` é um escape, mas justificável, pois `import.meta` pode não
// existir em todos os contextos de execução (ex: testes unitários).
const env: ImportMetaEnv = (typeof import.meta !== 'undefined' && import.meta.env)
  ? (import.meta.env as unknown as ImportMetaEnv)
  : { MODE: 'development' };

const isProduction = env.MODE === 'production';

// --- Definição das Configurações ---

const VariaveisFrontend: FrontendConfig = {
    /**
     * A URL base da API. Apontar para um caminho relativo como '/api' permite
     * usar o proxy do Vite em desenvolvimento e facilita o roteamento em produção,
     * evitando problemas de CORS.
     */
    API_BASE_URL: '/api',

    /**
     * Chave pública do Stripe. É seguro expor esta chave no frontend.
     */
    stripePublicKey: env.VITE_STRIPE_PUBLIC_KEY || 'CHAVE_NAO_DEFINIDA',

    /**
     * Client ID do Google para autenticação.
     */
    googleClientId: env.VITE_GOOGLE_CLIENT_ID || 'CHAVE_NAO_DEFINIDA',

    /**
     * O modo de execução atual ('production' ou 'development').
     */
    mode: env.MODE
};

// --- Validação em Produção ---

if (isProduction) {
    if (VariaveisFrontend.stripePublicKey === 'CHAVE_NAO_DEFINIDA') {
        console.error("[Configuração Frontend] Erro Crítico: A variável 'VITE_STRIPE_PUBLIC_KEY' não foi definida para o ambiente de produção.");
    }
    if (VariaveisFrontend.googleClientId === 'CHAVE_NAO_DEFINIDA') {
        console.error("[Configuração Frontend] Erro Crítico: A variável 'VITE_GOOGLE_CLIENT_ID' não foi definida para o ambiente de produção.");
    }
}

/**
 * Exporta o objeto de configuração congelado, tornando-o imutável.
 * Isso previne modificações acidentais em outras partes do código.
 */
export default Object.freeze(VariaveisFrontend);
