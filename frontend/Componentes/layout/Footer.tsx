
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface FooterProps {
    visible?: boolean;
}

export const Footer: React.FC<FooterProps> = ({ visible = true }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [unreadNotifs, setUnreadNotifs] = useState(0);
    const [unreadMsgs, setUnreadMsgs] = useState(0);

    const updateCounts = useCallback(async () => {
        // As importações para notificationService e chatService foram removidas
        // porque os arquivos correspondentes foram deletados, como instruído.
        // A contagem de notificações e mensagens não lidas será zerada.
        try {
            setUnreadNotifs(0);
            setUnreadMsgs(0);
        } catch (error) {
            console.error("Erro ao tentar zerar contagens:", error);
        }
    }, []);

    useEffect(() => {
        updateCounts();
        
        const interval = setInterval(updateCounts, 30000);

        return () => {
            clearInterval(interval);
        };
    }, [updateCounts]);

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    return (
        <footer className={`fixed bottom-0 left-0 w-full bg-[#0c0f14] flex justify-around py-3.5 rounded-t-2xl z-30 shadow-[0_-2px_10px_rgba(0,0,0,0.5)] transition-transform duration-300 ${visible ? 'translate-y-0' : 'translate-y-full'}`}>
            <button 
                onClick={() => navigate('/feed')} 
                className={`text-[22px] p-2 transition-all hover:text-white ${isActive('/feed') ? 'text-white' : 'text-[#00c2ff]'}`}
            >
                <i className="fa-solid fa-newspaper"></i>
            </button>
            
            <button 
                onClick={() => navigate('/messages')} 
                className={`text-[22px] p-2 relative transition-all hover:text-white ${isActive('/messages') ? 'text-white' : 'text-[#00c2ff]'}`}
            >
                <i className="fa-solid fa-comments"></i>
                {unreadMsgs > 0 && (
                    <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#ff4d4d] rounded-full border border-[#0c0f14]"></div>
                )}
            </button>
            
            <button 
                onClick={() => navigate('/notifications')} 
                className={`text-[22px] p-2 relative transition-all hover:text-white ${isActive('/notifications') ? 'text-white' : 'text-[#00c2ff]'}`}
            >
                <i className="fa-solid fa-bell"></i>
                {unreadNotifs > 0 && (
                    <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#ff4d4d] rounded-full border border-[#0c0f14]"></div>
                )}
            </button>
            
            <button 
                onClick={() => navigate('/profile')} 
                className={`text-[22px] p-2 transition-all hover:text-white ${isActive('/profile') ? 'text-white' : 'text-[#00c2ff]'}`}
            >
                <i className="fa-solid fa-user"></i>
            </button>
        </footer>
    );
};
