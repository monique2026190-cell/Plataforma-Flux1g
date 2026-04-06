
// Arquivo: backend/config/Variaveis.Backend.ts

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// --- Interface de Configuração ---
// Define a estrutura e os tipos do objeto de configuração final.
interface IBackendConfig {
    databaseUrl: string;
    jwtSecret: string;
    corsOrigin: string;
    port: number;
    stripeSecretKey: string;
    google: {
        clientId: string;
        clientSecret: string;
    };
    frontend: {
        url: string;
    };
}

// --- Carregamento do .env ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..', '..');
dotenv.config({ path: path.join(projectRoot, '.env') });

// --- Funções de Leitura e Validação ---

function getEnvVar(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`[Configuração do Backend] A variável de ambiente obrigatória \"${name}\" não foi definida.`);
    }
    return value;
}

function getOptionalEnvVar(name: string, defaultValue: string): string {
    return process.env[name] || defaultValue;
}

function getOptionalEnvVarAsInt(name: string, defaultValue: number): number {
    const value = process.env[name];
    if (value) {
        const parsed = parseInt(value, 10);
        if (!isNaN(parsed)) {
            return parsed;
        }
    }
    return defaultValue;
}

// --- Construção da Configuração Final ---
// Lê, valida e monta o objeto de configuração final com os tipos corretos.
const configFinal: IBackendConfig = {
    databaseUrl: getEnvVar('DATABASE_URL'),
    jwtSecret: getEnvVar('JWT_SECRET'),
    corsOrigin: getEnvVar('CORS_ORIGIN'),
    port: getOptionalEnvVarAsInt('PORT', 3001),
    stripeSecretKey: getOptionalEnvVar('STRIPE_SECRET_KEY', ''),
    google: {
        clientId: getEnvVar('GOOGLE_CLIENT_ID'),
        clientSecret: getEnvVar('GOOGLE_CLIENT_SECRET'),
    },
    frontend: {
        url: getEnvVar('FRONTEND_URL'),
    }
};

// --- Exportação ---
// Exporta o objeto de configuração final, validado, tipado e pronto para uso.
export default configFinal;
