
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { HashRouter } from 'react-router-dom';
import { ProvedorModal } from '../Componentes/ComponenteDeInterfaceDeUsuario/Sistema.Modal';
import { GlobalTracker } from '../Componentes/layout/GlobalTracker';
import { DeepLinkHandler } from '../Componentes/layout/DeepLinkHandler';
import AppRoutes from '../routes/AppRoutes';
import MonitorDeErrosDeInterface from '../Componentes/ComponentesDePrevençãoDeErros/MonitorDeErrosDeInterface.jsx';
import { AuthProvider } from '../ServiçosFrontend/ServiçoDeAutenticação/Provedor.Autenticacao.tsx';

const Maintenance = lazy(() => import('../pages/Maintenance'));

const LoadingFallback = () => (
    <div className="h-screen w-full bg-[#0c0f14] flex flex-col items-center justify-center gap-4">
        <i className="fa-solid fa-circle-notch fa-spin text-[#00c2ff] text-2xl"></i>
        <span className="text-[10px] font-black text-gray-500 uppercase tracking-[3px]">
            Carregando...
        </span>
    </div>
);

const SistemaNucleoApp: React.FC = () => {
  // O estado de manutenção pode ser controlado por um serviço ou configuração externa no futuro.
  const [isMaintenance] = useState(false);

  if (isMaintenance) {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <Maintenance />
        </Suspense>
    );
  }

  // O componente agora é 'puro'. Ele não orquestra mais a inicialização.
  // Apenas renderiza a estrutura da UI, assumindo que os serviços já foram inicializados.
  return (
    <MonitorDeErrosDeInterface>
      <AuthProvider>
        <ProvedorModal>
          <HashRouter>
            <GlobalTracker />
            <DeepLinkHandler />
            <Suspense fallback={<LoadingFallback />}>
              <AppRoutes />
            </Suspense>
          </HashRouter>
        </ProvedorModal>
      </AuthProvider>
    </MonitorDeErrosDeInterface>
  );
};

export default SistemaNucleoApp;
