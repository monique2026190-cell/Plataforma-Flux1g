const BASE_URL = '/api';

export const FEED_ENDPOINTS = {
  BASE: `${BASE_URL}/feed`,
  POST: (postId: string) => `${BASE_URL}/feed/${postId}`,
  COMMENTS: `${BASE_URL}/comments`,
  COMMENT: (commentId: string) => `${BASE_URL}/comments/${commentId}`,
};
