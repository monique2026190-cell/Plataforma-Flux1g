
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getInstanciaSuprema } from '../ServiçosFrontend/ServiçoDeAutenticação/Sistema.Autenticacao.Supremo';
const authService = getInstanciaSuprema();
import { feedPublicationService } from '../ServiçosFrontend/ServiçosDePublicações/Servico.Publicacao.Feed';
import { PublicacaoFeed } from '../types/Saida/Types.Estrutura.Publicacao.Feed';

const POSTS_PER_PAGE = 10;

export const HookFeed = (initialCategory: string = 'all') => {
  const [allPosts, setAllPosts] = useState<PublicacaoFeed[]>([]);
  const [displayedPosts, setDisplayedPosts] = useState<PublicacaoFeed[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState(initialCategory);
  const observer = useRef<IntersectionObserver | null>(null);
  const navigate = useNavigate();

  // UI State & Refs
  const [uiVisible, setUiVisible] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeLocationFilter, setActiveLocationFilter] = useState('Global');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const lastScrollTop = useRef(0);

  const [authState, setAuthState] = useState(authService.getState());
  const currentUserId = authState.user?.id;

  useEffect(() => {
    const unsubscribe = authService.subscribe(setAuthState);
    return () => unsubscribe();
  }, []);

  const handleContainerScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const currentScrollTop = container.scrollTop;
      setUiVisible(currentScrollTop <= lastScrollTop.current || currentScrollTop < 100);
      lastScrollTop.current = currentScrollTop <= 0 ? 0 : currentScrollTop;
    }
  };

  // Busca inicial de todos os posts
  useEffect(() => {
    if (!currentUserId) return;

    const fetchAllPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedPosts = await feedPublicationService.getPosts();
        setAllPosts(fetchedPosts);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
          if (err.message.includes('Token inválido')) {
            authService.logout();
            navigate('/login');
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAllPosts();
  }, [currentUserId, navigate]);

  // Lógica de filtragem e paginação no cliente
  useEffect(() => {
    const filtered = category === 'all' 
      ? allPosts 
      : allPosts.filter(p => p.tipo === category); // Supondo que a categoria corresponde ao 'tipo' do post

    const newDisplayedPosts = filtered.slice(0, page * POSTS_PER_PAGE);
    setDisplayedPosts(newDisplayedPosts);

  }, [allPosts, category, page]);

  // Observador para rolagem infinita
  const lastPostElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    const hasMore = displayedPosts.length < (category === 'all' ? allPosts.length : allPosts.filter(p => p.tipo === category).length);

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, displayedPosts.length, allPosts, category]);

  // Reseta a página ao mudar de categoria
  useEffect(() => {
      setPage(1);
  }, [category]);

  // Handlers
  const handlePostLike = (id: string) => console.log('Like no post:', id);
  const handlePostDelete = (id: string) => {
      console.log('Deletar post:', id);
      setAllPosts(prev => prev.filter(p => p.id !== id));
  };
  const handlePostVote = (postId: string, index: number) => console.log('Voto no post:', postId, 'opção:', index);
  const handlePostShare = (post: PublicacaoFeed) => console.log('Compartilhar post:', post);
  const handleCtaClick = () => console.log('CTA clicado');

  return {
    posts: displayedPosts, // Expor os posts filtrados e paginados
    loading,
    error,
    hasMore: displayedPosts.length < (category === 'all' ? allPosts.length : allPosts.filter(p => p.tipo === category).length),
    lastPostElementRef,
    setCategory,
    scrollContainerRef,
    currentUserId,
    uiVisible,
    activeLocationFilter,
    isMenuOpen,
    setIsMenuOpen,
    handleContainerScroll,
    handlePostLike,
    handlePostDelete,
    handlePostVote,
    handlePostShare,
    handleCtaClick,
    navigate,
  };
};
