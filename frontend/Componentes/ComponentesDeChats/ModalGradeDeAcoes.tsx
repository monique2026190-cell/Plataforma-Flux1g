
import React from 'react';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faThumbtack, faCopy, faShare, faReply } from '@fortawesome/free-solid-svg-icons';

const styles: { [key: string]: React.CSSProperties } = {
  gridContainer: {
    display: 'flex',
    alignItems: 'stretch',
    padding: '8px',
    backgroundColor: 'rgba(0,0,0,0.1)',
    margin: '8px auto',
    width: 'calc(100% - 16px)',
    boxSizing: 'border-box',
    transition: 'all 0.3s ease',
  },
  gridItem: {
    flex: '1',
    margin: '0 4px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '12px 8px',
    backgroundColor: 'rgba(42, 47, 53, 0.8)',
    backdropFilter: 'blur(5px)',
    borderRadius: '12px',
    color: '#e1e2e3',
    textAlign: 'center',
    cursor: 'pointer',
    aspectRatio: '1 / 1',
    fontSize: '0.7rem',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  icon: {
    marginBottom: '8px',
    fontSize: '1.4rem',
  },
};

export interface Acao {
  id: string;
  label: string;
  icon: IconProp;
  onClick: () => void;
}

interface ActionHandlers {
  onEdit?: () => void;
  onPin?: () => void;
  onCopy?: () => void;
  onForward?: () => void;
  onReply?: () => void;
}

interface ModalGradeDeAcoesProps extends ActionHandlers {
  visible: boolean;
}

export const ModalGradeDeAcoes: React.FC<ModalGradeDeAcoesProps> = ({
  visible,
  onEdit,
  onPin,
  onCopy,
  onForward,
  onReply,
}) => {
  if (!visible) {
    return null;
  }

  const acoes: Acao[] = [
    { id: 'editar', label: 'Editar', icon: faPencilAlt, onClick: onEdit || (() => {}) },
    { id: 'fixar', label: 'Fixar', icon: faThumbtack, onClick: onPin || (() => {}) },
    { id: 'copiar', label: 'Copiar', icon: faCopy, onClick: onCopy || (() => {}) },
    { id: 'encaminhar', label: 'Encaminhar', icon: faShare, onClick: onForward || (() => {}) },
    { id: 'responder', label: 'Responder', icon: faReply, onClick: onReply || (() => {}) },
  ];

  return (
    <div style={{...styles.gridContainer, opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)'}}>
      {acoes.map((acao) => (
        <div key={acao.id} style={styles.gridItem} onClick={acao.onClick}>
          <FontAwesomeIcon icon={acao.icon} style={styles.icon} />
          <span>{acao.label}</span>
        </div>
      ))}
    </div>
  );
};
