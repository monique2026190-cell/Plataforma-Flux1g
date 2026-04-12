
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Notification } from '../../../tipos';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CardNotificacaoVendaRealizadaProps {
    notif: Notification & { displayName?: string; price?: number; postImage?: string };
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

export const CardNotificacaoVendaRealizada: React.FC<CardNotificacaoVendaRealizadaProps> = ({ notif }) => {
    const navigate = useNavigate();
    const formattedTime = formatTime(notif.createdAt);

    const handleCardClick = () => {
        if (notif.senderUsername) {
            navigate(`/profile/${notif.senderUsername}`);
        }
    };

    return (
        <div
            className="notification-item sale-notification"
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
                    border: 2px solid #00ff88;
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
                .sale-price {
                    color: #00ff88;
                    font-weight: bold;
                }
                .notification-time {
                    font-size: 12px;
                    color: #aaa;
                    margin-top: 4px;
                }
                .notification-action {
                    margin-left: 10px;
                }
                .notification-action img {
                    width: 60px;
                    height: 60px;
                    border-radius: 8px;
                    object-fit: cover;
                    border: 1px solid rgba(0, 255, 136, 0.3);
                }
            `}</style>

            <img src={notif.avatar} className="notification-avatar" alt="Avatar" />

            <div className="notification-content">
                <p className="notification-text">
                    <b className="font-bold">{notif.displayName}</b> comprou seu produto por <span className="sale-price">R$ {notif.price?.toFixed(2)}</span>.
                </p>
                <span className="notification-time">{formattedTime}</span>
            </div>

            <div className="notification-action">
                {notif.postImage && (
                    <img src={notif.postImage} alt="Produto" />
                )}
            </div>
        </div>
    );
};
