import { possibilidadeClienteHttp } from '../Comunicacao/Comunicacao.Backend.Requisicoes';
import API_ENDPOINTS from '../../constants/api';

class InfraProviderGrupo {
    // --- Membros ---
    public async buscarMembros(grupoId: string): Promise<any[]> {
        return possibilidadeClienteHttp.get(API_ENDPOINTS.GROUPS.MEMBERS(grupoId));
    }

    public async adicionarMembro(grupoId: string, dadosMembro: any): Promise<any> {
        return possibilidadeClienteHttp.post(API_ENDPOINTS.GROUPS.ADD_MEMBER(grupoId), dadosMembro);
    }

    public async removerMembro(grupoId: string, membroId: string): Promise<void> {
        return possibilidadeClienteHttp.delete(API_ENDPOINTS.GROUPS.REMOVE_MEMBER(grupoId, membroId));
    }

    // --- Moderacao ---
    public async buscarSolicitacoesEntrada(grupoId: string): Promise<any[]> {
        return possibilidadeClienteHttp.get(API_ENDPOINTS.GROUPS.REQUESTS(grupoId));
    }

    public async aprovarSolicitacao(grupoId: string, solicitacaoId: string): Promise<any> {
        return possibilidadeClienteHttp.post(API_ENDPOINTS.GROUPS.APPROVE_REQUEST(grupoId, solicitacaoId));
    }

    public async rejeitarSolicitacao(grupoId: string, solicitacaoId: string): Promise<any> {
        return possibilidadeClienteHttp.post(API_ENDPOINTS.GROUPS.REJECT_REQUEST(grupoId, solicitacaoId));
    }

    // --- Mensagens Agendadas ---
    public async buscarMensagensAgendadas(grupoId: string): Promise<any[]> {
        return possibilidadeClienteHttp.get(API_ENDPOINTS.GROUPS.SCHEDULED_MESSAGES(grupoId));
    }

    public async agendarMensagem(grupoId: string, dadosMensagem: any): Promise<any> {
        return possibilidadeClienteHttp.post(API_ENDPOINTS.GROUPS.SCHEDULE_MESSAGE(grupoId), dadosMensagem);
    }

    // --- Receita e Vendas ---
    public async buscarRelatorioReceita(grupoId: string): Promise<any> {
        return possibilidadeClienteHttp.get(API_ENDPOINTS.GROUPS.REVENUE(grupoId));
    }

    public async configurarPaginaVendas(grupoId: string, configuracao: any): Promise<any> {
        return possibilidadeClienteHttp.post(API_ENDPOINTS.GROUPS.CONFIGURE_SALES_PAGE(grupoId), configuracao);
    }

    public async obterPaginaVendas(grupoId: string): Promise<any> {
        return possibilidadeClienteHttp.get(API_ENDPOINTS.GROUPS.SALES_PAGE(grupoId));
    }

    // --- Configurações de Moderação ---
    public async obterConfiguracoesModeracao(grupoId: string): Promise<any> {
        return possibilidadeClienteHttp.get(API_ENDPOINTS.GROUPS.MODERATION_SETTINGS(grupoId));
    }

    public async atualizarConfiguracoesModeracao(grupoId: string, configuracoes: any): Promise<any> {
        return possibilidadeClienteHttp.put(API_ENDPOINTS.GROUPS.UPDATE_MODERATION_SETTINGS(grupoId), configuracoes);
    }

    // --- Configurações de Notificacao (Grupo) ---
    public async obterConfiguracoesNotificacao(grupoId: string): Promise<any> {
        return possibilidadeClienteHttp.get(API_ENDPOINTS.GROUPS.NOTIFICATION_SETTINGS(grupoId));
    }

    public async atualizarConfiguracoesNotificacao(grupoId: string, settings: any): Promise<any> {
        return possibilidadeClienteHttp.put(API_ENDPOINTS.GROUPS.UPDATE_NOTIFICATION_SETTINGS(grupoId), settings);
    }

    // --- Auditoria ---
    public async obterAuditoria(grupoId: string, tipo: string): Promise<any[]> {
        return possibilidadeClienteHttp.get(API_ENDPOINTS.GROUPS.AUDIT(grupoId, tipo));
    }

    // --- Cargos ---
    public async listarCargos(grupoId: string): Promise<any[]> {
        return possibilidadeClienteHttp.get(API_ENDPOINTS.GROUPS.ROLES(grupoId));
    }

    public async atribuirCargo(grupoId: string, membroId: string, cargoId: string): Promise<any> {
        return possibilidadeClienteHttp.post(API_ENDPOINTS.GROUPS.ASSIGN_ROLE(grupoId), { membroId, cargoId });
    }

    // --- Convites ---
    public async gerarConvite(grupoId: string, configuracao: any): Promise<any> {
        return possibilidadeClienteHttp.post(API_ENDPOINTS.GROUPS.GENERATE_INVITE(grupoId), configuracao);
    }

    // --- Criação e Gestão Geral ---
    public async criarGrupo(dados: any): Promise<any> {
        return possibilidadeClienteHttp.post(API_ENDPOINTS.GROUPS.BASE, dados);
    }

    public async buscarListaGrupos(): Promise<any[]> {
        return possibilidadeClienteHttp.get(API_ENDPOINTS.GROUPS.LIST);
    }

    public async obterDetalhes(grupoId: string): Promise<any> {
        return possibilidadeClienteHttp.get(API_ENDPOINTS.GROUPS.DETAILS(grupoId));
    }

    public async atualizarConfiguracoes(grupoId: string, settings: any): Promise<any> {
        return possibilidadeClienteHttp.put(API_ENDPOINTS.GROUPS.SETTINGS(grupoId), settings);
    }

    public async obterEstatisticas(grupoId: string): Promise<any> {
        return possibilidadeClienteHttp.get(API_ENDPOINTS.GROUPS.STATS(grupoId));
    }

    // --- Diretrizes ---
    public async obterDiretrizes(grupoId: string): Promise<any> {
        return possibilidadeClienteHttp.get(API_ENDPOINTS.GROUPS.GUIDELINES(grupoId));
    }

    public async atualizarDiretrizes(grupoId: string, guidelines: any): Promise<any> {
        return possibilidadeClienteHttp.put(API_ENDPOINTS.GROUPS.UPDATE_GUIDELINES(grupoId), guidelines);
    }
}

export const infraProviderGrupo = new InfraProviderGrupo();
