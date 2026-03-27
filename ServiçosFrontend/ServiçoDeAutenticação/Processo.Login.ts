
import { IUsuario } from './Processo.Login';
import { AuthStorage } from './Auth.Storage'; // Importa o novo módulo de storage

// As interfaces IUsuario e IEstadoAutenticacao permanecem as mesmas.
export interface IUsuario {
  id: string;
  nome: string;
  email: string;
}

export interface IEstadoAutenticacao {
  autenticado: boolean;
  usuario: IUsuario | null;
  token: string | null;
}

/**
 * Processo.Login.ts (Integrado com Auth.Storage)
 * 
 * Responsabilidade: Manter o estado de autenticação, sincronizando-o
 * com o localStorage para persistência da sessão.
 */
class ProcessoLoginGerenciadorEstado {
  private estado: IEstadoAutenticacao;

  constructor() {
    // Tenta carregar a sessão do storage ao iniciar.
    const sessaoSalva = AuthStorage.carregarSessao();

    if (sessaoSalva) {
      this.estado = {
        autenticado: true,
        usuario: sessaoSalva.usuario,
        token: sessaoSalva.token,
      };
      console.log("Gerenciador de Estado: Estado inicializado com sessão salva.");
    } else {
      this.estado = {
        autenticado: false,
        usuario: null,
        token: null,
      };
      console.log("Gerenciador de Estado: Nenhuma sessão salva encontrada. Iniciando deslogado.");
    }
  }

  public obterEstadoAtual(): IEstadoAutenticacao {
    return this.estado;
  }

  /**
   * Atualiza o estado para um estado autenticado e persiste no localStorage.
   */
  public definirEstadoAutenticado(usuario: IUsuario, token: string): void {
    console.log(`Gerenciador de Estado: Definindo estado para o usuário ${usuario.email}.`);
    this.estado = {
      autenticado: true,
      usuario: usuario,
      token: token,
    };
    // Persiste o novo estado no storage.
    AuthStorage.salvarSessao(token, usuario);
  }

  /**
   * Limpa o estado de autenticação e remove a sessão do localStorage.
   */
  public limparEstado(): void {
    console.log("Gerenciador de Estado: Limpando estado de autenticação.");
    this.estado = {
      autenticado: false,
      usuario: null,
      token: null,
    };
    // Limpa também o estado do storage.
    AuthStorage.limparSessao();
  }

  // Métodos não utilizados permanecem.
  public async inicializar(): Promise<void> {}
  public iniciarLoginComGoogle(): void {}
  public async finalizarLoginComGoogle(codigo: string): Promise<void> {}
}

export const processoLogin = new ProcessoLoginGerenciadorEstado();
