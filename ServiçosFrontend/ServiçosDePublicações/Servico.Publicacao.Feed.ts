// ServiçosFrontend/ServiçosDePublicações/Servico.Publicacao.Feed.ts

import { config } from "../ValidaçãoDeAmbiente/config.ts";
import { dadosProviderPublicacao } from "../Infra/Dados.Provider.Publicacao";
import { mockFeedPublicationService } from "../ServiçoDeSimulação/simulacoes/Simulacao.Publicacao.Feed.ts";

/**
 * @file Serviço para gerenciar publicações no feed.
 */

const isSimulation = config.VITE_APP_ENV === 'simulation';

export const feedPublicationService = isSimulation
  ? mockFeedPublicationService
  : dadosProviderPublicacao;
