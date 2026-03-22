
import { Usuario } from '../../../types/Saida/Types.Estrutura.Usuario';

/**
 * @file Implementação simulada da API para autenticação com Google.
 */

const mockGoogleUser: Usuario = {
    id: 'uuid-google-simulado-456',
    email: 'google.user@email.simulado.com',
    nome: 'Usuario Google Simulado',
    apelido: 'google_simulado',
    urlFoto: 'https://i.pravatar.cc/150?u=google',
    bio: 'Este é um usuário simulado que autenticou via Google.',
    site: 'https://google.com',
    perfilCompleto: true,
    privado: false,
    seguidores: [],
    seguindo: [],
    dataCriacao: new Date('2024-03-01T10:00:00Z'),
    dataAtualizacao: new Date('2024-03-01T10:00:00Z'),
};

/**
 * Simula o redirecionamento para a página de autenticação do Google.
 */
export const redirectToGoogleAuth = (): void => {
    console.log("API Simulada Google: Simulando redirecionamento...");
    // Redireciona para a página de callback com um código de autorização falso.
    window.location.href = '/auth/google/callback?code=simulated_auth_code_12345';
};

/**
 * Simula o manuseio do callback do Google.
 * @param code O código de autorização falso.
 * @returns Uma promessa que resolve com um token JWT falso e um usuário mockado.
 */
export const handleAuthCallback = async (code: string): Promise<{ token: string; user: Usuario | null, isNewUser?: boolean }> => {
    console.log(`API Simulada Google: Recebido código de autorização simulado: "${code}"`);
    
    // Simula a latência da rede
    await new Promise(resolve => setTimeout(resolve, 600));

    const isNewUser = Math.random() > 0.5; // Simula aleatoriamente se é um novo usuário

    console.log(`API Simulada Google: Autenticação bem-sucedida. isNewUser: ${isNewUser}`);
    
    return {
        token: 'jwt-simulado-gerado-pelo-google-login',
        user: mockGoogleUser,
        isNewUser: isNewUser,
    };
};
