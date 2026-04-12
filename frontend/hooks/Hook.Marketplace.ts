
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { marketplacePublicationService } from '../ServiçosFrontend/ServiçosDePublicações/Servico.Publicacao.Marketplace';
import { PublicacaoMarketplace } from '../types/Saida/Types.Estrutura.Publicacao.Marketplace';

export const HookMarketplace = () => {
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState('Todos');
    const [searchTerm, setSearchTerm] = useState('');
    const [allItems, setAllItems] = useState<PublicacaoMarketplace[]>([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMarketplaceItems = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const items = await marketplacePublicationService.getProducts();
            setAllItems(items || []);
        } catch (err) {
            console.error("Erro ao carregar itens do marketplace:", err);
            setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido.');
            setAllItems([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMarketplaceItems();
    }, [fetchMarketplaceItems]);

    const filteredProducts = useMemo(() => {
        if (!Array.isArray(allItems)) return [];
        let result = [...allItems];
        
        if (activeCategory !== 'Todos') {
            result = result.filter(p => p && p.category === activeCategory);
        }
        
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            result = result.filter(p => p && (
                (p.title && p.title.toLowerCase().includes(term)) || 
                (p.location && p.location.toLowerCase().includes(term))
            ));
        }
        return result;
    }, [allItems, activeCategory, searchTerm]);

    const handleProductClick = (item: PublicacaoMarketplace) => {
        if (!item) return;
        navigate(`/marketplace/product/${item.id}`); 
    };

    return {
        activeCategory,
        setActiveCategory,
        searchTerm,
        setSearchTerm,
        isMenuOpen,
        setIsMenuOpen,
        isLoading,
        error,
        filteredProducts,
        handleProductClick
    };
};
