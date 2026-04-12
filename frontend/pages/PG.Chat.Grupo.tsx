
import React from 'react';
import { useNavigate } from 'react-router-dom';

export const PG_Chat_Grupo: React.FC = () => {
  const navigate = useNavigate();

  const groupInfo = {
    name: '🚀 Grupo VIP do Foguete',
    avatar: 'https://images.unsplash.com/photo-1541186835142-279612c0a855?q=80&w=1961&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    members: '1.2k membros'
  };

  const messages = [
    { id: 1, sender: 'Ana', text: 'E aí, pessoal! Prontos para a decolagem?', time: '10:30', type: 'received' },
    { id: 2, sender: 'self', text: 'Com certeza! 🚀 Só esperando as coordenadas.', time: '10:31', type: 'sent' },
    { id: 3, sender: 'Carlos', text: 'Hahaha, boa! Ouvi dizer que hoje o conteúdo é de outro planeta.', time: '10:32', type: 'received' },
    { id: 4, sender: 'self', text: 'É o que todos esperamos! A última live foi incrível.', time: '10:33', type: 'sent' },
    { id: 5, sender: 'Ana', text: 'Se preparem, o lançamento é em 5 minutos!', time: '10:33', type: 'received' },
    { id: 6, sender: 'Bia (Admin)', text: 'Atenção, tripulação!  ufficialmente, o material novo já está disponível no feed. Corram lá pra conferir!', time: '10:35', type: 'special' }
  ];

  const renderMessage = (msg: typeof messages[0]) => {
    if (msg.type === 'sent') {
      return (
        <div key={msg.id} className="message-container justify-end">
          <div className="message sent">
            <p>{msg.text}</p>
            <span className="time">{msg.time}</span>
          </div>
        </div>
      );
    }
    if (msg.type === 'received') {
      return (
        <div key={msg.id} className="message-container justify-start">
          <div className="avatar-placeholder"></div>
          <div className="message received">
            <span className="sender-name">{msg.sender}</span>
            <p>{msg.text}</p>
            <span className="time">{msg.time}</span>
          </div>
        </div>
      );
    }
    if (msg.type === 'special') {
        return (
            <div key={msg.id} className="message-container justify-center">
                <div className="message special">
                    <div className="special-header"><i className="fa-solid fa-star"></i> Post da Admin</div>
                    <p>{msg.text}</p>
                    <button className="special-button" onClick={() => navigate('/feed')}>Ver no Feed</button>
                </div>
            </div>
        )
    }
    return null;
  };

  return (
    <div className="h-screen bg-[radial-gradient(circle_at_top_left,_#0c0f14,_#0a0c10)] text-white font-['Inter'] flex flex-col overflow-hidden">
        <style>{`
            .chat-header {
                display: flex; align-items: center; padding: 12px 16px; background: rgba(18, 21, 28, 0.8);
                backdrop-filter: blur(10px); z-index: 10; border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }
            .back-btn { background: none; border: none; color: #fff; font-size: 20px; cursor: pointer; margin-right: 12px; }
            .group-avatar { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 2px solid #00c2ff; }
            .group-info { flex-grow: 1; margin: 0 12px; }
            .group-info h1 { font-size: 16px; font-weight: 700; }
            .group-info p { font-size: 12px; color: #888; }
            .header-actions button { background: none; border: none; color: #fff; font-size: 18px; cursor: pointer; margin-left: 16px; }

            .chat-body { flex-grow: 1; overflow-y: auto; padding: 20px 10px; display: flex; flex-direction: column; gap: 12px; }
            
            .message-container { display: flex; width: 100%; }
            .message { max-width: 75%; padding: 10px 15px; border-radius: 20px; position: relative; }
            .message p { margin: 0; font-size: 14px; line-height: 1.4; }
            .time { font-size: 10px; color: rgba(255, 255, 255, 0.5); display: block; text-align: right; margin-top: 4px; }
            
            .sent { background-color: #00c2ff; color: #000; border-bottom-right-radius: 5px; }
            .sent .time { color: rgba(0, 0, 0, 0.6); }

            .received { background-color: #262D3F; color: #fff; border-bottom-left-radius: 5px; }
            .sender-name { font-size: 11px; font-weight: 700; color: #00c2ff; display: block; margin-bottom: 4px; }
            
            .avatar-placeholder { width: 32px; height: 32px; border-radius: 50%; background: #333; margin-right: 8px; align-self: flex-end; }
            
            .special { 
                width: 90%; max-width: 400px; background: linear-gradient(145deg, #FFD700, #B8860B);
                border: 1px solid #FFD700; border-radius: 12px; text-align: center; padding: 16px;
                color: #000;
            }
            .special-header { font-weight: 800; font-size: 14px; margin-bottom: 8px; }
            .special p { font-size: 13px; margin-bottom: 12px; }
            .special-button { background: #000; color: #FFD700; border:none; padding: 8px 16px; border-radius: 8px; font-weight: bold; cursor: pointer; }

            .chat-footer { padding: 12px 16px; background: #0c0f14; border-top: 1px solid rgba(255, 255, 255, 0.1); }
            .input-container { display: flex; align-items: center; background-color: #1c212b; border-radius: 25px; padding: 5px; }
            .input-container button { background: none; border: none; color: #888; font-size: 18px; cursor: pointer; padding: 10px; }
            .input-container button.send-btn { color: #00c2ff; }
            .message-input { flex-grow: 1; background: none; border: none; color: #fff; font-size: 15px; padding: 10px; outline: none; }
            .message-input::placeholder { color: #888; }
        `}</style>
        
        <header className="chat-header">
            <button onClick={() => navigate(-1)} className="back-btn"><i className="fa-solid fa-arrow-left"></i></button>
            <img src={groupInfo.avatar} alt="Group Avatar" className="group-avatar"/>
            <div className="group-info">
                <h1>{groupInfo.name}</h1>
                <p>{groupInfo.members}</p>
            </div>
            <div className="header-actions">
                <button><i className="fa-solid fa-video"></i></button>
                <button><i className="fa-solid fa-circle-info"></i></button>
            </div>
        </header>
        
        <main className="chat-body">
            {messages.map(msg => renderMessage(msg))}
        </main>
        
        <footer className="chat-footer">
            <div className="input-container">
                <button><i className="fa-solid fa-paperclip"></i></button>
                <input type="text" className="message-input" placeholder="Digite uma mensagem..."/>
                <button><i className="fa-solid fa-microphone"></i></button>
                <button className="send-btn"><i className="fa-solid fa-paper-plane"></i></button>
            </div>
        </footer>
    </div>
  );
};
