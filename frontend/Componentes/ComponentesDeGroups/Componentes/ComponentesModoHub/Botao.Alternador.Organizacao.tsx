import React from 'react';
import { FaList, FaTh } from 'react-icons/fa';

type TipoVisualizacao = 'lista' | 'grade';

interface AlternadorDeVisualizacaoProps {
  visualizacaoAtual: TipoVisualizacao;
  onMudarVisualizacao: (visualizacao: TipoVisualizacao) => void;
}

const BotaoAlternadorOrganizacao: React.FC<AlternadorDeVisualizacaoProps> = ({ visualizacaoAtual, onMudarVisualizacao }) => {
  return (
    <div className="flex items-center bg-gray-800 rounded-lg p-1">
      <button
        onClick={() => onMudarVisualizacao('lista')}
        className={`px-3 py-2 rounded-md transition-colors duration-200 ${
          visualizacaoAtual === 'lista' ? 'bg-cyan-500 text-white' : 'text-gray-400 hover:bg-gray-700'
        }`}
        aria-label="Visualização em lista"
      >
        <FaList />
      </button>
      <button
        onClick={() => onMudarVisualizacao('grade')}
        className={`px-3 py-2 rounded-md transition-colors duration-200 ${
          visualizacaoAtual === 'grade' ? 'bg-cyan-500 text-white' : 'text-gray-400 hover:bg-gray-700'
        }`}
        aria-label="Visualização em grade"
      >
        <FaTh />
      </button>
    </div>
  );
};

export default BotaoAlternadorOrganizacao;
