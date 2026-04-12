
import React, { useState } from 'react';
import { FaCog } from 'react-icons/fa';
import { FiFolder } from 'react-icons/fi';
import ModalGestao from './Modal.Gestao';

interface PastaCardProps {
  nomePasta: string;
  onClick: () => void;
  layout?: 'grade' | 'lista';
}

// Dados de exemplo para os cargos (pode ser compartilhado ou vir de um hook)
const cargosDeExemplo = [
  { nome: 'Visualizador' },
  { nome: 'Editor' },
];

const PastaCard: React.FC<PastaCardProps> = ({ nomePasta, onClick, layout = 'grade' }) => {
  const [modalAberto, setModalAberto] = useState(false);

  const openModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setModalAberto(true);
  };

  const baseClasses = "relative group rounded-lg border shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform cursor-pointer";
  const layoutClasses = layout === 'grade'
    ? "bg-gray-800 border-gray-700 hover:bg-gray-700 hover:border-gray-600 hover:-translate-y-1 p-5 flex flex-col items-center justify-center"
    : "bg-gray-800 border-gray-700 hover:bg-gray-700 hover:border-gray-600 p-4 flex items-center justify-between";

  return (
    <>
      <div
        className={`${baseClasses} ${layoutClasses}`}
        onClick={onClick}
      >
        <div className={`flex items-center ${layout === 'grade' ? 'flex-col' : 'flex-row'}`}>
            <FiFolder className={`text-cyan-500 ${layout === 'grade' ? 'text-5xl mb-3' : 'text-2xl mr-4'}`} />
            <span className="text-white font-semibold text-center">{nomePasta}</span>
        </div>

        <button 
          onClick={openModal} 
          className="absolute top-2 right-2 text-gray-400 hover:text-white p-2 rounded-full transition-colors z-10"
          aria-label="Gerenciar Pasta"
        >
          <FaCog size={18} />
        </button>
      </div>

      {modalAberto && (
        <ModalGestao 
          titulo={`Gerenciar "${nomePasta}"`}
          cargos={cargosDeExemplo} // Passando a lista de exemplo para a pasta
          onClose={() => setModalAberto(false)}
        />
      )}
    </>
  );
};

export default PastaCard;
