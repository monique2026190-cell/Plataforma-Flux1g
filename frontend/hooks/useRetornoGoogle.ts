
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../SistemaFlux/Provedores/Provedor.Autenticacao';

/**
 * Hook customizado para gerenciar a lógica de callback do Google OAuth de forma robusta.
 * Garante execução única, limpa a URL e lida com a autenticação e redirecionamento.
 */
export const useRetornoGoogle = () => {
  const navegar = useNavigate();
  const { possibilitaFinalizarLoginComGoogle } = useAuth();
  const jaExecutou = useRef(false);

  useEffect(() => {
    // Garante que a lógica execute apenas uma vez, mesmo em React Strict Mode.
    if (jaExecutou.current) return;
    jaExecutou.current = true;

    const hash = window.location.hash.substring(1);
    const parametros = new URLSearchParams(hash);
    const tokenDeAcesso = parametros.get('access_token')?.trim();

    // Limpa o hash da URL por segurança e para evitar que o token fique exposto.
    window.history.replaceState(null, '', window.location.pathname);

    if (!tokenDeAcesso) {
      console.error("[GoogleAuth] Token de acesso não encontrado na URL de callback.");
      navegar('/login?error=google_auth_failed', { replace: true });
      return;
    }

    possibilitaFinalizarLoginComGoogle({ access_token: tokenDeAcesso })
      .then((resposta) => {
        // CORREÇÃO: A lógica de redirecionamento agora obedece a resposta da API.
        // O backend envia `{ isNewUser: boolean, redirectRoute: string }`.
        
        if (resposta.isNewUser) {
            // Se for um novo usuário, redireciona para completar o perfil.
            navegar('/complete-profile', { replace: true });
        } else if (resposta.redirectRoute) {
            // Se for um usuário existente, usa a rota enviada pelo backend.
            const rotaDestino = `/${resposta.redirectRoute.toLowerCase()}`;
            navegar(rotaDestino, { replace: true });
        } else {
            // Fallback de segurança caso a API não retorne a rota esperada.
            console.warn("[GoogleAuth] A API não retornou 'redirectRoute'. Redirecionando para /feed.");
            navegar('/feed', { replace: true });
        }
      })
      .catch((erro) => {
        console.error("[GoogleAuth] Falha ao finalizar o login com Google:", erro);
        navegar('/login?error=google_auth_failed', { replace: true });
      });

  }, [navegar, possibilitaFinalizarLoginComGoogle]);
};
