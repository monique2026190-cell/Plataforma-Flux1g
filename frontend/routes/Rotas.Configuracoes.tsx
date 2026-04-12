
import React, { lazy } from 'react';

const Settings = lazy(() => import('../pages/Settings').then(m => ({ default: m.Settings })));
const LanguageSettings = lazy(() => import('../pages/LanguageSettings').then(m => ({ default: m.LanguageSettings })));
const TermsAndPrivacy = lazy(() => import('../pages/TermsAndPrivacy').then(m => ({ default: m.TermsAndPrivacy })));
const HelpSupport = lazy(() => import('../pages/HelpSupport').then(m => ({ default: m.HelpSupport })));
const PG_Configuracao_Notificacao = lazy(() => import('../pages/PG.Configuracao.Notificacao').then(m => ({ default: m.PG_Configuracao_Notificacao })));
const PG_Configuracao_GestaoDeBloqueios = lazy(() => import('../pages/PG.Configuracao.GestaoDeBloqueios').then(m => ({ default: m.PG_Configuracao_GestaoDeBloqueios })));
const PG_Configuracao_SegurancaELogin = lazy(() => import('../pages/PG.Configuracao.SegurancaELogin').then(m => ({ default: m.PG_Configuracao_SegurancaELogin })));

export const settingsRoutes = [
  { path: '/settings', element: <Settings /> },
  { path: '/settings/language', element: <LanguageSettings /> },
  { path: '/terms', element: <TermsAndPrivacy /> },
  { path: '/help', element: <HelpSupport /> },
  { path: '/pg-configuracao-notificacao', element: <PG_Configuracao_Notificacao /> },
  { path: '/pg-configuracao-gestao-de-bloqueios', element: <PG_Configuracao_GestaoDeBloqueios /> },
  { path: '/pg-configuracao-seguranca-e-login', element: <PG_Configuracao_SegurancaELogin /> }
];
