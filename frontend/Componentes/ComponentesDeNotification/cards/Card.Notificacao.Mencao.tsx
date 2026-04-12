
import React from 'react';
import { Notification } from '../../../tipos';
import { UserAvatar } from '../../ComponenteDeInterfaceDeUsuario/user/UserAvatar';
import { UserName } from '../../ComponenteDeInterfaceDeUsuario/user/UserName';

interface CardNotificacaoMencaoProps {
  notif: Notification;
  navigate: (path: string) => void;
}

export const CardNotificacaoMencao: React.FC<CardNotificacaoMencaoProps> = ({ notif, navigate }) => {
  const handleCardClick = () => {
    // Exemplo: Navegar para o post ou comentário onde a menção ocorreu.
    // A lógica exata de navegação dependerá da estrutura de suas rotas.
    if (notif.entity?.type === 'post') {
      navigate(`/post/${notif.entity.id}`); // Supondo que você tenha um ID de entidade
    } else if (notif.entity?.type === 'comment') {
      navigate(`/post/${notif.relatedPostId}#comment-${notif.entity.id}`);
    }
  };

  const mentionText = `mencionou você em um ${notif.entity?.type === 'comment' ? 'comentário' : 'post'}`;

  return (
    <div className="notification-item" onClick={handleCardClick}>
      <UserAvatar src={notif.actor.avatar} />
      <div className="notification-content">
        <p>
          <UserName name={notif.actor.name} /> {mentionText}: <span className="font-bold text-[#00c2ff]">{`"${notif.entity?.text}"`}</span>.
        </p>
        <span className="notification-time">{new Date(notif.createdAt).toLocaleTimeString()}</span>
      </div>
    </div>
  );
};
