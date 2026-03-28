
import { infraProviderAutenticacao } from './Infra.Provider.Autenticacao';

// A interface ILoginSocialData é interna e não causa dependência externa.
interface ILoginSocialData {
  nome: string;
  email: string;
  googleId: string;
  avatarUrl?: string;
  tokenProvider: string;
}

class C_DadosProvider {
  // --- DEFINIÇÕES DA ESTRUTURA DE DADOS ---
  camposPerfilObrigatorio = () => [
    { campo: 'id', tipo: 'string', obrigatorio: true },
    { campo: 'nome', tipo: 'string', obrigatorio: true },
    { campo: 'nickname', tipo: 'string', obrigatorio: true },
    { campo: 'email', tipo: 'string', obrigatorio: true },
    { campo: 'dataNascimento', tipo: 'date', obrigatorio: true },
  ];

  camposLoginSocial = () => [
    { campo: 'nome', tipo: 'string', obrigatorio: true },
    { campo: 'email', tipo: 'string', obrigatorio: true },
    { campo: 'googleId', tipo: 'string', obrigatorio: true },
    { campo: 'avatarUrl', tipo: 'string', obrigatorio: false },
  ];

  // --- MÉTODOS ORQUESTRADORES ---

  // Usando 'any' para remover a dependência do arquivo de serviço, como solicitado.
  async completarPerfil(perfilData: any): Promise<any> {
    // 1. Validar
    for (const campo of this.camposPerfilObrigatorio()) {
      if (campo.campo === 'id') continue;
      if (!(campo.campo in perfilData) || !perfilData[campo.campo as keyof any]) {
        return { sucesso: false, mensagem: `O campo '${campo.campo}' é obrigatório.` };
      }
    }

    // 2. Chamar a Infraestrutura
    try {
      const response = await infraProviderAutenticacao.completarPerfil(perfilData);
      if (response.status === 200) {
        return { sucesso: true, mensagem: "Perfil completado com sucesso!", usuarioAtualizado: response.data };
      } else {
        return { sucesso: false, mensagem: response.data.message || "Ocorreu um erro desconhecido." };
      }
    } catch (error: any) {
      return { sucesso: false, mensagem: error.response?.data?.message || "Falha na comunicação com o servidor." };
    }
  }

  async lidarComLoginSocial(dadosLogin: ILoginSocialData): Promise<any> {
    // 1. Validar
    for (const campo of this.camposLoginSocial()) {
      if (campo.obrigatorio && (!dadosLogin.hasOwnProperty(campo.campo) || !dadosLogin[campo.campo as keyof ILoginSocialData])) {
        throw new Error(`Dado obrigatório '${campo.campo}' não recebido do provedor social.`);
      }
    }

    // 2. Chamar a Infraestrutura
    try {
      const resultado = await infraProviderAutenticacao.lidarComLoginSocial(dadosLogin);
      return { sucesso: true, dados: resultado };
    } catch (error: any) {
      throw error; // Re-lança para o chamador original tratar o erro da UI
    }
  }
}

export const DadosProvider = new C_DadosProvider();
