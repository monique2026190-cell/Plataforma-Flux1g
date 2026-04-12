
import React from 'react';
import { CardNotificacaoCurtidas } from '@/Componentes/ComponentesDeNotification/cards/Card.Notificacao.Curtidas';
import { CardNotificacaoComentario } from '@/Componentes/ComponentesDeNotification/cards/Card.Notificacao.Comentario';
import { CardNotificacaoSeguidor } from '@/Componentes/ComponentesDeNotification/cards/Card.Notificacao.Seguidor';
import { CardNotificacaoVendaRealizada } from '@/Componentes/ComponentesDeNotification/cards/Card.Notificacao.Venda.Realizada';
import { CardNotificacaoVendaPendente } from '@/Componentes/ComponentesDeNotification/cards/Card.Notificacao.Venda.Pendente';
import { CardNotificacaoCobranca } from '@/Componentes/ComponentesDeNotification/cards/Card.Notificacao.Cobranca';
import { CardNotificacaoMencao } from '@/Componentes/ComponentesDeNotification/cards/Card.Notificacao.Mencao';
import { CardNotificacaoCompartilhamento } from '@/Componentes/ComponentesDeNotification/cards/Card.Notificacao.Compartilhamento';
import { CardNotificacaoComentarioResposta } from '@/Componentes/ComponentesDeNotification/cards/Card.Notificacao.Comentario.Resposta';
import { CardNotificacaoPedidoAmizade } from '@/Componentes/ComponentesDeNotification/cards/Card.Notificacao.Pedido.Amizade';
import { CardNotificacaoConviteGrupo } from '@/Componentes/ComponentesDeNotification/cards/Card.Notificacao.Convite.Grupo';
import { CardNotificacaoLogin } from '@/Componentes/ComponentesDeNotification/cards/Card.Notificacao.Login';
import { CardNotificacaoCompraSucesso } from '@/Componentes/ComponentesDeNotification/cards/Card.Notificacao.Compra.Sucesso';
import { Notificacao } from '@/types/Saida/Types.Estrutura.Notificacao';

const ExpiringVipNotificationCard = ({ notif, onIgnore, onPay }: { notif: any, onIgnore: (id: number) => void, onPay: (groupId: string) => void }) => {
    return (
      <div className="notification-item-vip">
        <div>
          <p>Sua assinatura VIP para {notif.groupName} está expirando.</p>
        </div>
        <div>
          <button onClick={() => onPay(notif.groupId)}>Renovar</button>
          <button onClick={() => onIgnore(notif.id)}>Ignorar</button>
        </div>
      </div>
    );
};

interface NotificationCardManagerProps {
    onFollowToggle: (id: number, username: string) => void;
    onPendingAction: (action: 'accept' | 'reject', notification: any) => void;
    onIgnoreExpiring: (id: number) => void;
    onPay: (groupId: string) => void;
    navigate: (path: string) => void;
}

export const useNotificationCardManager = (props: NotificationCardManagerProps) => {
    const getCardComponent = (notif: Notificacao): React.ReactNode => {
        switch (notif.type) {
            case 'like':
                return <CardNotificacaoCurtidas notif={notif} />;
            case 'comment':
                return <CardNotificacaoComentario notif={notif} />;
            case 'comment_reply':
                return <CardNotificacaoComentarioResposta notif={notif} navigate={props.navigate} />;
            case 'follow':
                return <CardNotificacaoSeguidor notif={notif} onFollowToggle={props.onFollowToggle} />;
            case 'friend_request':
                return <CardNotificacaoPedidoAmizade notif={notif} onAccept={() => props.onPendingAction('accept', notif)} onDecline={() => props.onPendingAction('reject', notif)} />;
            case 'group_invite':
                return <CardNotificacaoConviteGrupo notif={notif} onAccept={() => props.onPendingAction('accept', notif)} onDecline={() => props.onPendingAction('reject', notif)} />;
            case 'login':
                return <CardNotificacaoLogin notif={notif} />;
            case 'venda_realizada':
                return <CardNotificacaoVendaRealizada notif={notif} />;
            case 'compra_sucesso':
                return <CardNotificacaoCompraSucesso notif={notif} />;
            case 'venda_pendente':
                return <CardNotificacaoVendaPendente notif={notif} />;
            case 'cobranca':
                return <CardNotificacaoCobranca notif={notif} onPay={props.onPay} />;
            case 'mention':
                return <CardNotificacaoMencao notif={notif} navigate={props.navigate} />;
            case 'compartilhamento':
                return <CardNotificacaoCompartilhamento notif={notif} navigate={props.navigate} />;
            case 'expiring_vip':
                return <ExpiringVipNotificationCard notif={notif} onIgnore={props.onIgnoreExpiring} onPay={props.onPay} />;
            default:
                return null;
        }
    };

    return { getCardComponent };
};
