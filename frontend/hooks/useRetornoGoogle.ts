
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
      .then((usuario) => {
        const rotaDestino = usuario.perfilCompleto ? '/feed' : '/complete-profile';
        navegar(rotaDestino, { replace: true });
      })
      .catch((erro) => {
        console.error("[GoogleAuth] Falha ao finalizar o login com Google:", erro);
        navegar('/login?error=google_auth_failed', { replace: true });
      });

  }, [navegar, possibilitaFinalizarLoginComGoogle]);
};
