
import React from 'react';

interface IconeCompartilharProps {
    onClick: () => void;
}

export const IconeCompartilhar: React.FC<IconeCompartilharProps> = ({ onClick }) => {
    return (
        <button className="flex flex-col items-center gap-1 text-white focus:outline-none" onClick={onClick}>
            <i className="fa-solid fa-paper-plane text-2xl"></i>
            <span className="text-xs font-semibold">Partilhar</span>
        </button>
    );
};
