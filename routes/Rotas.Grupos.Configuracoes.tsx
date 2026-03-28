
import React, { lazy } from 'react';

const PG_Configuracoes_Grupo = lazy(() => import('../pages/PG.Configuracoes.Grupo').then(m => ({ default: m.PG_Configuracoes_Grupo })));
const PGGrupoConfiguracoesInformacoes = lazy(() => import('../pages/groups/settings/PG.Grupo.Configuracoes.Informacoes').then(m => ({ default: m.PGGrupoConfiguracoesInformacoes })));
const PGGrupoConfiguracoesAcessoEConvites = lazy(() => import('../pages/groups/settings/PG.Grupo.Configuracoes.AcessoEConvites').then(m => ({ default: m.PGGrupoConfiguracoesAcessoEConvites })));
const PGGrupoConfiguracoesModeracao = lazy(() => import('../pages/groups/settings/PG.Grupo.Configuracoes.Moderacao').then(m => ({ default: m.PGGrupoConfiguracoesModeracao })));
const PGGrupoConfiguracoesAcoesAdministrativas = lazy(() => import('../pages/groups/settings/PG.Grupo.Configuracoes.AcoesAdministrativas').then(m => ({ default: m.PGGrupoConfiguracoesAcoesAdministrativas })));
const PGGrupoConfiguracoesAuditoriaDeMensagens = lazy(() => import('../pages/groups/settings/PG.Grupo.Configuracoes.AuditoriaDeMensagens').then(m => ({ default: m.PGGrupoConfiguracoesAuditoriaDeMensagens })));
const PGGrupoConfiguracoesAuditoriaDeDenuncias = lazy(() => import('../pages/groups/settings/PG.Grupo.Configuracoes.AuditoriaDeDenuncias').then(m => ({ default: m.PGGrupoConfiguracoesAuditoriaDeDenuncias })));
const PGGrupoConfiguracoesAuditoriaDeEntradaESaida = lazy(() => import('../pages/groups/settings/PG.Grupo.Configuracoes.AuditoriaDeEntradaESaida').then(m => ({ default: m.PGGrupoConfiguracoesAuditoriaDeEntradaESaida })));
const PGGrupoConfiguracoesAuditoriaDeAjustes = lazy(() => import('../pages/groups/settings/PG.Grupo.Configuracoes.AuditoriaDeAjustes').then(m => ({ default: m.PGGrupoConfiguracoesAuditoriaDeAjustes })));
const PGGrupoConfiguracoesEstatisticas = lazy(() => import('../pages/groups/settings/PG.Grupo.Configuracoes.Estatisticas').then(m => ({ default: m.PGGrupoConfiguracoesEstatisticas })));
const PGGrupoConfiguracoesMensagensAgendadas = lazy(() => import('../pages/groups/settings/PG.Grupo.Configuracoes.MensagensAgendadas').then(m => ({ default: m.PGGrupoConfiguracoesMensagensAgendadas })));
const PGGrupoConfiguracoesPlataformaVendas = lazy(() => import('../pages/groups/settings/PG.Grupo.Configuracoes.PlataformaVendas').then(m => ({ default: m.PGGrupoConfiguracoesPlataformaVendas })));
const PGGrupoConfiguracoesPlataformasADS = lazy(() => import('../pages/groups/settings/PG.Grupo.Configuracoes.PlataformasADS').then(m => ({ default: m.PGGrupoConfiguracoesPlataformasADS })));
const PGGrupoConfiguracoesCargos = lazy(() => import('../pages/groups/settings/PG.Grupo.Configuracoes.Cargos').then(m => ({ default: m.PGGrupoConfiguracoesCargos })));
const PGGrupoConfiguracoesDiretrizes = lazy(() => import('../pages/groups/settings/PG.Grupo.Configuracoes.Diretrizes').then(m => ({ default: m.PGGrupoConfiguracoesDiretrizes })));
const PGGrupoConfiguracoesDistribuiçaoDeCargos = lazy(() => import('../pages/groups/settings/PG.Grupo.Configuracoes.DistribuiçaoDeCargos').then(m => ({ default: m.PGGrupoConfiguracoesDistribuiçaoDeCargos })));
const PGGrupoConfiguracoesNotificacoesGerais = lazy(() => import('../pages/groups/settings/PG.Grupo.Configuracoes.NotificacoesGerais').then(m => ({ default: m.PGGrupoConfiguracoesNotificacoesGerais })));
const PGEditarPaginasVendas = lazy(() => import('../pages/groups/settings/PG.Editar.Paginas.Vendas').then(m => ({ default: m.PGEditarPaginasVendas })));


export const groupSettingsRoutes = [
    { path: '/group-settings/:id', element: <PG_Configuracoes_Grupo /> },
    { path: '/group-settings/:id/info', element: <PGGrupoConfiguracoesInformacoes /> },
    { path: '/group-settings/:id/access', element: <PGGrupoConfiguracoesAcessoEConvites /> },
    { path: '/group-settings/:id/moderation', element: <PGGrupoConfiguracoesModeracao /> },
    { path: '/group-settings/:id/admin-actions', element: <PGGrupoConfiguracoesAcoesAdministrativas /> },
    { path: '/group-settings/:id/message-audit', element: <PGGrupoConfiguracoesAuditoriaDeMensagens /> },
    { path: '/group-settings/:id/report-audit', element: <PGGrupoConfiguracoesAuditoriaDeDenuncias /> },
    { path: '/group-settings/:id/entry-exit-audit', element: <PGGrupoConfiguracoesAuditoriaDeEntradaESaida /> },
    { path: '/group-settings/:id/settings-audit', element: <PGGrupoConfiguracoesAuditoriaDeAjustes /> },
    { path: '/group-settings/:id/roles', element: <PGGrupoConfiguracoesCargos /> },
    { path: '/group-settings/:id/guidelines', element: <PGGrupoConfiguracoesDiretrizes /> },
    { path: '/group-settings/:id/role-distribution', element: <PGGrupoConfiguracoesDistribuiçaoDeCargos /> },
    { path: '/group-settings/:id/stats', element: <PGGrupoConfiguracoesEstatisticas /> },
    { path: '/group-settings/:id/schedule', element: <PGGrupoConfiguracoesMensagensAgendadas /> },
    { path: '/group-settings/:id/sales-platform', element: <PGGrupoConfiguracoesPlataformaVendas /> },
    { path: '/group-settings/:id/ads-platforms', element: <PGGrupoConfiguracoesPlataformasADS /> },
    { path: '/group-settings/:id/edit-sales-page', element: <PGEditarPaginasVendas /> },
    { path: '/group-settings/:id/general-notifications', element: <PGGrupoConfiguracoesNotificacoesGerais /> },
];
