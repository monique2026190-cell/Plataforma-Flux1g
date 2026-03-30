import { httpClient } from './Infra.HttpClient';

class InfraProviderGrupo {
    // --- Membros ---
    public async buscarMembros(grupoId: string): Promise<any[]> {
        return httpClient.get(`/api/grupos/${grupoId}/membros`);
    }

    public async adicionarMembro(grupoId: string, dadosMembro: any): Promise<any> {
        return httpClient.post(`/api/grupos/${grupoId}/membros`, dadosMembro);
    }

    public async removerMembro(grupoId: string, membroId: string): Promise<void> {
        return httpClient.delete(`/api/grupos/${grupoId}/membros/${membroId}`);
    }

    // --- Moderacao ---
    public async buscarSolicitacoesEntrada(grupoId: string): Promise<any[]> {
        return httpClient.get(`/api/grupos/${grupoId}/solicitacoes`);
    }

    public async aprovarSolicitacao(grupoId: string, solicitacaoId: string): Promise<any> {
        return httpClient.post(`/api/grupos/${grupoId}/solicitacoes/${solicitacaoId}/aprovar`);
    }

    public async rejeitarSolicitacao(grupoId: string, solicitacaoId: string): Promise<any> {
        return httpClient.post(`/api/grupos/${grupoId}/solicitacoes/${solicitacaoId}/rejeitar`);
    }

    // --- Mensagens Agendadas ---
    public async buscarMensagensAgendadas(grupoId: string): Promise<any[]> {
        return httpClient.get(`/api/grupos/${grupoId}/mensagens-agendadas`);
    }

    public async agendarMensagem(grupoId: string, dadosMensagem: any): Promise<any> {
        return httpClient.post(`/api/grupos/${grupoId}/mensagens-agendadas`, dadosMensagem);
    }

    // --- Receita e Vendas ---
    public async buscarRelatorioReceita(grupoId: string): Promise<any> {
        return httpClient.get(`/api/grupos/${grupoId}/receita`);
    }

    public async configurarPaginaVendas(grupoId: string, configuracao: any): Promise<any> {
        return httpClient.post(`/api/grupos/${grupoId}/pagina-vendas`, configuracao);
    }

    public async obterPaginaVendas(grupoId: string): Promise<any> {
        return httpClient.get(`/api/grupos/${grupoId}/pagina-vendas`);
    }

    // --- Configurações de Moderação ---
    public async obterConfiguracoesModeracao(grupoId: string): Promise<any> {
        return httpClient.get(`/api/grupos/${grupoId}/moderacao/configuracoes`);
    }

    public async atualizarConfiguracoesModeracao(grupoId: string, configuracoes: any): Promise<any> {
        return httpClient.put(`/api/grupos/${grupoId}/moderacao/configuracoes`, configuracoes);
    }

    // --- Configurações de Notificacao (Grupo) ---
    public async obterConfiguracoesNotificacao(grupoId: string): Promise<any> {
        return httpClient.get(`/api/grupos/${grupoId}/notificacoes/configuracoes`);
    }

    public async atualizarConfiguracoesNotificacao(grupoId: string, settings: any): Promise<any> {
        return httpClient.put(`/api/grupos/${grupoId}/notificacoes/configuracoes`, settings);
    }

    // --- Auditoria ---
    public async obterAuditoria(grupoId: string, tipo: string): Promise<any[]> {
        return httpClient.get(`/api/grupos/${grupoId}/auditoria/${tipo}`);
    }

    // --- Cargos ---
    public async listarCargos(grupoId: string): Promise<any[]> {
        return httpClient.get(`/api/grupos/${grupoId}/cargos`);
    }

    public async atribuirCargo(grupoId: string, membroId: string, cargoId: string): Promise<any> {
        return httpClient.post(`/api/grupos/${grupoId}/cargos/atribuir`, { membroId, cargoId });
    }

    // --- Convites ---
    public async gerarConvite(grupoId: string, configuracao: any): Promise<any> {
        return httpClient.post(`/api/grupos/${grupoId}/convites`, configuracao);
    }

    // --- Criação e Gestão Geral ---
    public async criarGrupo(dados: any): Promise<any> {
        return httpClient.post(`/api/grupos`, dados);
    }

    public async buscarListaGrupos(): Promise<any[]> {
        return httpClient.get('/api/grupos');
    }

    public async obterDetalhes(grupoId: string): Promise<any> {
        return httpClient.get(`/api/grupos/${grupoId}`);
    }

    public async atualizarConfiguracoes(grupoId: string, settings: any): Promise<any> {
        return httpClient.put(`/api/grupos/${grupoId}/configuracoes`, settings);
    }

    public async obterEstatisticas(grupoId: string): Promise<any> {
        return httpClient.get(`/api/grupos/${grupoId}/estatisticas`);
    }

    // --- Diretrizes ---
    public async obterDiretrizes(grupoId: string): Promise<any> {
        return httpClient.get(`/api/grupos/${grupoId}/diretrizes`);
    }

    public async atualizarDiretrizes(grupoId: string, guidelines: any): Promise<any> {
        return httpClient.put(`/api/grupos/${grupoId}/diretrizes`, guidelines);
    }
}

export const infraProviderGrupo = new InfraProviderGrupo();
