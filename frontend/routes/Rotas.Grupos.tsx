
import React, { lazy } from 'react';

const PG_Lista_Grupo = lazy(() => import('../pages/PG.Lista.Grupo').then(m => ({ default: m.PG_Lista_Grupo })));
const GroupChat = lazy(() => import('../pages/GroupChat').then(m => ({ default: m.GroupChat })));
const CreateGroup = lazy(() => import('../pages/CreateGroup').then(m => ({ default: m.CreateGroup })));
const CreateVipGroup = lazy(() => import('../pages/CreateVipGroup').then(m => ({ default: m.CreateVipGroup })));
const CreatePublicGroup = lazy(() => import('../pages/CreatePublicGroup').then(m => ({ default: m.CreatePublicGroup })));
const CreatePrivateGroup = lazy(() => import('../pages/CreatePrivateGroup').then(m => ({ default: m.CreatePrivateGroup })));
const VipGroupSales = lazy(() => import('../pages/VipGroupSales').then(m => ({ default: m.VipGroupSales })));
const PG_Grupo_Plataforma_Hub = lazy(() => import('../pages/groups/PG.Grupo.Plataforma.Hub').then(m => ({ default: m.PG_Grupo_Plataforma_Hub })));
const ManageGroupLinks = lazy(() => import('../pages/ManageGroupLinks').then(m => ({ default: m.ManageGroupLinks })));
const PGGrupoReceita = lazy(() => import('../pages/groups/PG.Grupo.Receita').then(m => ({ default: m.PGGrupoReceita })));
const VipSalesHistory = lazy(() => import('../pages/VipSalesHistory').then(m => ({ default: m.VipSalesHistory })));
const PG_Chat_Grupo = lazy(() => import('../pages/PG.Chat.Grupo').then(m => ({ default: m.PG_Chat_Grupo })));

// Importando a nova página de entrada do grupo
const PG_Grupo_Entrada = lazy(() => import('../pages/PG.Grupo.Entrada').then(m => ({ default: m.PG_Grupo_Entrada })));

export const groupRoutes = [
    { path: '/groups', element: <PG_Lista_Grupo /> },
    // Adicionando a nova rota para a página de entrada
    { path: '/group/:id', element: <PG_Grupo_Entrada /> }, 
    { path: '/group-chat/:id', element: <GroupChat /> },
    { path: '/pg-chat-grupo', element: <PG_Chat_Grupo /> },
    { path: '/vip-group-sales/:id', element: <VipGroupSales /> },
    { path: '/create-group', element: <CreateGroup /> },
    { path: '/create-group/vip', element: <CreateVipGroup /> },
    { path: '/create-group/public', element: <CreatePublicGroup /> },
    { path: '/create-group/private', element: <CreatePrivateGroup /> },
    { path: '/group/:id/files', element: <PG_Grupo_Plataforma_Hub /> },
    { path: '/group-links/:id', element: <ManageGroupLinks /> },
    { path: '/group/:id/revenue', element: <PGGrupoReceita /> },
    { path: '/vip-sales-history/:id', element: <VipSalesHistory /> }
  ];
