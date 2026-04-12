
import React from 'react';

interface CardInformacoesReelsProps {
    user: {
        username: string;
        avatar: string;
    };
    description: string;
}

export const CardInformacoesReels: React.FC<CardInformacoesReelsProps> = ({ user, description }) => {
    return (
        <div className="p-4 text-white">
            <style>{`
                .user-info-card {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 10px;
                }
                .user-info-card img {
                    border-radius: 50%;
                    border: 2px solid #00c2ff;
                    width: 40px;
                    height: 40px;
                }
                .user-info-card span {
                    font-weight: bold;
                    font-size: 1rem;
                }
                .description-card {
                    font-size: 0.9rem;
                    line-height: 1.3;
                }
            `}</style>
            <div className="user-info-card">
                <img src={user.avatar} alt={`Avatar de ${user.username}`} />
                <span>{user.username}</span>
            </div>
            <p className="description-card">{description}</p>
        </div>
    );
};
