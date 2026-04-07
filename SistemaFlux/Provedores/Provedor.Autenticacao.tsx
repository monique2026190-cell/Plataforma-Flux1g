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
  completarPerfil: (dados: FormData) => Promise<void>;
  verificarStatusPerfil: () => Promise<void>;
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

  const completarPerfil = useCallback(async (dadosPerfil: FormData) => {
    if (!usuario) throw new Error("Usuário não autenticado.");
    setProcessando(true);
    try {
      const usuarioAtualizado = await servicoAutenticacao.completarPerfil(usuario.id, dadosPerfil);
      setUsuario(prev => {
        if (!prev) return null;
        const novoUsuario = {
            ...prev,
            ...usuarioAtualizado,
            perfilCompleto: true 
        };
        return novoUsuario;
      });
    } catch (error: any) {
      setErro(error.message || 'Erro ao completar o perfil');
      throw error;
    } finally {
      setProcessando(false);
    }
  }, [usuario]);

  const verificarStatusPerfil = useCallback(async () => {
    if (!autenticado) return;
    setProcessando(true);
    try {
      const resposta = await servicoAutenticacao.verificarStatusPerfil();
      if (resposta.sucesso && typeof resposta.dados?.perfilCompleto === 'boolean') {
        setUsuario(prev => {
          if (prev && prev.perfilCompleto !== resposta.dados.perfilCompleto) {
            return { ...prev, perfilCompleto: resposta.dados.perfilCompleto };
          }
          return prev;
        });
      }
    } catch (error: any) {
      console.error("Erro ao verificar status do perfil:", error);
      setErro(error.message || 'Erro ao verificar status do perfil');
    } finally {
      setProcessando(false);
    }
  }, [autenticado]);

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

  useEffect(() => {
    if (autenticado) {
      verificarStatusPerfil();
    }
  }, [autenticado, verificarStatusPerfil]);

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
    verificarStatusPerfil,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
