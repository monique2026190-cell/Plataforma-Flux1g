
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Notification } from '../../../tipos';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CardNotificacaoCompraSucessoProps {
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

export const CardNotificacaoCompraSucesso: React.FC<CardNotificacaoCompraSucessoProps> = ({ notif }) => {
    const navigate = useNavigate();
    const formattedTime = formatTime(notif.createdAt);

    const handleCardClick = () => {
        // Futuramente, pode navegar para a página de detalhes do pedido
        // if (notif.entity?.id) {
        //     navigate(`/order-details/${notif.entity.id}`);
        // }
    };

    return (
        <div
            className="notification-item success-notification"
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
                .notification-text strong {
                    font-weight: 600;
                    color: #fff;
                }
                .notification-time {
                    font-size: 12px; 
                    color: #aaa; 
                    margin-top: 4px;
                }
                .success-notification {
                    background-color: rgba(0, 255, 130, 0.06);
                }
            `}</style>

            <img src={notif.actor.avatar} className="notification-avatar" alt="Avatar" />

            <div className="notification-content">
                <p className="notification-text">
                    Sua compra de <strong>{notif.entity?.text}</strong> foi concluída com sucesso!
                </p>
                <span className="notification-time">{formattedTime}</span>
            </div>
        </div>
    );
};
