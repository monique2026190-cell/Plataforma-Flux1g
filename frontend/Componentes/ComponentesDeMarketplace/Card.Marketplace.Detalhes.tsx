
import React from 'react';
import { CardMarketplaceTituloPreco } from './Card.Marketplace.TituloPreco';
import { CardMarketplaceAcoes } from './Card.Marketplace.Acoes';

interface SellerInfo {
  name: string;
  avatar: string;
  rating: number;
  reviews: number;
}

interface ProductInfoProps {
  name: string;
  seller: SellerInfo;
  price: string;
  onConverse: () => void;
}

export const CardMarketplaceDetalhes: React.FC<ProductInfoProps> = ({ name, seller, price, onConverse }) => {
  return (
    <div className="md:w-1/2 flex flex-col justify-center">
      <CardMarketplaceTituloPreco name={name} price={price} />
      <CardMarketplaceAcoes seller={seller} onConverse={onConverse} />
    </div>
  );
};
