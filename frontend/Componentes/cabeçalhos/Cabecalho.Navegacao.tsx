
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

interface CabecalhoNavegacaoProps {
    titulo: string;
    onBack?: () => void;
}

const CabecalhoNavegacao: React.FC<CabecalhoNavegacaoProps> = ({ titulo, onBack }) => {
    const navigate = useNavigate();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            navigate(-1);
        }
    };

    return (
        <header className="flex items-center p-4 bg-[#0c0f14] fixed w-full top-0 z-40 border-b border-white/10 h-[65px]">
            <button 
                onClick={handleBack} 
                className="bg-transparent border-none text-white text-2xl cursor-pointer pr-4 flex items-center justify-center"
                aria-label="Voltar"
            >
                <FaArrowLeft size={20} />
            </button>
            <h1 className="font-bold text-lg text-white">{titulo}</h1>
        </header>
    );
};

export default CabecalhoNavegacao;
