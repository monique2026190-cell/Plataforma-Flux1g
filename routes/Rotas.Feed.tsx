
import React, { lazy } from 'react';

const Feed = lazy(() => import('../pages/Feed').then(module => ({ default: module.Feed })));
const PGDetalhesPostFeed = lazy(() => import('../pages/PG.Detalhes.Post.Feed.tsx').then(module => ({ default: module.PG_Detalhes_Post_Feed })));
const CreatePost = lazy(() => import('../pages/CreatePost').then(module => ({ default: module.CreatePost })));
const CreatePoll = lazy(() => import('../pages/CreatePoll').then(module => ({ default: module.CreatePoll })));
const FeedSearch = lazy(() => import('../pages/FeedSearch').then(module => ({ default: module.FeedSearch })));
const LocationSelector = lazy(() => import('../pages/LocationSelector'));

export const feedRoutes = [
  { path: '/feed', element: <Feed /> },
  { path: '/post/:id', element: <PGDetalhesPostFeed /> },
  { path: '/create-post', element: <CreatePost /> },
  { path: '/create-poll', element: <CreatePoll /> },
  { path: '/feed-search', element: <FeedSearch /> },
  { path: '/location-selector', element: <LocationSelector /> }
];
