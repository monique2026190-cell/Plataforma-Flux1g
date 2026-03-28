
import React, { lazy } from 'react';

const Chat = lazy(() => import('../pages/Chat').then(m => ({ default: m.Chat })));
const GlobalSearch = lazy(() => import('../pages/GlobalSearch').then(m => ({ default: m.GlobalSearch })));
const Leaderboard = lazy(() => import('../pages/Leaderboard').then(m => ({ default: m.Leaderboard })));
const LocationSelector = lazy(() => import('../pages/LocationSelector').then(m => ({ default: m.LocationSelector })));
const Maintenance = lazy(() => import('../pages/Maintenance').then(m => ({ default: m.Maintenance })));
const TopGroups = lazy(() => import('../pages/TopGroups').then(m => ({ default: m.TopGroups })));
const TopGroupsPrivate = lazy(() => import('../pages/TopGroupsPrivate').then(m => ({ default: m.TopGroupsPrivate })));
const TopGroupsPublic = lazy(() => import('../pages/TopGroupsPublic').then(m => ({ default: m.TopGroupsPublic })));
const TopGroupsVip = lazy(() => import('../pages/TopGroupsVip').then(m => ({ default: m.TopGroupsVip })));

export const miscRoutes = [
  { path: '/chat/:id', element: <Chat /> },
  { path: '/global-search', element: <GlobalSearch /> },
  { path: '/leaderboard', element: <Leaderboard /> },
  { path: '/location-selector', element: <LocationSelector /> },
  { path: '/maintenance', element: <Maintenance /> },
  { path: '/top-groups', element: <TopGroups /> },
  { path: '/top-groups/private', element: <TopGroupsPrivate /> },
  { path: '/top-groups/public', element: <TopGroupsPublic /> },
  { path: '/top-groups/vip', element: <TopGroupsVip /> }
];
