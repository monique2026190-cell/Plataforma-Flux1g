
import React from 'react';

interface TituloPrecoProps {
  name: string;
  price: string;
}

export const CardMarketplaceTituloPreco: React.FC<TituloPrecoProps> = ({ name, price }) => {
  return (
    <>
      <h1 className="text-2xl lg:text-3xl font-bold text-white/90 leading-tight mb-2">{name}</h1>
      <div className="text-5xl lg:text-6xl font-black tracking-tighter bg-gradient-to-br from-[#00c2ff] to-[#00a1ff] bg-clip-text text-transparent">
        {price}
      </div>
    </>
  );
};
