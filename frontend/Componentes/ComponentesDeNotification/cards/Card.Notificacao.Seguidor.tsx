
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Notification } from '../../../tipos';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CardNotificacaoSeguidorProps {
    notif: Notification & { displayName?: string; isFollowing?: boolean };
    onFollowToggle: (id: number, username: string) => void;
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

export const CardNotificacaoSeguidor: React.FC<CardNotificacaoSeguidorProps> = ({ notif, onFollowToggle }) => {
    const navigate = useNavigate();
    const formattedTime = formatTime(notif.createdAt);
    const [isFollowing, setIsFollowing] = useState(notif.isFollowing);

    const handleCardClick = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).tagName.toLowerCase() !== 'button') {
            if (notif.senderUsername) {
                navigate(`/profile/${notif.senderUsername}`);
            }
        }
    };

    const handleFollow = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setIsFollowing(prevState => !prevState);
        if (notif.senderUsername) {
            onFollowToggle(notif.id, notif.senderUsername);
        }
    }, [notif.id, notif.senderUsername, onFollowToggle]);

    return (
        <div
            className="notification-item follow-notification"
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
                .notification-action {
                    margin-left: 10px;
                }
                .action-button {
                    background: #00c2ff; 
                    color: #000; 
                    border: none; 
                    padding: 8px 12px; 
                    border-radius: 20px; 
                    cursor: pointer; 
                    font-weight: 600; 
                    transition: 0.3s; 
                    font-size: 12px;
                }
                .action-button.following {
                    background: #1a1a1a; 
                    color: #00c2ff; 
                    border: 1px solid #00c2ff;
                }
            `}</style>

            <img src={notif.avatar} className="notification-avatar" alt="Avatar" />

            <div className="notification-content">
                <p className="notification-text">
                    <b className="font-bold">{notif.displayName}</b> começou a te seguir.
                </p>
                <span className="notification-time">{formattedTime}</span>
            </div>

            <div className="notification-action">
                <button 
                    className={`action-button ${isFollowing ? 'following' : ''}`} 
                    onClick={handleFollow}
                >
                    {isFollowing ? 'Seguindo' : 'Seguir'}
                </button>
            </div>
        </div>
    );
};
