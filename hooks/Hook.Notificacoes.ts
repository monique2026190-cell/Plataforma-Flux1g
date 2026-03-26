
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getInstanciaSuprema } from '../ServiçosFrontend/ServiçoDeAutenticação/Sistema.Autenticacao.Supremo';
const authService = getInstanciaSuprema();
import servicoNotificacao from '../ServiçosFrontend/ServicoNotificacao/Servico.Notificacao';
import { Notificacao, Grupo, InfoPreco } from '../types/Saida/Types.Estrutura.Notificacao';

export const HookNotificacoes = () => {
    const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [filtro, setFiltro] = useState('all');
    const [modalPagamentoAberto, setModalPagamentoAberto] = useState(false);
    const [grupoSelecionado, setGrupoSelecionado] = useState<Grupo | null>(null);
    const [infoPrecoExibicao, setInfoPrecoExibicao] = useState<InfoPreco | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const verificarAutenticacaoEBuscarDados = async () => {
            const estadoAtual = await authService.confirmarAutenticacao();

            if (estadoAtual.isAuthenticated && estadoAtual.token) {
                setCarregando(true);
                try {
                    // CORREÇÃO: Chamar o método correto 'getNotifications' e passar o token.
                    const dados = await servicoNotificacao.getNotifications(estadoAtual.token);
                    setNotificacoes(dados);
                } catch (error) {
                    console.error("HookNotificacoes: Erro ao buscar notificações:", error);
                    setNotificacoes([]);
                } finally {
                    setCarregando(false);
                }
            } else {
                // Se não estiver autenticado, não há necessidade de navegar aqui, pois o serviço de auth já cuida disso.
                console.log("HookNotificacoes: Usuário não autenticado.");
                setCarregando(false);
            }
        };

        verificarAutenticacaoEBuscarDados();

        const unsubscribe = authService.subscribe((estado) => {
            if (!estado.isAuthenticated) {
                console.log("HookNotificacoes: Usuário deslogado. Limpando notificações.");
                setNotificacoes([]);
                navigate('/');
            }
        });

        return () => unsubscribe();
    }, [navigate]);

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

    const notificacoesFiltradas = useMemo(() => {
        return notificacoes.filter(notif => {
            if (filtro === 'all') return true;
            if (filtro === 'mentions') return notif.tipo === 'mention';
            // CORREÇÃO: Os tipos de notificação são "SEGUIDOR" e "like"
            if (filtro === 'follow') return notif.tipo === 'SEGUIDOR';
            if (filtro === 'likes') return notif.tipo === 'like';
            return false;
        });
    }, [notificacoes, filtro]);

    return {
        notificacoes,
        carregando,
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
