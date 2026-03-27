import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { processoLogin } from '../ServiçosFrontend/ServiçoDeAutenticação/Processo.Login';
import { IUsuario } from '../ServiçosFrontend/ServiçoDeAutenticação/Processo.Login';
import { ModalTelaCarregamento } from '../Componentes/ComponenteDeInterfaceDeUsuario/Modal.Tela.Carregamento';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const location = useLocation();
  const [estado, setEstado] = useState(processoLogin.obterEstadoAtual());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // A lógica de inicialização do Processo.Login agora acontece no construtor,
    // então podemos apenas obter o estado.
    setEstado(processoLogin.obterEstadoAtual());
    setLoading(false);

    // Opcional: Adicionar um ouvinte se o estado puder mudar dinamicamente
    // sem um recarregamento de página.
  }, []);

  if (loading) {
    return <ModalTelaCarregamento />;
  }

  const { autenticado, usuario } = estado;

  if (!autenticado) {
    if (location.pathname !== '/' && !location.pathname.includes('login')) {
      sessionStorage.setItem('redirect_after_login', location.pathname + location.search);
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // LÓGICA DE PERFIL INCOMPLETO - A SER IMPLEMENTADA
  // Assumindo que o objeto 'usuario' tenha uma propriedade como 'perfilCompleto'
  // if (!usuario?.perfilCompleto) {
  //   return <Navigate to="/complete-profile" replace />;
  // }

  return <>{children}</>;
};

interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const [estado, setEstado] = useState(processoLogin.obterEstadoAtual());

  // Idealmente, também usar um useEffect para re-renderizar se o estado mudar.

  if (estado.autenticado) {
    // Se o usuário está autenticado, redireciona para o feed.
    return <Navigate to="/feed" replace />;
  }

  // Se não estiver autenticado, mostra a página pública (Login, Register, etc.)
  return <>{children}</>;
};
