import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { feedPublicationService } from '../ServiçosFrontend/ServiçosDePublicações/Servico.Publicacao.Feed';
import { getInstanciaSuprema } from '../ServiçosFrontend/ServiçoDeAutenticação/Sistema.Autenticacao.Supremo';
const authService = getInstanciaSuprema();
import { PublicacaoFeed } from '../types/Saida/Types.Estrutura.Publicacao.Feed';

export const HookCampanhaSeletor = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'posts' | 'reels'>('posts');
    const [content, setContent] = useState<PublicacaoFeed[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadContent = async () => {
            setLoading(true);
            const user = authService.getCurrentUser();
            if (user && user.id) {
                try {
                    const allPosts = await feedPublicationService.getPosts();
                    // Filtra os posts para pegar apenas os do usuário logado.
                    const userPosts = allPosts.filter(post => post.autor.id === user.id);
                    setContent(userPosts);
                } catch (error) {
                    console.error("Erro ao buscar conteúdo do usuário:", error);
                    // Lidar com o erro apropriadamente
                }
            }
            setLoading(false);
        };
        loadContent();
    }, []);

    const filteredContent = content.filter(p => {
        const hasVideo = p.midia?.some(m => m.tipo.startsWith('video'));
        const hasImage = p.midia?.some(m => m.tipo.startsWith('image'));

        if (activeTab === 'reels') {
            return hasVideo;
        }
        // Aba 'posts' pode incluir texto, imagens, mas não vídeos (reels)
        return !hasVideo && (p.conteudo || hasImage);
    });

    const handleSelect = (post: PublicacaoFeed) => {
        navigate('/ad-placement-selector', { state: { boostedContent: post } });
    };

    return {
        activeTab,
        setActiveTab,
        loading,
        filteredContent,
        handleSelect,
        navigate
    };
};