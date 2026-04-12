
import React from 'react';

interface MessagesEmptyStateProps {
  searchTerm?: string;
}

export const MessagesEmptyState: React.FC<MessagesEmptyStateProps> = ({ searchTerm }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center h-full p-8 text-gray-500">
      <div className="mb-4">
        <i className={`fa-solid ${searchTerm ? 'fa-search' : 'fa-comments'} fa-3x`}></i>
      </div>
      <h3 className="font-bold text-lg text-gray-400">
        {searchTerm 
          ? `Nenhum resultado para "${searchTerm}"` 
          : "Nenhuma conversa ainda"}
      </h3>
      <p className="text-sm mt-1">
        {searchTerm
          ? "Tente uma busca diferente para encontrar suas conversas."
          : "Comece uma nova conversa para vê-la listada aqui."}
      </p>
    </div>
  );
};
