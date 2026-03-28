
import { useState, useEffect } from 'react';
// Importa o serviço de aplicação que contém as ações (casos de uso)
import { servicoDeAplicacaoDeAutenticacao } from '../ServiçosFrontend/ServicosDeAplicacao/Application.Layer.Autenticacao';
// Importa o gerenciador de estado e sua interface do novo local
import { authStateManager, IAuthState } from '../ServiçosFrontend/Estados/Manager.Estado.Autenticacao';
// O tipo LoginEmailParams ainda é necessário para a ação de login
import { LoginEmailParams } from '../ServiçosFrontend/ServiçoDeAutenticação/Auth.Application';

/**
 * Hook customizado para gerenciar o estado de autenticação em toda a aplicação.
 *
 * Este hook se inscreve no `authStateManager` para obter o estado mais recente
 * e fornece as ações (como login e logout) a partir do `servicoDeAplicacaoDeAutenticacao`.
 *
 * @returns Um objeto contendo o estado de autenticação e as funções para interagir com ele.
 */
export const useAuth = () => {
    // O estado agora é tipado com IAuthState e inicializado pelo authStateManager
    const [authState, setAuthState] = useState<IAuthState>(authStateManager.getState());

    useEffect(() => {
        // Se inscreve para receber atualizações do novo gerenciador de estado
        const unsubscribe = authStateManager.subscribe(setAuthState);

        // Limpa a inscrição quando o componente for desmontado
        return () => unsubscribe();
    }, []); // O array vazio garante que o efeito só rode na montagem e desmontagem

    // Retorna o estado do authStateManager e as ações do serviço de aplicação
    return {
        ...authState,
        loginComEmail: (params: LoginEmailParams) => servicoDeAplicacaoDeAutenticacao.loginComEmail(params),
        logout: () => servicoDeAplicacaoDeAutenticacao.logout(),
        iniciarLoginComGoogle: () => servicoDeAplicacaoDeAutenticacao.iniciarLoginComGoogle(),
        // Ação de finalizar o login com Google também deve ser exposta
        finalizarLoginComGoogle: (idToken: string) => servicoDeAplicacaoDeAutenticacao.finalizarLoginComGoogle(idToken),
    };
};
