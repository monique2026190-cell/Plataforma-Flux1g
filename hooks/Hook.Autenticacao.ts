
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { servicoDeAplicacaoDeAutenticacao, AuthApplicationState } from '../ServiçosFrontend/ServicosDeAplicacao/Autenticacao.ServicoDeAplicacao';
import { ILoginEmailParams } from '../ServiçosFrontend/Contratos/Contrato.Autenticacao';

export const useAutenticacao = () => {
  const [authState, setAuthState] = useState<AuthApplicationState>(servicoDeAplicacaoDeAutenticacao.getState());
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthStateChange = (newState: AuthApplicationState) => {
      setAuthState(newState);
      
      // A lógica de navegação agora é controlada pela camada de aplicação
      if (newState.postLoginAction === 'navigateToCompleteProfile') {
        navigate('/completar-perfil');
      } else if (newState.postLoginAction === 'navigateToFeed') {
        navigate('/feed');
      }
    };

    const unsubscribe = servicoDeAplicacaoDeAutenticacao.subscribe(handleAuthStateChange);
    return () => unsubscribe();
  }, [navigate]);

  const loginComEmail = useCallback(async (credentials: ILoginEmailParams) => {
    try {
      await servicoDeAplicacaoDeAutenticacao.loginComEmail(credentials);
    } catch (error) {
      console.error("Falha no login com email:", error); // Opcional: pode mostrar um toast ou similar
    }
  }, []);

  const iniciarLoginComGoogle = useCallback(() => {
    servicoDeAplicacaoDeAutenticacao.iniciarLoginComGoogle();
  }, []);

  const logout = useCallback(async () => {
    await servicoDeAplicacaoDeAutenticacao.logout();
    navigate('/login'); // A navegação de logout pode permanecer aqui ou ser movida também
  }, [navigate]);

  return {
    usuario: authState.user,
    autenticado: authState.isAuthenticated,
    processando: authState.loading,
    erro: authState.error,
    loginComEmail,
    iniciarLoginComGoogle,
    logout,
  };
};
