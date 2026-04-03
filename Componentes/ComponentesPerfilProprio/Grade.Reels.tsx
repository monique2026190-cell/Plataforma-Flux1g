
import React from 'react';

interface Reel {
    id: string;
    thumbnail: string;
    views?: number;
}

interface GradeDeReelsProps {
    reels?: Reel[];
}

// Componente para um único item da grade, com validação própria.
const ReelItem: React.FC<{ reel: Reel }> = ({ reel }) => {
    // Validação rigorosa: não renderiza nada se dados essenciais faltarem.
    if (!reel || !reel.id || typeof reel.thumbnail !== 'string') {
        // Log para depuração, caso um reel inválido seja passado.
        console.warn('Item de reel inválido foi filtrado:', reel);
        return null;
    }

    const handleReelClick = () => {
        console.log("Reel clicado:", reel.id);
    };
    
    // Simplificado para teste: exibe views diretamente ou 0.
    const displayViews = reel.views ? Math.floor(Number(reel.views)) : 0;

    return (
        <div
            className="relative aspect-[9/16] bg-gray-900 group cursor-pointer"
            onClick={handleReelClick}
        >
            <img
                src={reel.thumbnail}
                alt={`Reel ${reel.id}`}
                className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-80"
                loading="lazy"
                onError={(e) => (e.currentTarget.style.display = 'none')}
            />
            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <i className="fas fa-play text-white text-4xl"></i>
            </div>
            <div className="absolute bottom-1 left-2 flex items-center space-x-1 text-white text-xs font-bold bg-black bg-opacity-50 px-1.5 py-0.5 rounded">
                <i className="fas fa-play text-xs"></i>
                {/* Exibição simplificada para depuração */}
                <span>{displayViews}</span>
            </div>
        </div>
    );
};


export const GradeDeReels: React.FC<GradeDeReelsProps> = ({ reels }) => {
    // Filtra a lista de reels para garantir que é um array e que os itens são válidos.
    const validReels = Array.isArray(reels)
        ? reels.filter(reel => reel && typeof reel === 'object')
        : [];

    if (validReels.length === 0) {
        return <div className="p-4 text-center text-gray-400">Você ainda não publicou nenhum reel.</div>;
    }

    return (
        <div className="grid grid-cols-3 gap-0.5">
            {validReels.map((reel, index) => (
                // Usa o ID do reel se disponível, caso contrário, o índice como chave final de segurança.
                <ReelItem key={reel?.id || index} reel={reel as Reel} />
            ))}
        </div>
    );
};
