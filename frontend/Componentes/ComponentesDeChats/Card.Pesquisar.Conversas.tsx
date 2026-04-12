
import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

interface CardPesquisarConversasProps {
  onSearch: (query: string) => void;
}

export const CardPesquisarConversas: React.FC<CardPesquisarConversasProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    // Opcional: chamar onSearch a cada digitação para busca em tempo real
    // onSearch(e.target.value);
  };

  const handleSearchClick = () => {
    onSearch(query);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };

  return (
    <div className="px-4 pt-3 pb-4">
      <div className="relative flex-grow">
        <input
          type="text"
          placeholder="Pesquisar conversas..."
          value={query}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          className="w-full bg-gray-900/70 border border-gray-700 rounded-full py-3 pl-5 pr-12 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00c2ff] transition-all duration-300"
        />
        <button 
          onClick={handleSearchClick} 
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-[#00c2ff] hover:bg-opacity-80 text-black font-bold rounded-full p-2 h-9 w-9 flex items-center justify-center transition-all duration-300 transform hover:scale-110"
          aria-label="Pesquisar"
        >
          <FaSearch />
        </button>
      </div>
    </div>
  );
};
