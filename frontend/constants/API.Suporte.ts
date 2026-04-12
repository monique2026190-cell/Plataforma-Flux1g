const BASE_URL = '/api';

export const SUPPORT_ENDPOINTS = {
  TICKETS: `${BASE_URL}/suporte/tickets`,
  TICKET: (ticketId: string) => `${BASE_URL}/suporte/tickets/${ticketId}`,
  COMMENTS: `${BASE_URL}/suporte/comments`,
};
