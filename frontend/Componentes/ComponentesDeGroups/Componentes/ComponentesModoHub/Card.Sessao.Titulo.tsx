
import React, { useState } from 'react';
import { FaCog } from 'react-icons/fa';
import ModalGestao from './Modal.Gestao';

interface CardSessaoTituloProps {
  titulo: string;
}

// Dados de exemplo para os cargos
const cargosDeExemplo = [
  { nome: 'Administrador' },
  { nome: 'Moderador' },
  { nome: 'Membro' },
];

const CardSessaoTitulo: React.FC<CardSessaoTituloProps> = ({ titulo }) => {
  const [modalAberto, setModalAberto] = useState(false);

  return (
    <>
      <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-[#00c2ff] rounded-full"></div> 
              <h2 className="text-xl font-bold text-[#00c2ff] tracking-wide">
                  {titulo}
              </h2>
          </div>
          <button onClick={() => setModalAberto(true)} className="text-gray-500 hover:text-white p-2 rounded-full transition-colors">
              <FaCog size={18} />
          </button>
      </div>

      {modalAberto && (
        <ModalGestao 
          titulo={`Gerenciar "${titulo}"`}
          cargos={cargosDeExemplo} // Passando a lista de exemplo
          onClose={() => setModalAberto(false)}
        />
      )}
    </>
  );
};

export default CardSessaoTitulo;
