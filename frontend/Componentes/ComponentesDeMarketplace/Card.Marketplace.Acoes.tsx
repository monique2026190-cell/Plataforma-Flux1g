
import React from 'react';

interface SellerInfo {
  name: string;
  avatar: string;
  rating: number;
  reviews: number;
}

interface AcoesProps {
  seller: SellerInfo;
  onConverse: () => void;
}

export const CardMarketplaceAcoes: React.FC<AcoesProps> = ({ seller, onConverse }) => {
  return (
    <>
      <div className="bg-white/5 rounded-lg p-3 my-6">
        <div className="flex items-center justify-between text-sm">
            <div className='flex items-center gap-3'>
              <img src={seller.avatar} alt={seller.name} className="w-9 h-9 rounded-full" />
              <div>
                  <p className="font-bold text-white">{seller.name}</p>
                  <p className='text-gray-400 text-xs'>Vendedor Verificado</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1.5 font-bold text-white">
                  <i className="fa-solid fa-star text-yellow-400"></i>
                  <span>{seller.rating}</span>
              </div>
              <p className='text-gray-400 text-xs'>{seller.reviews} avaliações</p>
            </div>
        </div>
      </div>
      
      <div className="flex flex-col gap-3">
           <button onClick={onConverse} className="w-full bg-gradient-to-r from-[#00c2ff] to-[#00a1ff] text-black font-extrabold py-4 rounded-lg text-base hover:opacity-90 transition-all transform hover:scale-[1.02]">Conversar</button>
      </div>
    </>
  );
};
