
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ServicoGestaoListaConversas } from '../ServiçosFrontend/ServicoConversas/Servico.Gestao.Lista.Conversas';
import { DadosChat } from '../types/Saida/Types.Estrutura.Chat';

export const HookListaConversas = () => {
    const navigate = useNavigate();
    const [conversas, setConversas] = useState<DadosChat[]>([]);
    const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [unreadMsgs, setUnreadMsgs] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            const conversations = await ServicoGestaoListaConversas.listarConversas();
            setConversas(conversations || []);
        } catch (error) {
            console.error("Erro ao carregar dados do chat:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
        const intervalId = setInterval(loadData, 5000); 
        return () => clearInterval(intervalId);
    }, [loadData]);

    const handleContactClick = (conversa: DadosChat) => {
        if (isSelectionMode) {
            setSelectedIds(prev => prev.includes(conversa.id) ? prev.filter(i => i !== conversa.id) : [...prev, conversa.id]);
        } else {
            navigate(`/chat/${conversa.id}`);
        }
    };
    
    const handleMarkAllRead = () => {
        console.log("Marcar todas como lidas (a ser implementado)");
    };
    const handleClearSelected = () => {
        console.log("Limpar selecionadas (a ser implementado)");
    };
    const handleProfileNavigate = (e: React.MouseEvent, handle: string) => {
        e.stopPropagation();
        if (handle) navigate(`/user/${handle.replace('@', '')}`);
    };
    const closeMenuAndEnterSelection = () => {
        setIsMenuModalOpen(false);
        setIsSelectionMode(true);
    };

    return {
        conversas,
        isLoading,
        isMenuModalOpen,
        setIsMenuModalOpen,
        isSelectionMode,
        setIsSelectionMode,
        selectedIds,
        setSelectedIds,
        unreadMsgs,
        handleMarkAllRead,
        handleContactClick,
        handleProfileNavigate,
        handleClearSelected,
        closeMenuAndEnterSelection,
    };
};
