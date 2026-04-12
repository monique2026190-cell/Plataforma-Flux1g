
import { useCallback } from 'react';
import { NotificationItem } from '../types';
import { useNavigate } from 'react-router-dom';

// CORREÇÃO: A função formatRelativeTime foi movida para cá, eliminando a dependência do groupService.
const formatRelativeTime = (timestamp: string | number | Date): string => {
    const now = new Date();
    const date = new Date(timestamp);
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = seconds / 31536000; // Anos
    if (interval > 1) {
        return Math.floor(interval) + "a";
    }
    interval = seconds / 2592000; // Meses
    if (interval > 1) {
        return Math.floor(interval) + "m";
    }
    interval = seconds / 86400; // Dias
    if (interval > 1) {
        return Math.floor(interval) + "d";
    }
    interval = seconds / 3600; // Horas
    if (interval > 1) {
        return Math.floor(interval) + "h";
    }
    interval = seconds / 60; // Minutos
    if (interval > 1) {
        return Math.floor(interval) + "min";
    }
    return Math.floor(seconds) + "s";
};

interface NotificationHandlerProps {
    notif: NotificationItem & { displayName?: string };
    onFollowToggle: (id: number, username: string) => void;
    onPendingAction: (action: 'accept' | 'reject', notification: any) => void;
}

export const useNotificationHandler = ({
    notif,
    onFollowToggle,
    onPendingAction,
}: NotificationHandlerProps) => {
    const navigate = useNavigate();

    const handleCardClick = useCallback(() => {
        if (notif.type !== 'pending') {
            const path = notif.relatedPostId 
                ? `/post/${notif.relatedPostId}`
                : `/user/${notif.username.replace('@','')}`;
            navigate(path);
        }
    }, [notif, navigate]);

    const handleFollow = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        onFollowToggle(notif.id, notif.username);
    }, [notif, onFollowToggle]);

    const handleAccept = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        onPendingAction('accept', notif);
    }, [notif, onPendingAction]);

    const handleReject = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        onPendingAction('reject', notif);
    }, [notif, onPendingAction]);

    // A chamada agora usa a função local.
    const formattedTime = formatRelativeTime(notif.timestamp);

    return {
        handleCardClick,
        handleFollow,
        handleAccept,
        handleReject,
        formattedTime,
    };
};
