
import React from 'react';
import { Notification } from '../../../tipos';
import { UserAvatar } from '../../ComponenteDeInterfaceDeUsuario/user/UserAvatar';
import { UserName } from '../../ComponenteDeInterfaceDeUsuario/user/UserName';

interface CardNotificacaoVendaPendenteProps {
  notif: Notification;
}

export const CardNotificacaoVendaPendente: React.FC<CardNotificacaoVendaPendenteProps> = ({ notif }) => {
  // Adicione um manipulador de clique para o botão
  const handleConcluirCompra = () => {
    // Lógica para concluir a compra, por exemplo, redirecionar para uma página de checkout
    console.log(`Concluir compra para a notificação ${notif.id}`);
  };

  return (
    <div className="notification-item notification-pending">
      <UserAvatar src={notif.actor.avatar} />
      <div className="notification-content">
        <p>
          <UserName name={notif.actor.name} /> deixou uma compra pendente do seu produto <span className="font-bold text-[#00c2ff]">{notif.entity.text}</span>.
        </p>
        <span className="notification-time">{new Date(notif.createdAt).toLocaleTimeString()}</span>
      </div>
      <button 
        onClick={handleConcluirCompra}
        className="ml-4 px-4 py-2 rounded-lg bg-[#ffaa00] text-white font-bold hover:bg-[#ffc240] transition-colors"
      >
        Concluir Compra
      </button>
    </div>
  );
};
