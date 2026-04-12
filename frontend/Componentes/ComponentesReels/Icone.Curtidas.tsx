
import React from 'react';

interface IconeCurtidasProps {
    curtido: boolean;
    contagem: number;
    onClick: () => void;
}

export const IconeCurtidas: React.FC<IconeCurtidasProps> = ({ curtido, contagem, onClick }) => {
    return (
        <button className="flex flex-col items-center gap-1 text-white focus:outline-none" onClick={onClick}>
            <i className={`fa-solid fa-heart text-2xl ${curtido ? 'text-red-500' : 'text-white'}`}></i>
            <span className="text-xs font-semibold">{contagem}</span>
        </button>
    );
};
