
import React, { lazy } from 'react';

const Notifications = lazy(() => import('../pages/Notifications').then(m => ({ default: m.Notifications })));

export const notificationRoutes = [
  { path: '/notifications', element: <Notifications /> }
];
