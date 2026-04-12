
import React from 'react';

interface IconeVisualizacoesProps {
    contagem: number;
}

export const IconeVisualizacoes: React.FC<IconeVisualizacoesProps> = ({ contagem }) => {
    return (
        <div className="flex items-center gap-2 text-white">
            <i className="fa-solid fa-eye text-lg"></i>
            <span className="text-sm font-bold">{contagem}</span>
        </div>
    );
};
