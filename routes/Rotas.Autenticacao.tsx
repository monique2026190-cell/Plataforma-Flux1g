import React, { lazy } from 'react';
import { PublicRoute } from './Rotas.Protegidas'; // Importa o PublicRoute

const Login = lazy(() => import('../pages/Login').then(module => ({ default: module.Login })));
const Register = lazy(() => import('../pages/Register').then(module => ({ default: module.Register })));
const VerifyEmail = lazy(() => import('../pages/VerifyEmail').then(module => ({ default: module.VerifyEmail })));
const ForgotPassword = lazy(() => import('../pages/ForgotPassword').then(module => ({ default: module.ForgotPassword })));
const ResetPassword = lazy(() => import('../pages/ResetPassword').then(module => ({ default: module.ResetPassword })));
const Banned = lazy(() => import('../pages/Banned').then(module => ({ default: module.Banned })));

export const authRoutes = [
  { 
    path: '/', 
    element: <PublicRoute><Login /></PublicRoute> 
  },
  { 
    path: '/register', 
    element: <PublicRoute><Register /></PublicRoute> 
  },
  { 
    path: '/verify-email', 
    element: <PublicRoute><VerifyEmail /></PublicRoute> 
  },
  { 
    path: '/forgot-password', 
    element: <PublicRoute><ForgotPassword /></PublicRoute> 
  },
  { 
    path: '/reset-password', 
    element: <PublicRoute><ResetPassword /></PublicRoute> 
  },
  {
    // A página de banido pode ser acessada mesmo logado, então não usamos PublicRoute
    path: '/banned', 
    element: <Banned />
  }
];
