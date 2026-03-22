
import React, { lazy } from 'react';
import { ProtectedRoute } from './Rotas.Protegidas';

const Feed = lazy(() => import('../pages/Feed').then(module => ({ default: module.Feed })));
const PGDetalhesPostFeed = lazy(() => import('../pages/PG.Detalhes.Post.Feed.tsx').then(module => ({ default: module.PG_Detalhes_Post_Feed })));
const CreatePost = lazy(() => import('../pages/CreatePost').then(module => ({ default: module.CreatePost })));
const CreatePoll = lazy(() => import('../pages/CreatePoll').then(module => ({ default: module.CreatePoll })));
const FeedSearch = lazy(() => import('../pages/FeedSearch').then(module => ({ default: module.FeedSearch })));
const LocationSelector = lazy(() => import('../pages/LocationSelector'));

export const feedRoutes = [
  { path: '/feed', element: <ProtectedRoute><Feed /></ProtectedRoute> },
  { path: '/post/:id', element: <ProtectedRoute><PGDetalhesPostFeed /></ProtectedRoute> },
  { path: '/create-post', element: <ProtectedRoute><CreatePost /></ProtectedRoute> },
  { path: '/create-poll', element: <ProtectedRoute><CreatePoll /></ProtectedRoute> },
  { path: '/feed-search', element: <ProtectedRoute><FeedSearch /></ProtectedRoute> },
  { path: '/location-selector', element: <ProtectedRoute><LocationSelector /></ProtectedRoute> }
];
