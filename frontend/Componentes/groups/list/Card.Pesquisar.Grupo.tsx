
import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

interface CardPesquisarGrupoProps {
  onSearch: (query: string) => void;
}

export const CardPesquisarGrupo: React.FC<CardPesquisarGrupoProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearchClick = () => {
    if (query.trim()) {
      onSearch(query);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };

  return (
    // Container simplificado, apenas para layout e margem
    <div className="flex items-center gap-2 mb-8"> 
      <div className="relative flex-grow">
        <input
          type="text"
          placeholder="Encontrar um grupo..."
          value={query}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          // Estilo mais sutil e arredondado
          className="w-full bg-gray-900/70 border border-gray-700 rounded-full py-3 pl-5 pr-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00c2ff] transition-all duration-300"
        />
        <button 
          onClick={handleSearchClick} 
          // Botão posicionado absolutamente dentro do input para um look integrado
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#00c2ff] hover:bg-opacity-80 text-black font-bold rounded-full p-2 h-9 w-9 flex items-center justify-center transition-all duration-300 transform hover:scale-110"
          aria-label="Pesquisar"
        >
          <FaSearch />
        </button>
      </div>
    </div>
  );
};
