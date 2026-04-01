
import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../SistemaFlux/Provedores/Provedor.Autenticacao';

// Importa os arrays de rotas dos módulos
import { authRoutes } from './Rotas.Autenticacao';
import { feedRoutes } from './Rotas.Feed';
import { reelRoutes } from './Rotas.Reels';
import { groupRoutes } from './Rotas.Grupos';
import { groupSettingsRoutes } from './Rotas.Grupos.Configuracoes';
import { marketplaceRoutes } from './Rotas.Marketplace';
import { profileRoutes } from './Rotas.Perfil';
import { settingsRoutes } from './Rotas.Configuracoes';
import { financialRoutes } from './Rotas.Financeiro';
import { notificationRoutes } from './Rotas.Notificacoes';
import { messageRoutes } from './Rotas.Mensagens';
import { miscRoutes } from './Rotas.Diversos';

// Componente de Loading
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#0c0f14] text-white">
    <i className="fa-solid fa-circle-notch fa-spin text-3xl text-[#00c2ff]"></i>
  </div>
);

// Componente de Rota Protegida
const RotaProtegida = ({ children }) => {
  const { autenticado, processando } = useAuth();

  if (processando) {
    return <LoadingSpinner />;
  }

  if (!autenticado) {
    return <Navigate to="/login" replace />;
  }

  return children;
};


// Rotas que exigem autenticação
const protectedRoutes = [
  ...feedRoutes,
  ...reelRoutes,
  ...groupRoutes,
  ...groupSettingsRoutes,
  ...marketplaceRoutes,
  ...profileRoutes,
  ...settingsRoutes,
  ...financialRoutes,
  ...notificationRoutes,
  ...messageRoutes,
];

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Rotas Públicas */}
        {authRoutes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
        {miscRoutes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}

        {/* Rotas Protegidas */}
        {protectedRoutes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={<RotaProtegida>{route.element}</RotaProtegida>}
          />
        ))}

        {/* Rota Fallback: Redireciona para o feed (que será protegido) se nenhuma outra rota corresponder */}
        <Route path="*" element={<Navigate to="/feed" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
