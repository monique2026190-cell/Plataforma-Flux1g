// ServiçosFrontend/ServiçosDePublicações/Servico.Publicacao.Marketplace.ts

import { config } from "../ValidaçãoDeAmbiente/config.ts";
import { dadosProviderPublicacao } from "../Infra/Dados.Provider.Publicacao";
import { mockMarketplacePublicationService } from "../ServiçoDeSimulação/simulacoes/Simulacao.Publicacao.Marketplace.ts";

/**
 * @file Serviço para gerenciar publicações no marketplace.
 */

const isSimulation = config.VITE_APP_ENV === 'simulation';

export const marketplacePublicationService = isSimulation
  ? mockMarketplacePublicationService
  : dadosProviderPublicacao;
