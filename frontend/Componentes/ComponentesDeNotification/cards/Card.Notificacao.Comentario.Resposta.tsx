
import React from 'react';
import { Notification } from '../../../tipos';
import { UserAvatar } from '../../ComponenteDeInterfaceDeUsuario/user/UserAvatar';
import { UserName } from '../../ComponenteDeInterfaceDeUsuario/user/UserName';

interface CardNotificacaoComentarioRespostaProps {
  notif: Notification;
  navigate: (path: string) => void;
}

export const CardNotificacaoComentarioResposta: React.FC<CardNotificacaoComentarioRespostaProps> = ({ notif, navigate }) => {
  const handleCardClick = () => {
    // Navega para o post e foca no comentário específico
    if (notif.relatedPostId && notif.entity?.id) {
      navigate(`/post/${notif.relatedPostId}#comment-${notif.entity.id}`);
    }
  };

  return (
    <div className="notification-item" onClick={handleCardClick}>
      <UserAvatar src={notif.actor.avatar} />
      <div className="notification-content">
        <p>
          <UserName name={notif.actor.name} /> respondeu ao seu comentário: <span className="font-bold text-[#00c2ff]">{`"${notif.entity?.text}"`}</span>.
        </p>
        <span className="notification-time">{new Date(notif.createdAt).toLocaleTimeString()}</span>
      </div>
    </div>
  );
};
