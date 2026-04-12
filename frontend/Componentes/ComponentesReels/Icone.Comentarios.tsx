
import React from 'react';

interface IconeComentariosProps {
    contagem: number;
    onClick: () => void;
}

export const IconeComentarios: React.FC<IconeComentariosProps> = ({ contagem, onClick }) => {
    return (
        <button className="flex flex-col items-center gap-1 text-white focus:outline-none" onClick={onClick}>
            <i className="fa-solid fa-comment text-2xl"></i>
            <span className="text-xs font-semibold">{contagem}</span>
        </button>
    );
};
