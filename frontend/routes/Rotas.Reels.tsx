
import React, { lazy } from 'react';

const PG_Reels = lazy(() => import('../pages/PG.Reels').then(module => ({ default: module.PG_Reels })));
const CreateReel = lazy(() => import('../pages/CreateReel').then(module => ({ default: module.CreateReel })));
const ReelsSearch = lazy(() => import('../pages/ReelsSearch').then(module => ({ default: module.ReelsSearch })));

export const reelRoutes = [
  { path: '/reels', element: <PG_Reels /> },
  { path: '/reels/:id', element: <PG_Reels /> },
  { path: '/reels-search', element: <ReelsSearch /> },
  { path: '/create-reel', element: <CreateReel /> },
];
