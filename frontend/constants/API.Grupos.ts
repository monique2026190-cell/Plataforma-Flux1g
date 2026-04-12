const BASE_URL = '/api';

export const GROUPS_ENDPOINTS = {
  BASE: `${BASE_URL}/groups`,
  PUBLIC: `${BASE_URL}/groups/public`,
  PRIVATE: `${BASE_URL}/groups/private`,
  PAID: `${BASE_URL}/groups/paid`,
  
  DETAILS: (groupId: string) => `${BASE_URL}/groups/${groupId}`,
  LIST: `${BASE_URL}/groups`,
  SETTINGS: (groupId: string) => `${BASE_URL}/groups/${groupId}/settings`,
  STATS: (groupId: string) => `${BASE_URL}/groups/${groupId}/stats`,
  
  MEMBERS: (groupId: string) => `${BASE_URL}/groups/${groupId}/membros`,
  ADD_MEMBER: (groupId: string) => `${BASE_URL}/groups/${groupId}/membros`,
  REMOVE_MEMBER: (groupId: string, memberId: string) => `${BASE_URL}/groups/${groupId}/membros/${memberId}`,
  
  REQUESTS: (groupId: string) => `${BASE_URL}/groups/${groupId}/solicitacoes`,
  APPROVE_REQUEST: (groupId: string, requestId: string) => `${BASE_URL}/groups/${groupId}/solicitacoes/${requestId}/aprovar`,
  REJECT_REQUEST: (groupId: string, requestId: string) => `${BASE_URL}/groups/${groupId}/solicitacoes/${requestId}/rejeitar`,
  
  SCHEDULED_MESSAGES: (groupId: string) => `${BASE_URL}/groups/${groupId}/mensagens-agendadas`,
  SCHEDULE_MESSAGE: (groupId: string) => `${BASE_URL}/groups/${groupId}/mensagens-agendadas`,
  
  REVENUE: (groupId: string) => `${BASE_URL}/groups/${groupId}/receita`,
  SALES_PAGE: (groupId: string) => `${BASE_URL}/groups/${groupId}/pagina-vendas`,
  CONFIGURE_SALES_PAGE: (groupId: string) => `${BASE_URL}/groups/${groupId}/pagina-vendas`,
  
  MODERATION_SETTINGS: (groupId: string) => `${BASE_URL}/groups/${groupId}/moderacao/configuracoes`,
  UPDATE_MODERATION_SETTINGS: (groupId: string) => `${BASE_URL}/groups/${groupId}/moderacao/configuracoes`,
  
  NOTIFICATION_SETTINGS: (groupId: string) => `${BASE_URL}/groups/${groupId}/notification-settings`,
  UPDATE_NOTIFICATION_SETTINGS: (groupId: string) => `${BASE_URL}/groups/${groupId}/notification-settings`,
  
  AUDIT: (groupId: string, type: string) => `${BASE_URL}/groups/${groupId}/auditoria/${type}`,
  
  ROLES: (groupId: string) => `${BASE_URL}/groups/${groupId}/cargos`,
  ASSIGN_ROLE: (groupId: string) => `${BASE_URL}/groups/${groupId}/cargos/atribuir`,
  
  INVITES: (groupId: string) => `${BASE_URL}/groups/${groupId}/convites`,
  GENERATE_INVITE: (groupId: string) => `${BASE_URL}/groups/${groupId}/convites`,
  
  GUIDELINES: (groupId: string) => `${BASE_URL}/groups/${groupId}/guidelines`,
  UPDATE_GUIDELINES: (groupId: string) => `${BASE_URL}/groups/${groupId}/guidelines`,
};
