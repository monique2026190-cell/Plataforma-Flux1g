
import React, { useState, useEffect, useMemo } from 'react';
import { SistemaGrupoSupremo } from '../../ServiçosFrontend/ServiçoDeGrupos/Sistema.Grupo.Supremo';
import { chatService } from '../../ServiçosFrontend/ServiçoDeChat/chatService';



interface Conversation {
  id: string;
  name: string;
  avatar: string;
  type: 'group' | 'chat';
}

interface ModalEncaminharMensagemProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (targetIds: string[]) => void;
}

export const ModalEncaminharMensagem: React.FC<ModalEncaminharMensagemProps> = ({ isOpen, onClose, onConfirm }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchConversations = async () => {
        setLoading(true);
        try {
          const groupData = await SistemaGrupoSupremo.getGroupList();
          const token = authService.getToken();
          const chatData = token ? await chatService.listConversations(token) : [];
          
          const groups: Conversation[] = groupData.map((g: any) => ({
            id: g.id,
            name: g.name,
            avatar: g.avatar,
            type: 'group',
          }));

          const chats: Conversation[] = (chatData || []).map((c: any) => ({
            id: c.id,
            name: c.contact.name,
            avatar: c.contact.avatar,
            type: 'chat',
          }));

          setConversations([...groups, ...chats]);
        } catch (error) {
          console.error("Failed to fetch conversations:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchConversations();
    }
  }, [isOpen]);

  const handleToggleSelection = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const filteredConversations = useMemo(() =>
    conversations.filter(c =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase())
    ), [conversations, searchTerm]);

  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h2 style={styles.title}>Encaminhar para...</h2>
        <input
          type="text"
          placeholder="Pesquisar..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        <div style={styles.listContainer}>
          {loading ? <p>Carregando...</p> :
            filteredConversations.map(convo => (
              <div
                key={convo.id}
                style={{...styles.listItem, ...(selected.includes(convo.id) ? styles.listItemSeleted : {})}}
                onClick={() => handleToggleSelection(convo.id)}
              >
                <img src={convo.avatar} alt={convo.name} style={styles.avatar} />
                <span style={styles.name}>{convo.name}</span>
                 <div style={{...styles.checkbox, ...(selected.includes(convo.id) ? styles.checkboxSelected : {})}}>
                   {selected.includes(convo.id) && <div style={styles.checkboxIcon}>✓</div>}
                </div>
              </div>
            ))
          }
        </div>
        <div style={styles.buttonContainer}>
          <button onClick={onClose} style={{ ...styles.button, ...styles.cancelButton }}>
            Cancelar
          </button>
          <button
            onClick={() => onConfirm(selected)}
            disabled={selected.length === 0}
            style={{ ...styles.button, ...styles.confirmButton, ...(selected.length === 0 ? styles.disabledButton : {}) }}
          >
            {`Enviar (${selected.length})`}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
    overlay: {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        zIndex: 1000,
    },
    modal: {
        background: '#1e2227', color: '#e1e2e3',
        borderRadius: '16px',
        padding: '20px',
        width: '90%', maxWidth: '450px',
        display: 'flex', flexDirection: 'column',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    title: {
        margin: '0 0 20px 0',
        fontSize: '22px',
        fontWeight: '700',
        textAlign: 'center',
    },
    searchInput: {
        width: '100%',
        padding: '12px 16px',
        borderRadius: '10px',
        border: '1px solid #4f565e',
        backgroundColor: '#2a2f35',
        color: 'white',
        marginBottom: '20px',
        fontSize: '16px',
    },
    listContainer: {
        maxHeight: '40vh',
        overflowY: 'auto',
        marginBottom: '24px',
    },
    listItem: {
        display: 'flex',
        alignItems: 'center',
        padding: '10px',
        cursor: 'pointer',
        borderRadius: '12px',
        transition: 'background-color 0.2s',
        border: '2px solid transparent',
        marginBottom: '8px',
        backgroundColor: 'rgba(255,255,255, 0.05)'
    },
    listItemSeleted: {
        backgroundColor: 'rgba(0, 123, 255, 0.2)',
        borderColor: 'rgba(0, 123, 255, 0.8)',
    },
    avatar: {
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        marginRight: '16px',
        border: '2px solid rgba(255, 255, 255, 0.1)',
    },
    name: {
        flex: 1,
        fontWeight: '500',
        fontSize: '16px',
    },
    checkbox: {
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        border: '2px solid #4f565e',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s'
    },
    checkboxSelected: {
        backgroundColor: '#007bff',
        border: '2px solid #007bff',
    },
    checkboxIcon: {
        color: 'white',
        fontSize: '16px',
        fontWeight: 'bold',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: '12px',
    },
    button: {
        flex: 1,
        padding: '12px 20px',
        border: 'none',
        borderRadius: '10px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '16px',
        transition: 'all 0.2s'
    },
    cancelButton: {
        backgroundColor: '#4f565e',
        color: 'white',
    },
    confirmButton: {
        backgroundColor: '#007bff',
        color: 'white',
    },
    disabledButton: {
        backgroundColor: '#3a3f44',
        color: '#777',
        cursor: 'not-allowed',
    }
};
