
import React from 'react';
import { useNavigate } from 'react-router-dom';

const BlockedUserItem = ({ name }) => (
    <div className="blocked-user-item">
        <div className="user-info">
            <div className="user-avatar">{name.charAt(0).toUpperCase()}</div>
            <div className="user-name">{name}</div>
        </div>
        <button className="unblock-btn">Desbloquear</button>
    </div>
);

export const PG_Configuracao_GestaoDeBloqueios: React.FC = () => {
  const navigate = useNavigate();

  const blockedUsers = [
    { id: '1', name: 'Carlos Silva' },
    { id: '2', name: 'Mariana Costa' },
  ];

  return (
    <div className="h-screen bg-[radial-gradient(circle_at_top_left,_#0c0f14,_#0a0c10)] text-white font-['Inter'] flex flex-col overflow-hidden">
      <style>{`
        .blocked-user-item{display:flex;align-items:center;justify-content:space-between;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);padding:15px;border-radius:12px;margin-bottom:10px;}
        .user-info{display:flex;align-items:center;gap:12px;}
        .user-avatar{width:40px;height:40px;border-radius:50%;background:#333;display:flex;align-items:center;justify-content:center;font-weight:bold;color:#888;border:1px solid #555;}
        .user-name{font-size:16px;font-weight:500;color:#fff;}
        .unblock-btn{background:transparent;border:1px solid #ff4d4d;color:#ff4d4d;padding:6px 12px;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;transition:0.2s;}
        .unblock-btn:hover{background:#ff4d4d;color:#fff;}
        .empty-state{text-align:center;color:#777;margin-top:50px;font-size:14px;}
        .empty-state i{font-size:40px;margin-bottom:10px;display:block;opacity:0.5;}
      `}</style>

      <header className="flex items-center p-4 bg-[#0c0f14] fixed w-full top-0 z-10 border-b border-white/10 h-[65px]">
        <button onClick={() => navigate(-1)} className="bg-none border-none text-white text-2xl cursor-pointer pr-4">
            <i className="fa-solid fa-arrow-left"></i>
        </button>
        <h1 className="text-lg font-bold">Gestão de Bloqueios</h1>
      </header>

      <main className="pt-[85px] pb-[100px] w-full max-w-[600px] mx-auto px-5 overflow-y-auto flex-grow">
        {blockedUsers.length > 0 ? (
            blockedUsers.map(user => <BlockedUserItem key={user.id} name={user.name} />)
        ) : (
            <div className="empty-state">
                <i className="fa-solid fa-user-shield"></i>
                <p>Você não tem nenhum usuário bloqueado.</p>
            </div>
        )}
      </main>
    </div>
  );
};
