
import { useContext } from 'react';
import { AuthContext, AuthContextType } from '../Provedores/Provedor.Autenticacao';

/**
 * Hook customizado para acessar o contexto de autenticação.
 * Fornece acesso ao estado do usuário, status da autenticação,
 * e funções para login, logout, etc.
 *
 * @returns O contexto de autenticação.
 * @throws {Error} Se usado fora de um ProvedorAutenticacao.
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um ProvedorAutenticacao');
  }
  return context;
};
