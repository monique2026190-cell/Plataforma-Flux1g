
import React from 'react';
import { Notification } from '../../../tipos';
import { UserAvatar } from '../../ComponenteDeInterfaceDeUsuario/user/UserAvatar';
import { UserName } from '../../ComponenteDeInterfaceDeUsuario/user/UserName';

interface CardNotificacaoCompartilhamentoProps {
  notif: Notification;
  navigate: (path: string) => void;
}

export const CardNotificacaoCompartilhamento: React.FC<CardNotificacaoCompartilhamentoProps> = ({ notif, navigate }) => {
  const handleCardClick = () => {
    if (notif.entity?.id) {
      navigate(`/post/${notif.entity.id}`);
    }
  };

  return (
    <div className="notification-item" onClick={handleCardClick}>
      <UserAvatar src={notif.actor.avatar} />
      <div className="notification-content">
        <p>
          <UserName name={notif.actor.name} /> compartilhou seu post: <span className="font-bold text-[#00c2ff]">{`"${notif.entity?.text}"`}</span>.
        </p>
        <span className="notification-time">{new Date(notif.createdAt).toLocaleTimeString()}</span>
      </div>
    </div>
  );
};
