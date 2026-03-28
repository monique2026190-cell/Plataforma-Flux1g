export interface RegistroForm {
  nome: string;
  idade: number;
  email: string;
  nickname: string;
}

export interface RegistroRequest {
  name: string;
  birthDate: string;
  username: string;
  email: string;
}

export const RegistroViewModel = {
  toRequest(form: RegistroForm): RegistroRequest {
    const anoAtual = new Date().getFullYear();
    const birthYear = anoAtual - form.idade;

    return {
      name: form.nome,
      birthDate: `${birthYear}-01-01`,
      username: form.nickname,
      email: form.email
    };
  }
};