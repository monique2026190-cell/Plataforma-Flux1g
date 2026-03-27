
import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { servicoAutenticacao } from '../ServiçosFrontend/ServiçoDeAutenticação/Auth.Application';
import { ModalTelaCarregamento } from '../Componentes/ComponenteDeInterfaceDeUsuario/Modal.Tela.Carregamento';
import { Usuario } from '../ServiçosFrontend/ServiçoDeAutenticação/Processo.Gestao.Conta';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const authService = servicoAutenticacao;

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const [user, setUser] = useState<Usuario | null>(authService.getCurrentUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleAuthChange = () => {
      setUser(authService.getCurrentUser());
    };

    window.addEventListener('authChange', handleAuthChange);

    // Se não houver usuário no estado inicial, tenta validar a sessão.
    if (!user) {
      authService.obterSessao()
        .then(validatedUser => {
          if (validatedUser) {
            setUser(validatedUser);
          }
        })
        .catch(error => {
          console.error("Falha ao validar a sessão:", error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }

    return () => {
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  if (loading) {
    return <ModalTelaCarregamento />;
  }

  if (!user) {
    if (location.pathname !== '/' && !location.pathname.includes('login')) {
      sessionStorage.setItem('redirect_after_login', location.pathname + location.search);
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
