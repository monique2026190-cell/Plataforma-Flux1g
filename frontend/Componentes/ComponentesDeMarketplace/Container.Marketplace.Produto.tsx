
import React, { useState } from 'react';
import { MarketplaceItem, Product } from '../../types';

// Props para o Card Normal
export interface ProductCardProps {
    product: MarketplaceItem;
    onClick: (item: MarketplaceItem) => void;
    onShare?: (item: MarketplaceItem) => void;
    onReport?: (itemId: string) => void;
}

// Props para o Container Promocional
export interface PromotionalContainerProps {
    product: Product; // Usando Product aqui para ter a estrutura aninhada
    onProductClick: (product: Product) => void;
}

// --- COMPONENTE DO CONTAINER PROMOCIONAL ---
export const PromotionalContainer: React.FC<PromotionalContainerProps> = ({ product, onProductClick }) => {
    const containerStyle = {
        backgroundColor: product.backgroundColor || '#1a1e26',
        color: product.textColor || '#ffffff',
    };

    const InnerCard: React.FC<{item: Product}> = ({item}) => (
        <div 
            className="bg-black/20 rounded-lg overflow-hidden cursor-pointer group" 
            onClick={() => onProductClick(item)}
        >
            <div className="aspect-square overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
            </div>
            <div className="p-2">
                <h5 className="text-xs font-bold truncate">{item.title}</h5>
                <p className="text-[10px] text-green-400 font-semibold">R$ {item.price.toFixed(2)}</p>
            </div>
        </div>
    );

    return (
        <div className="col-span-2 rounded-lg p-4" style={containerStyle}>
            <h2 className="text-lg font-black mb-1">{product.title}</h2>
            <p className="text-xs opacity-80 mb-4">{product.description}</p>
            <div className="grid grid-cols-3 gap-3">
                {product.items?.slice(0, 3).map(item => (
                   <InnerCard key={item.id} item={item} />
                ))}
            </div>
        </div>
    );
};


// --- COMPONENTE DO CARD DE PRODUTO PADRÃO ---
export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick, onShare, onReport }) => {
    const [showMenu, setShowMenu] = useState(false);
    
    const CTA_ICONS: Record<string, string> = {
        'conferir': 'fa-eye',
        'participar': 'fa-user-group',
        'comprar': 'fa-cart-shopping',
        'assinar': 'fa-credit-card',
        'entrar': 'fa-arrow-right-to-bracket',
        'descubra': 'fa-compass',
        'baixar': 'fa-download',
        'saiba mais': 'fa-circle-info',
        'ver': 'fa-eye'
    };

    const getPriceText = (prod: MarketplaceItem) => {
        if (prod.price && prod.price > 0) {
            return `R$ ${prod.price.toFixed(2).replace('.', ',')}`;
        }
        return 'Grátis';
    };
    
    const getButtonContent = (prod: MarketplaceItem) => {
        const text = prod.ctaText || 'Ver';
        const icon = CTA_ICONS[text.toLowerCase()] || 'fa-arrow-right';
        return { text, icon };
    };

    const btn = getButtonContent(product);

    const handleMenuClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowMenu(prev => !prev);
    };

    const handleShareClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onShare?.(product);
        setShowMenu(false);
    };

    const handleReportClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onReport?.(product.id);
        setShowMenu(false);
    };
    
    const cardStyles = `
    .product-card {
        background-color: #1a1e26;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        transition: all 0.2s ease-in-out;
        cursor: pointer;
        position: relative;
        border: 1px solid #2a2e37;
    }
    .product-card:hover { transform: translateY(-4px); box-shadow: 0 8px 16px rgba(0,0,0,0.3); }
    .product-card.sponsored { border-color: #00c2ff; }
    .product-img-container { width: 100%; aspect-ratio: 1/1; overflow: hidden; position: relative; }
    .product-img-container img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease; }
    .product-card:hover .product-img-container img { transform: scale(1.05); }
    .ad-badge { position: absolute; top: 8px; right: 8px; background: #00c2ff; color: #000; padding: 2px 6px; font-size: 9px; font-weight: 800; border-radius: 4px; }
    .product-header { display: flex; justify-content: space-between; align-items: flex-start; padding: 8px; }
    .product-info h4 { font-size: 13px; font-weight: 700; color: #fff; margin: 0; line-height: 1.3; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .product-price { font-size: 14px; font-weight: 800; color: #28a745; margin-top: 2px; }
    .menu-button { background: none; border: none; color: #777; font-size: 14px; cursor: pointer; padding: 4px; }
    .menu-overlay { position: fixed; inset: 0; background: transparent; z-index: 40; }
    .menu-dropdown { position: absolute; top: 100%; right: 0; background: #2a2e37; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.5); z-index: 50; overflow: hidden; min-width: 150px; }
    .menu-dropdown button { display: block; width: 100%; text-align: left; padding: 10px 12px; background: none; border: none; color: #fff; font-size: 12px; }
    .menu-dropdown button:hover { background: #3a3e47; }
    .menu-dropdown button.danger { color: #ff4d4d; }
    .menu-dropdown i { margin-right: 8px; width: 14px; text-align: center; }
    .product-sales, .product-location { font-size: 11px; color: #888; padding: 0 8px; margin-bottom: 4px; display: flex; align-items: center; gap: 4px; }
    .product-actions { padding: 8px; }
    .product-actions button { background-color: #00c2ff; color: #000; border: none; width: 100%; padding: 10px; border-radius: 8px; font-weight: 800; font-size: 12px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; }
    .product-actions button:hover { background-color: #33d5ff; }
    `;

    return (
        <div className={`product-card ${product.isAd ? 'sponsored' : ''}`} onClick={() => !showMenu && onClick(product)}>
            <style>{cardStyles}</style>

            <div className="product-img-container">
                {product.isAd && <div className="ad-badge">Destaque</div>}
                <img src={product.image || 'https://via.placeholder.com/300?text=Sem+Imagem'} alt={product.title} loading="lazy" />
            </div>

            <div className="product-header">
                <div className="product-info">
                    <h4>{product.title}</h4>
                    <div className="product-price">{getPriceText(product)}</div>
                </div>
                <div className="relative">
                    <button onClick={handleMenuClick} className="menu-button">
                        <i className="fa-solid fa-ellipsis"></i>
                    </button>
                    {showMenu && (
                        <>
                            <div className="menu-overlay" onClick={(e) => { e.stopPropagation(); setShowMenu(false); }}></div>
                            <div className="menu-dropdown">
                                {onShare && <button onClick={handleShareClick}><i className="fa-solid fa-share"></i> Compartilhar</button>}
                                {onReport && <button onClick={handleReportClick} className="danger"><i className="fa-solid fa-flag"></i> Denunciar</button>}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {product.soldCount !== undefined && <div className="product-sales">{Number(product.soldCount || 0)} vendidos</div>}
            <div className="product-location"><i className="fa-solid fa-location-dot"></i> {product.location}</div>
            
            <div className="product-actions" onClick={(e) => e.stopPropagation()}>
                <button onClick={() => onClick(product)}>
                    <i className={`fa-solid ${btn.icon}`}></i>
                    {btn.text}
                </button>
            </div>
        </div>
    );
};
