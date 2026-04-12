const BASE_URL = '/api';

export const NOTIFICATIONS_ENDPOINTS = {
  BASE: `${BASE_URL}/notificacoes`,
  READ: (notificationId: string) => `${BASE_URL}/notificacoes/${notificationId}/read`,
  UNREAD: (notificationId: string) => `${BASE_URL}/notificacoes/${notificationId}/unread`,
};
