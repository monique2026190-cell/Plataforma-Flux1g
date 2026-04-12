
import React from 'react';

interface CabecalhoConfiguracoesProps {
    titulo: string;
    onBack: () => void;
}

export const CabecalhoConfiguracaoCargos: React.FC<CabecalhoConfiguracoesProps> = ({ titulo, onBack }) => {
    return (
        <header className="flex items-center p-4 bg-[#0c0f14] fixed w-full top-0 z-40 border-b border-white/10 h-[65px]">
            <button onClick={onBack} className="bg-none border-none text-white text-2xl cursor-pointer pr-4">
                <i className="fa-solid fa-arrow-left"></i>
            </button>
            <h1 className="font-bold text-lg text-white">{titulo}</h1>
        </header>
    );
};
