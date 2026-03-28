
import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import {
    servicoAutenticacao,
    AuthState,
} from '../../ServiçoDeAutenticação/Auth.Application';
import { Usuario } from '../../../types/Usuario';

// --- Tipagem do Contexto ---
interface AuthContextProps {
  usuario: Usuario | null;
  autenticado: boolean;
  processando: boolean;
  erro: string | null;
  login: (params: { email: string, senha: string }) => Promise<void>;
  logout: () => Promise<void>;
  iniciarLoginComGoogle: () => void; // Adicionado
}

// --- Contexto ---
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// --- Hook para Consumo ---
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

// --- Provider ---
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authState, setAuthState] = useState<AuthState>(servicoAutenticacao.getState());

  useEffect(() => {
    const unsubscribe = servicoAutenticacao.subscribe(setAuthState);
    return () => unsubscribe();
  }, []);

  const value: AuthContextProps = {
    usuario: authState.usuario,
    autenticado: authState.autenticado,
    processando: authState.processando,
    erro: authState.erro,
    login: servicoAutenticacao.login.bind(servicoAutenticacao),
    logout: servicoAutenticacao.logout.bind(servicoAutenticacao),
    iniciarLoginComGoogle: servicoAutenticacao.iniciarLoginComGoogle.bind(servicoAutenticacao), // Adicionado
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
