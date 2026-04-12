
import React, { lazy } from 'react';

const PG_Perfil_Proprio = lazy(() => import('../pages/PG.Perfil.Proprio').then(m => ({ default: m.PG_Perfil_Proprio })));
const PG_Perfil_Terceiro = lazy(() => import('../pages/PG.Perfil.Terceiro').then(m => ({ default: m.PG_Perfil_Terceiro })));
const CompleteProfile = lazy(() => import('../pages/CompleteProfile').then(m => ({ default: m.CompleteProfile })));
const Leaderboard = lazy(() => import('../pages/Leaderboard').then(m => ({ default: m.Leaderboard })));
const PG_Edicao_Perfil = lazy(() => import('../pages/PG.Edicao.Perfil').then(m => ({ default: m.PG_Edicao_Perfil })));

export const profileRoutes = [
  { path: '/profile', element: <PG_Perfil_Proprio /> },
  { path: '/user/:id', element: <PG_Perfil_Terceiro /> },
  { path: '/complete-profile', element: <CompleteProfile /> },
  { path: '/ranking-followers', element: <Leaderboard /> },
  { path: '/profile/edit', element: <PG_Edicao_Perfil /> }
];
