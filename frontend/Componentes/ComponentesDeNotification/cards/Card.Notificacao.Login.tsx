
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Notification } from '../../../tipos';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CardNotificacaoLoginProps {
    notif: Notification;
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

export const CardNotificacaoLogin: React.FC<CardNotificacaoLoginProps> = ({ notif }) => {
    const navigate = useNavigate();
    const formattedTime = formatTime(notif.createdAt);

    const handleCardClick = () => {
        // Pode navegar para uma página de atividade da conta no futuro
        // navigate('/account-activity');
    };

    return (
        <div
            className="notification-item login-notification"
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
            `}</style>

            <img src={notif.actor.avatar} className="notification-avatar" alt="Avatar" />

            <div className="notification-content">
                <p className="notification-text">
                    Detectamos um novo login na sua conta.
                </p>
                <span className="notification-time">{formattedTime}</span>
            </div>
        </div>
    );
};
