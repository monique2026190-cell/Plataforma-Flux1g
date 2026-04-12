
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { feedPublicationService } from '../ServiçosFrontend/ServiçosDePublicações/Servico.Publicacao.Feed';

import { PublicacaoFeed } from '../types/Saida/Types.Estrutura.Publicacao.Feed';
import { Autor } from '../types/Saida/Types.Estrutura.Autor';

export type FeedSearchFilter = 'relevant' | 'recent';
export type SearchTab = 'posts' | 'users';

export const HookPesquisaFeed = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<SearchTab>('posts');
    const [filter, setFilter] = useState<FeedSearchFilter>('relevant');
    
    const [postResults, setPostResults] = useState<PublicacaoFeed[]>([]);
    const [userResults, setUserResults] = useState<Autor[]>([]);
    const [loading, setLoading] = useState(false);
    
    const currentUser = authService.getState().user;

    const handleSearch = useCallback(async (query: string, tab: SearchTab) => {
        if (!query.trim()) {
            setPostResults([]);
            setUserResults([]);
            return;
        }
        
        setLoading(true);
        try {
            if (tab === 'posts') {
                const data = await feedPublicationService.search(query);
                setPostResults(data);
            } else {
                // Busca de usuários desabilitada temporariamente
                setUserResults([]);
            }
        } catch (e) {
            console.error("Search error", e);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => handleSearch(searchTerm, activeTab), 400);
        return () => clearTimeout(timeout);
    }, [searchTerm, activeTab, handleSearch]);

    const sortedPosts = useMemo(() => {
        const list = [...postResults];
        if (filter === 'recent') {
            return list.sort((a, b) => new Date(b.dataCriacao).getTime() - new Date(a.dataCriacao).getTime());
        }
        // Lógica de relevância adaptada para a nova estrutura PublicacaoFeed
        return list.sort((a, b) => {
            const scoreA = (a.curtidas?.length || 0) + (a.comentarios?.length || 0) * 2;
            const scoreB = (b.curtidas?.length || 0) + (b.comentarios?.length || 0) * 2;
            return scoreB - scoreA;
        });
    }, [postResults, filter]);

    const handleBack = () => {
        if (window.history.state && window.history.state.idx > 0) {
            navigate(-1);
        } else {
            navigate('/feed');
        }
    };

    return {
        searchTerm,
        setSearchTerm,
        activeTab,
        setActiveTab,
        filter,
        setFilter,
        postResults: sortedPosts,
        userResults,
        loading,
        currentUser,
        handleBack,
    };
};
