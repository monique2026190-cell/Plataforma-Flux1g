
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { chatService } from '../ServiçosFrontend/ServiçoDeChat/chatService';
import { ChatMessage, User } from '../types';
import { getInstanciaSuprema } from '../ServiçosFrontend/ServiçoDeAutenticação/Sistema.Autenticacao.Supremo';
const authService = getInstanciaSuprema();
import { servicoDeSimulacao } from '../ServiçosFrontend/ServiçoDeSimulação';
import { VirtuosoHandle } from 'react-virtuoso';
import { socketService } from '../ServiçosFrontend/ServiçoDeSoquete/ServiçoDeSoquete.js';

const formatLastSeen = (timestamp?: number) => {
    if (!timestamp) return "Offline";
    const diff = Date.now() - timestamp;
    if (diff < 2 * 60 * 1000) return "Online";
    return "Offline";
};

export const HookConversa = () => {
    const navigate = useNavigate();
    const { id: chatId } = useParams<{ id: string }>();

    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [contactName, setContactName] = useState('');
    const [contactHandle, setContactHandle] = useState('');
    const [contactAvatar, setContactAvatar] = useState<string | undefined>(undefined);
    const [contactStatus, setContactStatus] = useState('Offline');
    const [isBlocked, setIsBlocked] = useState(false);
    
    const virtuosoRef = useRef<VirtuosoHandle>(null);
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]); 
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [zoomedMedia, setZoomedMedia] = useState<{ url: string, type: 'image' | 'video' } | null>(null);
    const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isForwardModalOpen, setIsForwardModalOpen] = useState(false);

    const currentUserEmail = useMemo(() => authService.getState().user?.email?.toLowerCase(), []);

    const loadChatData = useCallback(async (isSilent = false) => {
        if (!chatId) {
            navigate('/messages');
            return;
        }

        try {
            const isSimulating = localStorage.getItem('isSimulating') === 'true';
            let chatData;

            if (isSimulating) {
                console.log(`[SIMULAÇÃO] useChat: Buscando detalhes do chat ID: ${chatId}`);
                const response = await fetch(`/api/conversations/${chatId}`);
                if (!response.ok) throw new Error('Chat simulado não encontrado');
                chatData = await response.json();

                const otherParticipant = chatData.participants?.find((p: any) => p.name !== 'Você');
                setContactName(otherParticipant?.name || 'Usuário');
                setContactAvatar(otherParticipant?.avatar);
                setContactHandle(otherParticipant?.handle || '');
                setContactStatus('Online'); 

            } else {
                const token = authService.getToken();
                if (!token) { navigate('/'); return; }
                chatData = await chatService.getChat(token, chatId);
                
                const otherParticipant = chatData.participants.find((p: any) => p.email.toLowerCase() !== currentUserEmail);
                if (otherParticipant) {
                    const userDetails: User = await authService.fetchUserByHandle(otherParticipant.email.split('@')[0]);
                    setContactName(userDetails.profile?.nickname || userDetails.profile?.name || 'Usuário');
                    setContactAvatar(userDetails.profile?.photoUrl);
                    setContactHandle(userDetails.profile?.name || '');
                    setContactStatus(formatLastSeen(userDetails.lastSeen));
                }
            }
            
            setIsBlocked(chatData.isBlocked || false);
            
            const rawMessages = chatData.messages || [];
            const processedMessages = rawMessages
                .filter((m: any) => !(m.deletedBy || []).includes(currentUserEmail))
                .map((m: any): ChatMessage => ({
                    ...m,
                    type: m.senderEmail?.toLowerCase() === currentUserEmail ? 'sent' : 'received',
                    timestamp: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }))
                .sort((a: any, b: any) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

            setMessages(processedMessages);

        } catch (error) {
            console.error("Erro ao carregar dados do chat:", error);
            navigate('/messages', { replace: true });
        }
    }, [chatId, currentUserEmail, navigate]);

    useEffect(() => {
        loadChatData();
        const intervalId = setInterval(() => loadChatData(true), 5000); 
        return () => clearInterval(intervalId);
    }, [loadChatData]);

    const handleSendMessage = (text: string) => {
        if (!chatId) return;
        const userInfo = authService.getState().user;
        const newMessage: Partial<ChatMessage> = {
            id: Date.now().toString(), text, contentType: 'text',
            senderEmail: userInfo?.email, 
        };
        console.log("Enviando mensagem (simulado):", newMessage);
        setMessages(prev => [...prev, { 
            ...newMessage, 
            type: 'sent', 
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
            status: 'sent',
            id: newMessage.id!
        }]);
    };

    const handleToggleSelection = (msgId: string) => {
        setSelectedIds(prev => {
            const next = prev.includes(msgId) ? prev.filter(id => id !== msgId) : [...prev, msgId];
            if (next.length === 0) setIsSelectionMode(false);
            return next;
        });
    };

    const handleStartSelection = (msgId: string) => {
        setIsSelectionMode(true);
        setSelectedIds([msgId]);
        if (navigator.vibrate) navigator.vibrate(10);
    };

    const deleteSelectedMessages = async (target: 'me' | 'all') => {
        if (selectedIds.length === 0 || !chatId) return;
        console.log(`Deletando ${selectedIds.length} mensagens para ${target}`);
        setMessages(prev => prev.filter(m => !selectedIds.includes(m.id)));
        setIsSelectionMode(false);
        setSelectedIds([]);
    };
    
    const filteredMessages = useMemo(() => {
        return messages.filter(m => (m.text || '').toLowerCase().includes(searchTerm.toLowerCase()));
    }, [messages, searchTerm]);

    const handleEdit = () => console.log('Editar', selectedIds);
    const handlePin = () => console.log('Fixar', selectedIds);
    const handleCopy = () => {
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
        const token = authService.getToken();
        if (!token) {
            alert('Autenticação necessária.');
            return;
        }

        try {
            // Loop through target chats and forward messages
            for (const targetId of targetChatIds) {
                await chatService.forwardMessages(token, selectedIds, targetId);
            }
            alert('Mensagens encaminhadas com sucesso!');
        } catch (error) {
            console.error("Erro ao encaminhar mensagens:", error);
            alert('Falha ao encaminhar mensagens.');
        }

        // Cleanup
        setIsForwardModalOpen(false);
        setIsSelectionMode(false);
        setSelectedIds([]);
    };

    const handleReply = () => console.log('Responder', selectedIds);

    return {
        virtuosoRef, messages: filteredMessages, contactName, contactHandle, contactAvatar, contactStatus, isBlocked,
        isSelectionMode, setIsSelectionMode, selectedIds, setSelectedIds, isSearchOpen, setIsSearchOpen, 
        searchTerm, setSearchTerm, zoomedMedia, setZoomedMedia, isMenuModalOpen, setIsMenuModalOpen, 
        isUploading, currentUserEmail, navigate, handleSendMessage, handleToggleSelection, handleStartSelection,
        deleteSelectedMessages, handleEdit, handlePin, handleCopy, handleForward, handleReply, 
        isForwardModalOpen, setIsForwardModalOpen, handleConfirmForward
    };
};
