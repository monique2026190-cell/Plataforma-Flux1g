
import React from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import SistemaNucleoApp from './Sistema.Nucleo.App';
import { loadEnvironment } from '../ServiçosFrontend/ValidaçãoDeAmbiente/config.ts';
import MonitorDeErrosDeInterface from '../Componentes/ComponentesDePrevençãoDeErros/MonitorDeErrosDeInterface.jsx';
import AppFlux from './App.Flux';
import SistemaLog from './Sistema.Log'; // Importa o novo sistema de log

const queryClient = new QueryClient();

/**
 * Ponto de Entrada da Aplicação (Entrypoint).
 */
document.addEventListener('DOMContentLoaded', () => {
  SistemaLog.info("ENTRYPOINT", "DOM carregado. Iniciando o App.Flux...");
  AppFlux.iniciar();
});

/**
 * Monta a árvore de componentes React no elemento DOM #root. (Nível 3)
 */
export function montarNucleoReact() {
  SistemaLog.info("NUCLEO", "Montando o Núcleo React (Nível 3)");
  
  loadEnvironment();

  const rootElement = document.getElementById('root');
  if (!rootElement) {
    SistemaLog.erro("NUCLEO", "Elemento 'root' não foi encontrado. O Núcleo React não pode ser montado.");
    throw new Error("Elemento 'root' não foi encontrado.");
  }

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  if (!googleClientId) {
    SistemaLog.aviso("NUCLEO", "VITE_GOOGLE_CLIENT_ID não definida. A autenticação Google pode falhar.");
  }
  
  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <GoogleOAuthProvider clientId={googleClientId || ""}>
          <MonitorDeErrosDeInterface>
            <SistemaNucleoApp />
          </MonitorDeErrosDeInterface>
        </GoogleOAuthProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );

  SistemaLog.info("NUCLEO", "Núcleo React (Nível 3) montado com sucesso.");
}
