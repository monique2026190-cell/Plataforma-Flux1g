import { z } from 'zod';
import { DadosBase } from './Dados.Base';
import { infraProviderGrupo } from './Infra.Provider.Grupo';

class DadosProviderGrupo extends DadosBase {
    constructor() {
        super('DadosProvider.Grupo');
    }

    // --- Membros ---
    async buscarMembros(grupoId: string) {
        return infraProviderGrupo.buscarMembros(grupoId);
    }

    async adicionarMembro(grupoId: string, dadosMembro: any) {
        return infraProviderGrupo.adicionarMembro(grupoId, dadosMembro);
    }

    async removerMembro(grupoId: string, membroId: string) {
        return infraProviderGrupo.removerMembro(grupoId, membroId);
    }

    // --- Moderacao ---
    async buscarSolicitacoesEntrada(grupoId: string) {
        return infraProviderGrupo.buscarSolicitacoesEntrada(grupoId);
    }

    async aprovarSolicitacao(grupoId: string, solicitacaoId: string) {
        return infraProviderGrupo.aprovarSolicitacao(grupoId, solicitacaoId);
    }

    async rejeitarSolicitacao(grupoId: string, solicitacaoId: string) {
        return infraProviderGrupo.rejeitarSolicitacao(grupoId, solicitacaoId);
    }

    // --- Mensagens Agendadas ---
    async buscarMensagensAgendadas(grupoId: string) {
        return infraProviderGrupo.buscarMensagensAgendadas(grupoId);
    }

    async agendarMensagem(grupoId: string, dadosMensagem: any) {
        return infraProviderGrupo.agendarMensagem(grupoId, dadosMensagem);
    }

    // --- Receita e Vendas ---
    async buscarRelatorioReceita(grupoId: string) {
        return infraProviderGrupo.buscarRelatorioReceita(grupoId);
    }

    async configurarPaginaVendas(grupoId: string, configuracao: any) {
        return infraProviderGrupo.configurarPaginaVendas(grupoId, configuracao);
    }

    async obterPaginaVendas(grupoId: string) {
        return infraProviderGrupo.obterPaginaVendas(grupoId);
    }

    // --- Configurações de Moderação ---
    async obterConfiguracoesModeracao(grupoId: string) {
        return infraProviderGrupo.obterConfiguracoesModeracao(grupoId);
    }

    async atualizarConfiguracoesModeracao(grupoId: string, configuracoes: any) {
        return infraProviderGrupo.atualizarConfiguracoesModeracao(grupoId, configuracoes);
    }

    // --- Configurações de Notificacao (Grupo) ---
    async obterConfiguracoesNotificacao(grupoId: string) {
        return infraProviderGrupo.obterConfiguracoesNotificacao(grupoId);
    }

    async atualizarConfiguracoesNotificacao(grupoId: string, settings: any) {
        return infraProviderGrupo.atualizarConfiguracoesNotificacao(grupoId, settings);
    }

    // --- Auditoria ---
    async obterAuditoria(grupoId: string, tipo: string) {
        return infraProviderGrupo.obterAuditoria(grupoId, tipo);
    }

    // --- Cargos ---
    async listarCargos(grupoId: string) {
        return infraProviderGrupo.listarCargos(grupoId);
    }

    // --- Convites ---
    async gerarConvite(grupoId: string, configuracao: any) {
        return infraProviderGrupo.gerarConvite(grupoId, configuracao);
    }

    // --- Criação e Gestão Geral ---
    async criarGrupo(dados: any) {
        return infraProviderGrupo.criarGrupo(dados);
    }

    async buscarListaGrupos() {
        return infraProviderGrupo.buscarListaGrupos();
    }

    async obterDetalhes(grupoId: string) {
        return infraProviderGrupo.obterDetalhes(grupoId);
    }

    async atualizarConfiguracoes(grupoId: string, settings: any) {
        return infraProviderGrupo.atualizarConfiguracoes(grupoId, settings);
    }

    async obterEstatisticas(grupoId: string) {
        return infraProviderGrupo.obterEstatisticas(grupoId);
    }

    // --- Diretrizes ---
    async obterDiretrizes(grupoId: string) {
        return infraProviderGrupo.obterDiretrizes(grupoId);
    }

    async atualizarDiretrizes(grupoId: string, guidelines: any) {
        return infraProviderGrupo.atualizarDiretrizes(grupoId, guidelines);
    }
}

export const dadosProviderGrupo = new DadosProviderGrupo();
