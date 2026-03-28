
// As interfaces foram movidas para um local neutro ou são inferidas (usando 'any' no provider)
// para evitar dependências circulares.
export interface IPerfilParaCompletar {
  id: string;
  nome: string;
  nickname: string;
  email: string;
  dataNascimento: any;
  telefone?: string;
  bio?: string;
  avatarUrl?: string;
  googleId?: string;
}

export interface IResultadoCompletarPerfil {
  sucesso: boolean;
  mensagem: string;
  usuarioAtualizado?: any;
}

import { DadosProvider } from '../Infra/DadosProvider';

class ProcessoCompletarPerfil {
  
  async executar(perfilData: IPerfilParaCompletar): Promise<IResultadoCompletarPerfil> {
    // A única responsabilidade do processo agora é delegar a chamada
    // para a camada de dados, que orquestra validação e infraestrutura.
    return DadosProvider.completarPerfil(perfilData);
  }
}

export const processoCompletarPerfil = new ProcessoCompletarPerfil();
