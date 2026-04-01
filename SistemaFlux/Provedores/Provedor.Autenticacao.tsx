import React, { createContext, useState, useCallback, useEffect, useContext } from 'react';
import { servicoAutenticacao } from '../../ServiçosFrontend/Servico.Autenticacao';

interface Usuario {
  id: string;
  nome: string;
  email: string;
  apelido?: string;
  avatarUrl?: string;
  perfilCompleto: boolean;
}

export interface AuthContextType {
  usuario: Usuario | null;
  autenticado: boolean;
  processando: boolean;
  erro: string | null;
  loginComEmail: (credenciais: { email: string; senha: string }) => Promise<void>;
  processarLoginGoogle: (tokenResponse: any) => Promise<void>;
  logout: () => void;
  limparErro: () => void;
  completarPerfil: (dados: { apelido: string; nome: string; bio: string; avatar: File | null }) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser utilizado dentro de um ProvedorAutenticacao');
  }
  return context;
};

interface ProvedorAutenticacaoProps {
  children: React.ReactNode;
}

export const ProvedorAutenticacao: React.FC<ProvedorAutenticacaoProps> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [autenticado, setAutenticado] = useState<boolean>(false);
  const [processando, setProcessando] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);

  const logout = useCallback(() => {
    servicoAutenticacao.logout();
    setUsuario(null);
    setAutenticado(false);
  }, []);

  const limparErro = useCallback(() => {
    setErro(null);
  }, []);

  const loginComEmail = useCallback(async (credenciais: { email: string; senha: string }) => {
    setProcessando(true);
    setErro(null);
    try {
      const { usuario } = await servicoAutenticacao.loginComEmail(credenciais);
      setUsuario(usuario);
      setAutenticado(true);
    } catch (error: any) {
      setErro(error.message || 'Erro ao fazer login');
      throw error;
    } finally {
      setProcessando(false);
    }
  }, []);

  const processarLoginGoogle = useCallback(async (tokenResponse: any) => {
    setProcessando(true);
    try {
      const { usuario } = await servicoAutenticacao.lidarComLoginGoogle(tokenResponse);
      setUsuario(usuario);
      setAutenticado(true);
    } catch (error: any) {
      setErro(error.message || 'Falha no login com Google');
      throw error;
    } finally {
      setProcessando(false);
    }
  }, []);

  const completarPerfil = useCallback(async (dados: { apelido: string; nome: string; bio: string; avatar: File | null }) => {
    if (!usuario) throw new Error("Usuário não autenticado.");
    setProcessando(true);
    try {
      const usuarioAtualizado = await servicoAutenticacao.completarPerfil(
        usuario.id,
        dados.apelido,
        dados.nome,
        dados.bio,
        dados.avatar
      );
      setUsuario(usuarioAtualizado);
    } catch (error: any) {
      setErro(error.message || 'Erro ao completar o perfil');
      throw error;
    } finally {
      setProcessando(false);
    }
  }, [usuario]);

  useEffect(() => {
    const verificarSessao = async () => {
      setProcessando(true);
      const usuario = await servicoAutenticacao.verificarSessao();
      if (usuario) {
        setUsuario(usuario);
        setAutenticado(true);
      }
      setProcessando(false);
    };
    
    verificarSessao();
  }, []);

  const value: AuthContextType = {
    usuario,
    autenticado,
    processando,
    erro,
    loginComEmail,
    processarLoginGoogle,
    logout,
    limparErro,
    completarPerfil,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
