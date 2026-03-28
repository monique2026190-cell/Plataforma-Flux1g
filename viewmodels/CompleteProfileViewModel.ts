/**
 * @file Define o ViewModel para o fluxo de completar o perfil, 
 * responsável por traduzir os dados da UI para o formato esperado pela camada de aplicação.
 */

// Interface que representa os dados do formulário da página CompleteProfile.
export interface CompleteProfileForm {
  nickname: string;
  name: string;
  bio: string;
}

// Interface que representa a requisição que a camada de aplicação espera.
export interface CompleteProfileRequest {
  nickname: string;
  name: string;
  bio: string;
}

// Objeto ViewModel com a lógica de transformação.
export const CompleteProfileViewModel = {
  /**
   * Converte os dados do formulário da UI para o formato de requisição do sistema.
   * @param {CompleteProfileForm} form - Os dados inseridos pelo usuário na página.
   * @returns {CompleteProfileRequest} Os dados prontos para serem enviados à camada de aplicação.
   */
  toRequest(form: CompleteProfileForm): CompleteProfileRequest {
    // Neste caso, a transformação é direta (1:1), mas a estrutura permite
    // futuras modificações sem impactar a UI.
    return {
      nickname: form.nickname,
      name: form.name,
      bio: form.bio,
    };
  },
};
