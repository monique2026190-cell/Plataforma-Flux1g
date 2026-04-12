
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Notification } from '../../../tipos';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CardNotificacaoConviteGrupoProps {
    notif: Notification;
    onAccept: (notificationId: string, groupId: string) => void;
    onDecline: (notificationId: string, groupId: string) => void;
}

const formatTime = (createdAt: string | Date): string => {
    try {
        const date = new Date(createdAt);
        return formatDistanceToNow(date, { addSuffix: true, locale: ptBR });
    } catch (error) {
        console.error("Error formatting date:", error);
        return "";
    }
};

export const CardNotificacaoConviteGrupo: React.FC<CardNotificacaoConviteGrupoProps> = ({ notif, onAccept, onDecline }) => {
    const navigate = useNavigate();
    const formattedTime = formatTime(notif.createdAt);
    const groupId = notif.entity?.id || '';

    const handleCardClick = (e: React.MouseEvent) => {
        // Navega para o grupo apenas se o clique não for em um botão
        if ((e.target as HTMLElement).tagName.toLowerCase() !== 'button' && groupId) {
            navigate(`/group/${groupId}`);
        }
    };

    const handleAccept = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (groupId) {
            onAccept(notif.id, groupId);
        }
    };

    const handleDecline = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (groupId) {
            onDecline(notif.id, groupId);
        }
    };

    return (
        <div
            className="notification-item group-invite-notification"
            onClick={handleCardClick}
        >
            <style>{`
                .notification-item {
                    display: flex; 
                    align-items: center; 
                    padding: 12px 0; 
                    margin-bottom: 8px; 
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1); 
                    transition: background 0.2s; 
                    cursor: pointer; 
                    border-radius: 8px;
                }
                .notification-item:hover {
                    background: rgba(255, 255, 255, 0.05);
                }
                .notification-avatar {
                    width: 48px; 
                    height: 48px; 
                    border-radius: 50%; 
                    object-fit: cover; 
                    margin-right: 12px; 
                    border: 2px solid #00c2ff;
                }
                .notification-content {
                    flex-grow: 1; 
                    display: flex; 
                    flex-direction: column; 
                    min-width: 0;
                }
                .notification-text {
                    font-size: 15px; 
                    line-height: 1.4; 
                    color: #eee;
                }
                .notification-time {
                    font-size: 12px; 
                    color: #aaa; 
                    margin-top: 4px;
                }
                .notification-actions {
                    margin-left: 10px;
                    display: flex;
                    gap: 8px;
                }
                .action-button {
                    border: none; 
                    padding: 8px 12px; 
                    border-radius: 20px; 
                    cursor: pointer; 
                    font-weight: 600; 
                    transition: 0.3s; 
                    font-size: 12px;
                }
                .accept-button {
                    background: #00c2ff; 
                    color: #000; 
                }
                .decline-button {
                    background: #333; 
                    color: #fff; 
                }
            `}</style>

            <img src={notif.actor.avatar} className="notification-avatar" alt="Avatar" />

            <div className="notification-content">
                <p className="notification-text">
                    <b className="font-bold">{notif.actor.name}</b> te convidou para o grupo <b className="font-bold">{notif.entity?.text || 'desconhecido'}</b>.
                </p>
                <span className="notification-time">{formattedTime}</span>
            </div>

            <div className="notification-actions">
                <button 
                    className="action-button accept-button" 
                    onClick={handleAccept}
                >
                    Aceitar
                </button>
                <button 
                    className="action-button decline-button" 
                    onClick={handleDecline}
                >
                    Recusar
                </button>
            </div>
        </div>
    );
};
