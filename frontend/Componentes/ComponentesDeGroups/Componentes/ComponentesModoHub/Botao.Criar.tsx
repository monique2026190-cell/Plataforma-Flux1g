
import React, { useState } from 'react';
import { FaPlus, FaFolderPlus, FaStream } from 'react-icons/fa';

interface BotaoCriarProps {
  onCriarSessao: () => void;
  onCriarPasta: () => void;
}

const BotaoCriar: React.FC<BotaoCriarProps> = ({ onCriarSessao, onCriarPasta }) => {
  const [menuAberto, setMenuAberto] = useState(false);

  const handleCriarSessao = () => {
    onCriarSessao();
    setMenuAberto(false);
  };

  const handleCriarPasta = () => {
    onCriarPasta();
    setMenuAberto(false);
  };

  return (
    <div className="fixed bottom-28 right-8 z-50">
      {menuAberto && (
        <div className="flex flex-col items-center mb-4 transition-all duration-300 ease-in-out">
          <button 
            onClick={handleCriarSessao}
            className="bg-cyan-500 text-white w-14 h-14 rounded-full flex items-center justify-center mb-3 shadow-lg hover:bg-cyan-600 transform hover:scale-110 transition-all duration-200"
            title="Criar Seção"
          >
            <FaStream size={20} />
          </button>
          <button 
            onClick={handleCriarPasta}
            className="bg-yellow-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:bg-yellow-600 transform hover:scale-110 transition-all duration-200"
            title="Criar Pasta"
          >
            <FaFolderPlus size={20} />
          </button>
        </div>
      )}
      <button
        onClick={() => setMenuAberto(!menuAberto)}
        className={`bg-red-600 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-red-500 transition-all duration-300 transform ${menuAberto ? 'rotate-45 scale-110' : 'hover:scale-110'}`}
        aria-label="Abrir menu de criação"
      >
        <FaPlus size={24} />
      </button>
    </div>
  );
};

export default BotaoCriar;
