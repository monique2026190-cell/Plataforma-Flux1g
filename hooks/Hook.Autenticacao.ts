
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { dadosProviderSessao } from '../ServiçosFrontend/Infra/Dados.Provider.Sessao';
import { mapearBackendParaFrontend } from '../ServiçosFrontend/Contratos/Contrato.Comunicacao.Usuario';

interface Usuario {
  id: string;
  nome: string;
  email: string;
  apelido?: string;
  avatarUrl?: string;
  perfilCompleto: boolean;
}

interface AuthContextType {
  usuario: Usuario | null;
  autenticado: boolean;
  processando: boolean;
  erro: string | null;
  loginComEmail: (credenciais: { email: string; senha: string }) => Promise<void>;
  iniciarLoginComGoogle: () => void;
  finalizarLoginComGoogle: (tokenResponse: any) => Promise<void>;
  logout: () => void;
  limparErro: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [autenticado, setAutenticado] = useState<boolean>(false);
  const [processando, setProcessando] = useState<boolean>(false);
  const [erro, setErro] = useState<string | null>(null);

  const logout = useCallback(() => {
    setUsuario(null);
    setAutenticado(false);
    localStorage.removeItem('auth_token');
  }, []);

  const limparErro = useCallback(() => {
    setErro(null);
  }, []);

  const loginComEmail = useCallback(async (credenciais: { email: string; senha: string }) => {
    setProcessando(true);
    setErro(null);
    try {
      const resposta = await dadosProviderSessao.login(credenciais.email, credenciais.senha);
      if (resposta.sucesso && resposta.dados) {
        const dadosUsuario = mapearBackendParaFrontend(resposta.dados.user);
        setUsuario(dadosUsuario);
        setAutenticado(true);
        if (resposta.dados.token) {
          localStorage.setItem('auth_token', resposta.dados.token);
        }
      } else {
        throw new Error(resposta.mensagem || 'Falha no login');
      }
    } catch (error: any) {
      const mensagemErro = error.message || 'Erro ao fazer login';
      setErro(mensagemErro);
      throw error;
    } finally {
      setProcessando(false);
    }
  }, []);

  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      finalizarLoginComGoogle(tokenResponse);
    },
    onError: (error) => {
      console.error('Erro no login Google:', error);
      setErro('Falha ao fazer login com Google');
      setProcessando(false);
    },
  });

  const iniciarLoginComGoogle = useCallback(() => {
    setProcessando(true);
    setErro(null);
    googleLogin();
  }, [googleLogin]);

  const finalizarLoginComGoogle = useCallback(async (tokenResponse: any) => {
    try {
      const accessToken = tokenResponse.access_token;
      
      const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`);
      const userInfo = await response.json();
      
      const dadosLogin = {
        nome: userInfo.name || '',
        email: userInfo.email,
        googleId: userInfo.sub,
        avatarUrl: userInfo.picture || '',
        tokenProvider: accessToken,
      };

      const resposta = await dadosProviderSessao.lidarComLoginSocial(dadosLogin);
      
      if (resposta.sucesso && resposta.dados) {
        const dadosUsuario = mapearBackendParaFrontend(resposta.dados.user);
        setUsuario(dadosUsuario);
        setAutenticado(true);
        if (resposta.dados.token) {
          localStorage.setItem('auth_token', resposta.dados.token);
        }
      } else {
        throw new Error(resposta.mensagem || 'Falha no login com Google');
      }
    } catch (error: any) {
      console.error('Erro ao finalizar login Google:', error);
      setErro(error.message || 'Falha ao fazer login com Google');
    } finally {
      setProcessando(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      setAutenticado(true);
    }
  }, []);

  const value: AuthContextType = {
    usuario,
    autenticado,
    processando,
    erro,
    loginComEmail,
    iniciarLoginComGoogle,
    finalizarLoginComGoogle,
    logout,
    limparErro,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
