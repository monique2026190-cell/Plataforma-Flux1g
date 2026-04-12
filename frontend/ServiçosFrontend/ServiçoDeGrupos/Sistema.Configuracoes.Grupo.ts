
// Arquivo: ServiçosFrontend/ServiçoDeGrupos/Sistema.Configuracoes.Grupo.ts

/**
 * @file Sistema de Configurações de Grupo: Agregador de serviços de gestão para grupos.
 * 
 * Este arquivo importa todos os serviços modulares de gestão de grupo (cargos, membros, convites, etc.)
 * e os exporta como um único objeto `sistemaConfiguracoesGrupo`. Isso centraliza o acesso
 * às funcionalidades de configuração e administração de grupos.
 */

import * as roleService from './Servico.Sistema.Cargos';
import * as inviteService from './Servico.Sistema.Convites';
import * as memberService from './Servico.Sistema.Membros';
import * as generalService from './Servico.Sistema.Geral';
import * as auditAdjustService from './Servico.Sistema.Auditoria.Ajuste';
import * as auditReportService from './Servico.Sistema.Auditoria.Denuncias';
import * as auditEntryExitService from './Servico.Sistema.Auditoria.Entrada.Saida';
import * as auditMessageService from './Servico.Sistema.Auditoria.Mensagens';
import * as hubModeService from './Servico.Sistema.Modo.Hub';

/**
 * Objeto de serviço unificado que combina todos os submódulos de configuração de grupo.
 * Mantém uma interface consistente para o resto da aplicação.
 */
export const sistemaConfiguracoesGrupo = {
    // Funções do serviço de cargos
    ...roleService,

    // Funções do serviço de convites
    ...inviteService,

    // Funções do serviço de membros
    ...memberService,

    // Funções do serviço de configurações gerais e estatísticas
    ...generalService,

    // Funções dos serviços de auditoria
    ...auditAdjustService,
    ...auditReportService,
    ...auditEntryExitService,
    ...auditMessageService,

    // Funções do serviço de modo hub
    ...hubModeService,
};
