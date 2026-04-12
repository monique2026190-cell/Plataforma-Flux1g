
import React from 'react';
import { FaSearch } from 'react-icons/fa';

interface CardContainerPesquisaProps {
    placeholder: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CardContainerPesquisa: React.FC<CardContainerPesquisaProps> = ({ placeholder, onChange }) => {
    return (
        <div className="relative flex-grow">
            <FaSearch className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400" />
            <input
                type="text"
                placeholder={placeholder}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                onChange={onChange}
            />
        </div>
    );
};

export default CardContainerPesquisa;
