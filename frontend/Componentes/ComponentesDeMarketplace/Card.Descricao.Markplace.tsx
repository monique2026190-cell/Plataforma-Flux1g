
import React from 'react';

interface CardDescricaoMarketplaceProps {
  title: string;
  description: string;
}

export const CardDescricaoMarkplace: React.FC<CardDescricaoMarketplaceProps> = ({ title, description }) => {
  return (
    <div className="bg-white/5 rounded-2xl p-6 mt-8 w-full">
        <h2 className="font-bold text-lg mb-3 text-white">{title}</h2>
        <p className="text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">
            {description}
        </p>
    </div>
  );
};
