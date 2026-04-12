
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// Supondo a existência de um serviço para interagir com o backend
// import { servicoMensagensAgendadas } from '../ServiçosFrontend/Servico.Mensagens.Agendadas';

// Interface para uma mensagem agendada
interface MensagemAgendada {
  id: string;
  content: string;
  sendAt: Date;
}

export const useGrupoConfigMensagensAgendadas = () => {
  const { id: groupId } = useParams<{ id: string }>();
  const [mensagens, setMensagens] = useState<MensagemAgendada[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!groupId) return;

    const fetchMensagens = async () => {
      setLoading(true);
      try {
        // Mock de dados, substitu-lo pela chamada de serviço real
        const mockMensagens: MensagemAgendada[] = [
          { id: '1', content: 'Lembrete da reunião de equipe', sendAt: new Date(Date.now() + 24 * 60 * 60 * 1000) },
          { id: '2', content: 'Feliz aniversário para todos os membros!', sendAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) },
        ];
        // const response = await servicoMensagensAgendadas.getMensagens(groupId);
        setMensagens(mockMensagens);
      } catch (err) {
        setError('Falha ao carregar mensagens agendadas.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMensagens();
  }, [groupId]);

  const agendarMensagem = async (content: string, sendAt: Date) => {
    if (!groupId) return;

    try {
      // const novaMensagem = await servicoMensagensAgendadas.agendarMensagem(groupId, content, sendAt);
      // setMensagens(prev => [...prev, novaMensagem]);
      console.log('Agendando mensagem:', { content, sendAt });
    } catch (err) {
      setError('Falha ao agendar mensagem.');
      console.error(err);
    }
  };

  const cancelarMensagem = async (messageId: string) => {
    if (!groupId) return;

    try {
      // await servicoMensagensAgendadas.cancelarMensagem(groupId, messageId);
      // setMensagens(prev => prev.filter(m => m.id !== messageId));
      console.log('Cancelando mensagem com ID:', messageId);
    } catch (err) {
      setError('Falha ao cancelar mensagem.');
      console.error(err);
    }
  };

  return {
    mensagens,
    loading,
    error,
    agendarMensagem,
    cancelarMensagem,
  };
};
