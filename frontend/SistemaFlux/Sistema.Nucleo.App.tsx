
import React, { useState, useEffect, Suspense, lazy } from 'react';
import '../../index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import VariaveisFrontend from './Variaveis.Frontend';
import { ProvedorInterface } from './Provedores/Provedor.Interface';
import { ProvedorNavegacao } from './Provedores/Provedor.Navegacao';
import { ProvedorAutenticacao } from './Provedores/Provedor.Autenticacao';
import AppRoutes from '../routes/AppRoutes';

const PaginaManutencao = lazy(() => import('../pages/Maintenance'));

const TelaDeCarregamento = () => (
    <div className="h-screen w-full bg-[#0c0f14] flex flex-col items-center justify-center gap-4">
        <i className="fa-solid fa-circle-notch fa-spin text-[#00c2ff] text-2xl"></i>
        <span className="text-[10px] font-black text-gray-500 uppercase tracking-[3px]">
            Carregando...
        </span>
    </div>
);

/**
 * Hook customizado para verificar o status de manutenção da aplicação de forma robusta.
 * Ele busca um arquivo de configuração com um timeout para evitar travamentos.
 */
const useStatusManutencao = () => {
  const [emManutencao, setEmManutencao] = useState(false);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
        console.warn("A verificação de manutenção excedeu o tempo limite.");
        controller.abort();
    }, 5000); // Timeout de 5 segundos

    fetch('/config.json', { signal: controller.signal })
      .then(res => {
        if (!res.ok) {
          throw new Error('Falha ao buscar config.json');
        }
        return res.json();
      })
      .then(config => {
        setEmManutencao(config.maintenanceMode || false);
      })
      .catch((error) => {
        if (error.name !== 'AbortError') {
          console.error("Erro ao verificar status de manutenção:", error);
        }
        setEmManutencao(false);
      })
      .finally(() => {
        clearTimeout(timeoutId);
        setCarregando(false);
      });

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  return { carregando, emManutencao };
};

/**
 * Componente principal que estrutura o núcleo da aplicação.
 * Gerencia o estado de manutenção, os provedores de contexto e as rotas.
 */
const SistemaNucleoApp: React.FC = () => {
  const { carregando, emManutencao } = useStatusManutencao();

  if (!VariaveisFrontend.googleClientId || VariaveisFrontend.googleClientId === 'CHAVE_NAO_DEFINIDA') {
    console.error("Erro Crítico: O Google Client ID não está configurado.");
    return (
        <div className="h-screen w-full bg-[#0c0f14] flex flex-col items-center justify-center gap-4">
            <span className="text-lg font-bold text-red-500">Erro de Configuração</span>
            <span className="text-sm text-gray-400 text-center px-4">O Google Client ID não foi encontrado. A aplicação não pode ser iniciada.</span>
        </div>
    );
  }
  
  return (
    <GoogleOAuthProvider clientId={VariaveisFrontend.googleClientId}>
        <Suspense fallback={<TelaDeCarregamento />}>
            {carregando ? (
                <TelaDeCarregamento />
            ) : emManutencao ? (
                <PaginaManutencao />
            ) : (
                <ProvedorAutenticacao>
                    <ProvedorInterface>
                        <ProvedorNavegacao>
                            <AppRoutes />
                        </ProvedorNavegacao>
                    </ProvedorInterface>
                </ProvedorAutenticacao>
            )}
        </Suspense>
    </GoogleOAuthProvider>
  );
};

export default SistemaNucleoApp;
