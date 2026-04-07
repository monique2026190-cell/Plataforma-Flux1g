const BASE_URL = '/api';

export const USERS_ENDPOINTS = {
  BASE: `${BASE_URL}/usuarios`,
  PROFILE: (userId: string) => `${BASE_URL}/usuarios/${userId}`,
  UPDATE_PROFILE: (userId: string) => `${BASE_URL}/usuarios/${userId}`,
  PROFILE_STATUS: `${BASE_URL}/usuarios/status-perfil`
};
