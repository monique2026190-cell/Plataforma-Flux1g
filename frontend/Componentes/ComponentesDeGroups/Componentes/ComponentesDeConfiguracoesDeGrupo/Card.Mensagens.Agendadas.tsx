
import React from 'react';

interface ScheduledMessage {
  id: string;
  content: string;
  sendAt: Date;
}

interface CardMensagensAgendadasProps {
  messages: ScheduledMessage[];
  onCancelMessage: (id: string) => void;
  onNewMessage: () => void;
}

const CardMensagensAgendadas: React.FC<CardMensagensAgendadasProps> = ({ messages, onCancelMessage, onNewMessage }) => {
  return (
    <div className="bg-white bg-opacity-5 border border-white border-opacity-10 rounded-2xl overflow-hidden">
      <div className="p-4 border-b border-white border-opacity-10">
        <h2 className="font-bold text-lg">Mensagens Agendadas</h2>
      </div>
      <div className="p-4 space-y-4">
        {messages.length === 0 ? (
          <p className="text-gray-400">Nenhuma mensagem agendada.</p>
        ) : (
          messages.map(msg => (
            <div key={msg.id} className="flex items-center justify-between">
              <div>
                <p>{msg.content}</p>
                <p className="text-sm text-gray-400">Enviar em: {msg.sendAt.toLocaleString()}</p>
              </div>
              <button onClick={() => onCancelMessage(msg.id)} className="text-red-500">
                <i className="fa-solid fa-trash"></i>
              </button>
            </div>
          ))
        )}
      </div>
      <div className="p-4 border-t border-white border-opacity-10">
        <button onClick={onNewMessage} className="bg-[#00c2ff] text-white font-bold py-2 px-4 rounded-lg w-full">
          Agendar Nova Mensagem
        </button>
      </div>
    </div>
  );
};

export default CardMensagensAgendadas;
