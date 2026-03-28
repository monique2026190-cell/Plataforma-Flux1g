
import React, { lazy } from 'react';

const PG_Lista_Conversas = lazy(() => import('../pages/PG.Lista.Conversas').then(m => ({ default: m.PG_Lista_Conversas })));

export const messageRoutes = [
  { path: '/messages', element: <PG_Lista_Conversas /> }
];
