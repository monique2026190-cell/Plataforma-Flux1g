
import React from 'react';
import { Notification } from '../../../tipos';
import { UserAvatar } from '../../ComponenteDeInterfaceDeUsuario/user/UserAvatar';
import { UserName } from '../../ComponenteDeInterfaceDeUsuario/user/UserName';

interface CardNotificacaoCobrancaProps {
  notif: Notification;
  onPay: (groupId: string) => void;
}

export const CardNotificacaoCobranca: React.FC<CardNotificacaoCobrancaProps> = ({ notif, onPay }) => {
  const handlePagarAgora = () => {
    if (notif.relatedGroupId) {
        onPay(notif.relatedGroupId);
    } else {
        console.error("Não foi possível iniciar o pagamento: ID do grupo não encontrado na notificação.");
    }
  };

  return (
    <div className="notification-item notification-pending">
      <UserAvatar src={notif.actor.avatar} />
      <div className="notification-content">
        <p>
          <UserName name={notif.actor.name} /> está te cobrando pelo produto/serviço <span className="font-bold text-[#00c2ff]">{notif.entity?.text}</span>.
        </p>
        <span className="notification-time">{new Date(notif.createdAt).toLocaleTimeString()}</span>
      </div>
      <button
        onClick={handlePagarAgora}
        className="ml-4 px-4 py-2 rounded-lg bg-[#ff4d4d] text-white font-bold hover:bg-[#ff6666] transition-colors"
      >
        Pagar Agora
      </button>
    </div>
  );
};
