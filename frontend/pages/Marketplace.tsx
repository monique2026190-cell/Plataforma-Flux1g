
import React from 'react';
import { HookMarketplace } from '../hooks/Hook.Marketplace';
import { MarketplaceHeader } from '../Componentes/ComponentesDeMarketplace/MarketplaceHeader';
import { MarketplaceSearchBar } from '../Componentes/ComponentesDeMarketplace/MarketplaceSearchBar';
import { CategoryBar } from '../Componentes/ComponentesDeMarketplace/CategoryBar';
import { ProductsGrid } from '../Componentes/ComponentesDeMarketplace/ProductsGrid';
import { MarketplaceFAB } from '../Componentes/ComponentesDeMarketplace/MarketplaceFAB';
import { Footer } from '../Componentes/layout/Footer';

export const Marketplace: React.FC = () => {
  const {
    activeCategory,
    setActiveCategory,
    searchTerm,
    setSearchTerm,
    isMenuOpen,
    setIsMenuOpen,
    isLoading,
    filteredProducts,
    handleProductClick,
    handleShare,      // Nova função
    handleReport      // Nova função
  } = HookMarketplace();

  return (
    <div className="h-screen flex flex-col font-['Inter'] overflow-hidden bg-[radial-gradient(circle_at_top_left,_#0c0f14,_#0a0c10)] text-white">
      <MarketplaceHeader />

      <main className="flex-grow pt-[100px] pb-[100px] px-5 flex flex-col overflow-y-auto no-scrollbar">
        <MarketplaceSearchBar 
            value={searchTerm} 
            onChange={setSearchTerm} 
        />
        
        <CategoryBar 
            activeCategory={activeCategory} 
            onSelect={setActiveCategory} 
        />
        
        <ProductsGrid 
            items={filteredProducts}
            isLoading={isLoading}
            onItemClick={handleProductClick}
            onShare={handleShare} // Passando a função
            onReport={handleReport} // Passando a função
        />
      </main>

      <MarketplaceFAB isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
      <Footer />
    </div>
  );
};
