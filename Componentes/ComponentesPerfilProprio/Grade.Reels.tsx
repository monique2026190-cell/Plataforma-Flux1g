
import React from 'react';

interface Reel {
    id: string;
    thumbnail: string;
    views?: number;
}

interface GradeDeReelsProps {
    reels?: Reel[];
}

export const GradeDeReels: React.FC<GradeDeReelsProps> = ({ reels = [] }) => {
    const handleReelClick = (reel: Reel) => {
        console.log("Reel clicado:", reel.id);
    };

    const formatViews = (num: any): string => {
        if (typeof num !== 'number' || isNaN(num)) {
            return '0';
        }
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return String(num);
    };

    const validReels = reels ? reels.filter((reel): reel is Reel => reel && typeof reel === 'object') : [];

    if (validReels.length === 0) {
        return <div className="p-4 text-center text-gray-400">Você ainda não publicou nenhum reel.</div>;
    }

    return (
        <div className="grid grid-cols-3 gap-0.5">
            {validReels.map((reel: Reel) => (
                <div 
                    key={reel.id}
                    className="relative aspect-[9/16] bg-gray-900 group cursor-pointer"
                    onClick={() => handleReelClick(reel)}
                >
                    <img 
                        src={reel.thumbnail} 
                        alt={`Reel ${reel.id}`}
                        className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-80"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <i className="fas fa-play text-white text-4xl"></i>
                    </div>
                    <div className="absolute bottom-1 left-2 flex items-center space-x-1 text-white text-xs font-bold bg-black bg-opacity-50 px-1.5 py-0.5 rounded">
                        <i className="fas fa-play text-xs"></i>
                        <span>{formatViews(reel.views)}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};
