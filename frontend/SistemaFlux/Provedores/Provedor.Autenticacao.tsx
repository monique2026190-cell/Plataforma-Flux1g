
import React, { createContext, useState, useCallback, useEffect, useContext } from 'react';
import { servicoAutenticacao } from '../../ServiçosFrontend/Servico.Autenticacao';

// Tipagem para o objeto de usuário
interface Usuario {
  id: string;
  nome: string;
  email: string;
  apelido?: string;
  avatarUrl?: string;
  perfilCompleto: boolean;
}

// Tipagem para a resposta do token do Google
interface GoogleTokenResponse {
  access_token: string;
}

// Tipagem para o contexto de autenticação
export interface AuthContextType {
  usuario: Usuario | null;
  autenticado: boolean;
  erro: string | null;

  processandoLogin: boolean;
  processandoLogout: boolean;
  processandoSessao: boolean;
  processandoPerfil: boolean;
  sessaoVerificada: boolean;

  possibilitaLoginComEmail: (credenciais: { email: string; senha: string }) => Promise<Usuario>;
  possibilitaFinalizarLoginComGoogle: (tokenResponse: GoogleTokenResponse) => Promise<Usuario>;
  possibilitaLogout: () => Promise<void>;
  possibilitaLimparErro: () => void;
  possibilitaCompletarPerfil: (dados: FormData) => Promise<void>;
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
  const [erro, setErro] = useState<string | null>(null);

  // --- Estados de Carregamento Granulares ---
  const [processandoLogin, setProcessandoLogin] = useState<boolean>(false);
  const [processandoLogout, setProcessandoLogout] = useState<boolean>(false);
  const [processandoSessao, setProcessandoSessao] = useState<boolean>(true);
  const [processandoPerfil, setProcessandoPerfil] = useState<boolean>(false);
  const [sessaoVerificada, setSessaoVerificada] = useState<boolean>(false);

  const possibilitaLimparErro = useCallback(() => {
    setErro(null);
  }, []);

  const possibilitaLogout = useCallback(async () => {
    setProcessandoLogout(true);
    setErro(null);
    try {
      await servicoAutenticacao.possibilidade1Logout();
      setUsuario(null);
      setAutenticado(false);
    } catch (error: any) {
      setErro(error.message || 'Erro ao fazer logout');
    } finally {
      setProcessandoLogout(false);
    }
  }, []);

  const possibilitaLoginComEmail = useCallback(async (credenciais: { email: string; senha: string }): Promise<Usuario> => {
    setProcessandoLogin(true);
    setErro(null);
    try {
      const { usuario } = await servicoAutenticacao.possibilidade1LoginComEmail(credenciais);
      setUsuario(usuario);
      setAutenticado(true);
      return usuario;
    } catch (error: any) {
      console.error("🔥 Login com Email erro completo:", error);
      setErro(error?.message || 'Falha no login com Email');
      throw error;
    } finally {
      setProcessandoLogin(false);
    }
  }, []);

  const possibilitaFinalizarLoginComGoogle = useCallback(async (tokenResponse: GoogleTokenResponse): Promise<Usuario> => {
    setProcessandoLogin(true);
    setErro(null);
    try {
      const { usuario } = await servicoAutenticacao.possibilidade1LidarComLoginGoogle(tokenResponse);
      setUsuario(usuario);
      setAutenticado(true);
      return usuario;
    } catch (error: any) {
      console.error("🔥 Login Google erro completo:", error);
      setErro(error?.message || 'Falha no login com Google');
      throw error;
    } finally {
      setProcessandoLogin(false);
    }
  }, []);

  const possibilitaCompletarPerfil = useCallback(async (dadosPerfil: FormData) => {
    if (!usuario) {
      throw new Error("Usuário não autenticado para completar o perfil.");
    }
    setProcessandoPerfil(true);
    setErro(null);
    try {
      const usuarioAtualizado = await servicoAutenticacao.possibilidade1CompletarPerfil(usuario.id, dadosPerfil);
      setUsuario(prev => ({ ...prev!, ...usuarioAtualizado, perfilCompleto: true }));
    } catch (error: any) {
      setErro(error.message || 'Erro ao completar o perfil');
      throw error;
    } finally {
      setProcessandoPerfil(false);
    }
  }, [usuario]);

  useEffect(() => {
    if (autenticado) return;

    const verificarSessao = async () => {
      setProcessandoSessao(true);
      try {
        const usuarioSessao = await servicoAutenticacao.possibilidade1VerificarSessao();
        if (usuarioSessao) {
          setUsuario(usuarioSessao);
          setAutenticado(true);
        }
      } catch (error) {
        console.error("Falha ao verificar sessão:", error);
      } finally {
        setProcessandoSessao(false);
        setSessaoVerificada(true);
      }
    };
    
    verificarSessao();
  }, [autenticado]);

  const value: AuthContextType = {
    usuario,
    autenticado,
    erro,
    processandoLogin,
    processandoLogout,
    processandoSessao,
    processandoPerfil,
    sessaoVerificada,
    possibilitaLoginComEmail,
    possibilitaFinalizarLoginComGoogle,
    possibilitaLogout,
    possibilitaLimparErro,
    possibilitaCompletarPerfil,
  };

  return (
    <AuthContext.Provider value={value}>
      {sessaoVerificada ? children : null}
    </AuthContext.Provider>
  );
};
