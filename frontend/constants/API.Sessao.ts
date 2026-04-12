const BASE_URL = '/api';

export const AUTH_ENDPOINTS = {
  LOGIN: `${BASE_URL}/auth/login`,
  REGISTER: `${BASE_URL}/auth/register`,
  REFRESH: `${BASE_URL}/auth/refresh`,
  LOGOUT: `${BASE_URL}/auth/logout`,
  GOOGLE_LOGIN: `${BASE_URL}/auth/google/login`,
  GET_CURRENT_USER: `${BASE_URL}/auth/me`,
  COMPLETE_PROFILE: `${BASE_URL}/usuarios/complete-profile`,
  VERIFY_SESSION: `${BASE_URL}/auth/verify`,
};
