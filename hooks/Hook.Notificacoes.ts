
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { notificacoesApplicationService } from '../ServiçosFrontend/ServicosDeAplicacao/Notificacoes.ServicoDeAplicacao';
import { Notificacao, Grupo, InfoPreco } from '../types/Saida/Types.Estrutura.Notificacao';

export const HookNotificacoes = () => {
    const [state, setState] = useState(notificacoesApplicationService.getState());
    const [filtro, setFiltro] = useState('all');
    const [modalPagamentoAberto, setModalPagamentoAberto] = useState(false);
    const [grupoSelecionado, setGrupoSelecionado] = useState<Grupo | null>(null);
    const [infoPrecoExibicao, setInfoPrecoExibicao] = useState<InfoPreco | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = notificacoesApplicationService.subscribe(setState);
        notificacoesApplicationService.carregarNotificacoes(); // Inicia o carregamento
        return () => unsubscribe();
    }, []);

    const notificacoesFiltradas = useMemo(() => {
        return state.notificacoes.filter(notif => {
            if (filtro === 'all') return true;
            if (filtro === 'mentions') return notif.tipo === 'mention';
            if (filtro === 'follow') return notif.tipo === 'SEGUIDOR';
            if (filtro === 'likes') return notif.tipo === 'like';
            return false;
        });
    }, [state.notificacoes, filtro]);

    const alternarSeguir = useCallback(async (id: number, username: string) => {
        console.log('Ação de seguir/deixar de seguir não implementada.');
    }, []);

    const acaoPendente = useCallback(async (action: 'accept' | 'reject', notification: any) => {
        console.log('Ação pendente não implementada.');
    }, []);

    const ignorarExpiracao = useCallback((groupId: string) => {
        console.log('Ação de ignorar expiração não implementada.');
    }, []);

    const clicarPagar = useCallback(async (group: Grupo) => {
        console.log('Ação de pagamento não implementada.');
    }, []);

    return {
        notificacoes: state.notificacoes,
        carregando: state.loading,
        error: state.error,
        filtro,
        setFiltro,
        notificacoesFiltradas,
        modalPagamentoAberto,
        setModalPagamentoAberto,
        grupoSelecionado,
        infoExibicao: infoPrecoExibicao,
        alternarSeguir,
        acaoPendente,
        ignorarExpiracao,
        clicarPagar,
        navigate,
    };
};
