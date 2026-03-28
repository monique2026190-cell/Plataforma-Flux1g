
import React, { lazy } from 'react';

// Garante que todos os componentes lazy usem a sintaxe correta para importações nomeadas.
const FinancialPanel = lazy(() => import('../pages/FinancialPanel').then(module => ({ default: module.FinancialPanel })));
const ProviderConfig = lazy(() => import('../pages/ProviderConfig').then(module => ({ default: module.ProviderConfig })));
const TransactionHistoryPage = lazy(() => import('../pages/TransactionHistoryPage').then(module => ({ default: module.TransactionHistoryPage })));

export const financialRoutes = [
  {
    path: '/financial',
    element: <FinancialPanel />
  },
  {
    path: '/financial/providers',
    element: <ProviderConfig />
  },
  {
    path: '/financial/transactions',
    element: <TransactionHistoryPage />
  }
];
