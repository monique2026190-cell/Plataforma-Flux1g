
import { AuthStorage } from './Auth.Storage'; 
import { createServiceLogger } from '../SistemaObservabilidade/Log.Servicos.Frontend';

export interface IUsuario {
  id: string;
  nome: string;
  nickname: string;
  email: string;
  avatarUrl?: string;
  website?: string;
  bio?: string;
  perfilCompleto: boolean;
  googleId?: string;
}

export interface IEstadoAutenticacao {
  autenticado: boolean;
  usuario: IUsuario | null;
  token: string | null;
}

// Assinatura do listener
type Ouvinte = (estado: IEstadoAutenticacao) => void;

const logger = createServiceLogger('ProcessoLoginGerenciadorEstado');

class ProcessoLoginGerenciadorEstado {
  private estado: IEstadoAutenticacao;
  private ouvintes: Ouvinte[] = [];

  constructor() {
    const sessaoSalva = AuthStorage.carregarSessao();
    if (sessaoSalva) {
      this.estado = {
        autenticado: true,
        usuario: sessaoSalva.usuario,
        token: sessaoSalva.token,
      };
      logger.logInfo("Estado inicializado com sessão salva.", this.estado);
      this.notificarOuvintes();
    } else {
      this.estado = {
        autenticado: false,
        usuario: null,
        token: null,
      };
      logger.logInfo("Nenhuma sessão salva encontrada. Iniciando deslogado.");
    }
  }

  // Notifica todos os ouvintes sobre a mudança de estado
  private notificarOuvintes(): void {
    logger.logInfo("Notificando ouvintes sobre mudança de estado.");
    this.ouvintes.forEach(ouvinte => ouvinte(this.estado));
  }

  // Permite que componentes se inscrevam para atualizações
  public adicionarOuvinte(ouvinte: Ouvinte): void {
    logger.logInfo("Adicionando um novo ouvinte.");
    this.ouvintes.push(ouvinte);
  }

  // Permite que componentes parem de receber atualizações
  public removerOuvinte(ouvinte: Ouvinte): void {
    logger.logInfo("Removendo um ouvinte.");
    this.ouvintes = this.ouvintes.filter(o => o !== ouvinte);
  }

  public obterEstadoAtual(): IEstadoAutenticacao {
    return this.estado;
  }

  public definirEstadoAutenticado(usuario: IUsuario, token: string): void {
    logger.logInfo(`Definindo estado para o usuário ${usuario.email}.`);
    this.estado = {
      autenticado: true,
      usuario: usuario,
      token: token,
    };
    AuthStorage.salvarSessao(token, usuario);
    this.notificarOuvintes(); // Notifica após a mudança
  }

  public limparEstado(): void {
    logger.logInfo("Limpando estado de autenticação.");
    this.estado = {
      autenticado: false,
      usuario: null,
      token: null,
    };
    AuthStorage.limparSessao();
    this.notificarOuvintes(); // Notifica após a mudança
  }

  public async inicializar(): Promise<void> {}
  public iniciarLoginComGoogle(): void {}
  public async finalizarLoginComGoogle(codigo: string): Promise<void> {}
}

export const processoLogin = new ProcessoLoginGerenciadorEstado();
