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
}

export const dadosProviderGrupo = new DadosProviderGrupo();
