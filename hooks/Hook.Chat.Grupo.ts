
import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { VirtuosoHandle } from 'react-virtuoso';
import { Group, Message } from '../tipos';
import SistemaAutenticacaoSupremo from '../ServiçosFrontend/ServiçoDeAutenticação/Sistema.Autenticacao.Supremo';
import { SistemaGrupoSupremo } from '../ServiçosFrontend/ServiçoDeGrupos/Sistema.Grupo.Supremo';
import { chatService } from '../ServiçosFrontend/ServiçoDeChat/chatService';

export const useGroupChat = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const virtuosoRef = useRef<VirtuosoHandle>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [groupInfo, setGroupInfo] = useState<Group | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isBlocked, setIsBlocked] = useState(false);
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
    const [isForwardModalOpen, setIsForwardModalOpen] = useState(false);

    useEffect(() => {
        const currentState = SistemaAutenticacaoSupremo.getState();
        setCurrentUserEmail(currentState.user?.email?.toLowerCase() || null);
        const unsubscribe = SistemaAutenticacaoSupremo.subscribe(state => {
            setCurrentUserEmail(state.user?.email?.toLowerCase() || null);
        });
        return () => unsubscribe();
    }, []);

    const loadChatData = useCallback(async (groupId: string) => {
        setLoading(true);
        setError(null);
        try {
            const data = await SistemaGrupoSupremo.getGroupChatData(groupId);
            setGroupInfo(data.group);
            setMessages(data.messages || []);
        } catch (err) {
            console.error("[useGroupChat] Falha ao carregar dados do chat:", err);
            setError("Não foi possível carregar as informações do grupo. Tente novamente mais tarde.");
            setGroupInfo(null);
            setMessages([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (id) {
            loadChatData(id);
        }
    }, [id, loadChatData]);

    const handleSendMessage = (text: string, media?: any) => {
        console.log("Enviando mensagem:", { text, media });
        const newMessage: Message = {
            id: `msg-${Date.now()}`,
            senderEmail: currentUserEmail || 'unknown@user.com',
            senderName: 'Eu',
            senderAvatar: 'https://i.pravatar.cc/150?u=me',
            text,
            timestamp: Date.now(),
        };
        setMessages(prev => [...prev, newMessage]);
    };
    
    const handleToggleSelection = (messageId: string) => {
        setSelectedIds(prev =>
            prev.includes(messageId)
                ? prev.filter(id => id !== messageId)
                : [...prev, messageId]
        );
    };

    const handleStartSelection = (messageId: string) => {
        setIsSelectionMode(true);
        setSelectedIds([messageId]);
    };

    const deleteSelectedMessages = (mode: 'me' | 'all') => {
        console.log(`Deletando ${selectedIds.length} mensagens (modo: ${mode})`);
        setMessages(prev => prev.filter(msg => !selectedIds.includes(msg.id)));
        setIsSelectionMode(false);
        setSelectedIds([]);
    };

    const handleEdit = () => {
        console.log('Editar mensagens de grupo:', selectedIds);
        setIsSelectionMode(false);
        setSelectedIds([]);
    };

    const handlePin = () => {
        console.log('Fixar mensagens de grupo:', selectedIds);
        setIsSelectionMode(false);
        setSelectedIds([]);
    };

    const handleCopy = () => {
        if (selectedIds.length === 0) return;
        const selectedMessage = messages.find(m => m.id === selectedIds[0]);
        if (selectedMessage?.text) {
            navigator.clipboard.writeText(selectedMessage.text)
                .then(() => alert('Mensagem copiada!'))
                .catch(err => console.error('Erro ao copiar', err));
        }
        setIsSelectionMode(false);
        setSelectedIds([]);
    };

    const handleForward = () => {
        if (selectedIds.length === 0) return;
        setIsForwardModalOpen(true);
    };

    const handleConfirmForward = async (targetChatIds: string[]) => {
        const token = SistemaAutenticacaoSupremo.getState().token;
        if (!token) {
            alert('Autenticação necessária.');
            return;
        }

        try {
            for (const targetId of targetChatIds) {
                await chatService.forwardMessages(token, selectedIds, targetId);
            }
            alert('Mensagens encaminhadas com sucesso!');
        } catch (error) {
            console.error("Erro ao encaminhar mensagens:", error);
            alert('Falha ao encaminhar mensagens.');
        }

        setIsForwardModalOpen(false);
        setIsSelectionMode(false);
        setSelectedIds([]);
    };

    const handleReply = () => {
        console.log('Responder em grupo:', selectedIds);
        setIsSelectionMode(false);
        setSelectedIds([]);
    };

    return {
        loading, error, group: groupInfo, messages, isBlocked, virtuosoRef, isSelectionMode, selectedIds, currentUserEmail,
        handleSendMessage, handleToggleSelection, handleStartSelection, deleteSelectedMessages, setIsSelectionMode, setSelectedIds, navigate,
        handleEdit, handlePin, handleCopy, handleForward, handleReply,
        isForwardModalOpen, setIsForwardModalOpen, handleConfirmForward
    };
};
