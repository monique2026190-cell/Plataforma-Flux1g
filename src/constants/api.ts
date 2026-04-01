const BASE_URL = '/api';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${BASE_URL}/auth/login`,
    REGISTER: `${BASE_URL}/auth/register`,
    REFRESH: `${BASE_URL}/auth/refresh`,
    LOGOUT: `${BASE_URL}/auth/logout`,
    GOOGLE_LOGIN: `${BASE_URL}/auth/google/login`,
    GET_CURRENT_USER: `${BASE_URL}/auth/me`,
    COMPLETE_PROFILE: `${BASE_URL}/auth/complete-profile`,
    VERIFY_SESSION: `${BASE_URL}/auth/verify`,
  },

  USERS: {
    BASE: `${BASE_URL}/usuarios`,
    PROFILE: (userId: string) => `${BASE_URL}/usuarios/${userId}`,
    UPDATE_PROFILE: (userId: string) => `${BASE_URL}/usuarios/${userId}`,
  },

  GROUPS: {
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
  },

  FEED: {
    BASE: `${BASE_URL}/feed`,
    POST: (postId: string) => `${BASE_URL}/feed/${postId}`,
    COMMENTS: `${BASE_URL}/comments`,
    COMMENT: (commentId: string) => `${BASE_URL}/comments/${commentId}`,
  },

  MARKETPLACE: {
    BASE: `${BASE_URL}/marketplace/items`,
    ITEM: (itemId: string) => `${BASE_URL}/marketplace/items/${itemId}`,
    COMMENTS: `${BASE_URL}/marketplace/comments`,
    COMMENT: (commentId: string) => `${BASE_URL}/marketplace/comments/${commentId}`,
  },

  REELS: {
    BASE: `${BASE_URL}/reels`,
    POST: (reelId: string) => `${BASE_URL}/reels/${reelId}`,
    COMMENTS: `${BASE_URL}/reels/comments`,
    COMMENT: (commentId: string) => `${BASE_URL}/reels/comments/${commentId}`,
  },

  CONVERSATIONS: {
    BASE: `${BASE_URL}/conversas`,
    DETAILS: (conversationId: string) => `${BASE_URL}/conversas/${conversationId}`,
    MESSAGES: (conversationId: string) => `${BASE_URL}/conversas/${conversationId}/mensagens`,
  },

  PAYMENT: {
    STRIPE: `${BASE_URL}/stripe`,
    PAYPAL: `${BASE_URL}/paypal`,
    SYNCPAY: `${BASE_URL}/syncpay`,
    STRIPE_CREDENTIALS: `${BASE_URL}/credenciais-stripe`,
  },

  CONFIG: {
    VARS: `${BASE_URL}/v1/config`,
  },

  LOGS: {
    FRONTEND: `${BASE_URL}/log/frontend`,
  },

  SISTEMA: {
    HUB_STATUS: (grupoId: string) => `${BASE_URL}/sistema/hub/status/${grupoId}`,
    SET_HUB_STATUS: (grupoId: string) => `${BASE_URL}/sistema/hub/status/${grupoId}`,
    NOTIFICATIONS: `${BASE_URL}/sistema/notificacoes`,
    MARK_NOTIFICATION_READ: (notificacaoId: string) => `${BASE_URL}/sistema/notificacoes/${notificacaoId}/ler`,
    MARK_ALL_NOTIFICATIONS_READ: `${BASE_URL}/sistema/notificacoes/ler-todas`,
    PUSH_REGISTRATION: `${BASE_URL}/sistema/push/registro`,
  },
} as const;

export type ApiEndpoint = typeof API_ENDPOINTS;
