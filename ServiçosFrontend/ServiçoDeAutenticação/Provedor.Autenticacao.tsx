
// ServiçosFrontend/ServiçoDeAutenticação/Provedor.Autenticacao.tsx

import React, { createContext, useState, useEffect, useContext, ReactNode, useMemo } from 'react';
import { getInstanciaSuprema } from './Sistema.Autenticacao.Supremo';
import { UsuarioAutenticado } from '../Contratos/Contrato.Autenticacao';
import api from '../Cliente.Backend'; // Importa a instância da API

// --- Tipos & Interfaces ---
type StatusSessao = 'carregando' | 'autenticado' | 'anonimo';

interface EstadoAutenticacao {
  usuario: UsuarioAutenticado | null;
  status: StatusSessao;
  erro: Error | null;
}

interface ContextoAutenticacao extends EstadoAutenticacao {
  servico: any; // O tipo real do serviço, se necessário expor métodos
}

const AuthContext = createContext<ContextoAutenticacao | undefined>(undefined);

// --- Componente Provedor ---
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const servicoAutenticacao = useMemo(() => getInstanciaSuprema(api), []);

    const [estado, setEstado] = useState<EstadoAutenticacao>({
        usuario: null,
        status: 'carregando',
        erro: null,
    });

    useEffect(() => {
        const verificarSessao = async () => {
            try {
                const { usuario } = await servicoAutenticacao.verificarSessao();
                if (usuario) {
                    setEstado({ usuario, status: 'autenticado', erro: null });
                } else {
                    setEstado({ usuario: null, status: 'anonimo', erro: null });
                }
            } catch (err) {
                setEstado({ usuario: null, status: 'anonimo', erro: err as Error });
            }
        };

        verificarSessao();
    }, [servicoAutenticacao]);

    const contextoValor = useMemo(() => ({
        ...estado,
        servico: servicoAutenticacao, // Expondo o serviço para os componentes filhos
    }), [estado, servicoAutenticacao]);

    return (
        <AuthContext.Provider value={contextoValor}>
            {children}
        </AuthContext.Provider>
    );
};

// --- Hook Customizado ---
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
};
