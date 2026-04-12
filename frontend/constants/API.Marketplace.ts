const BASE_URL = '/api';

export const MARKETPLACE_ENDPOINTS = {
  BASE: `${BASE_URL}/marketplace/items`,
  ITEM: (itemId: string) => `${BASE_URL}/marketplace/items/${itemId}`,
  COMMENTS: `${BASE_URL}/marketplace/comments`,
  COMMENT: (commentId: string) => `${BASE_URL}/marketplace/comments/${commentId}`,
};
