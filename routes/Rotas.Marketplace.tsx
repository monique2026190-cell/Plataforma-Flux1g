
import React, { lazy } from 'react';

const Marketplace = lazy(() => import('../pages/Marketplace').then(m => ({ default: m.Marketplace })));
// Corrected the import to the new page
const PGDetalhesProdutos = lazy(() => import('../pages/PG.Detalhes.Produtos').then(m => ({ default: m.PGDetalhesProdutos })));
const CreateMarketplaceItem = lazy(() => import('../pages/CreateMarketplaceItem').then(m => ({ default: m.CreateMarketplaceItem })));
const MyStore = lazy(() => import('../pages/MyStore').then(m => ({ default: m.MyStore })));
const AdPlacementSelector = lazy(() => import('../pages/AdPlacementSelector').then(m => ({ default: m.AdPlacementSelector })));
const CampaignPerformance = lazy(() => import('../pages/CampaignPerformance').then(m => ({ default: m.CampaignPerformance })));
const AdCampaignTypeSelector = lazy(() => import('../pages/AdCampaignTypeSelector').then(m => ({ default: m.AdCampaignTypeSelector })));
const AdContentSelector = lazy(() => import('../pages/AdContentSelector').then(m => ({ default: m.AdContentSelector })));

export const marketplaceRoutes = [
  { path: '/marketplace', element: <Marketplace /> },
  // Updated the component for the product details route
  { path: '/marketplace/product/:id', element: <PGDetalhesProdutos /> },
  { path: '/create-marketplace-item', element: <CreateMarketplaceItem /> },
  { path: '/my-store', element: <MyStore /> },
  { path: '/ad-placement-selector', element: <AdPlacementSelector /> },
  { path: '/campaign-performance/:id', element: <CampaignPerformance /> },
  { path: '/ad-type-selector', element: <AdCampaignTypeSelector /> },
  { path: '/ad-content-selector', element: <AdContentSelector /> }
];
