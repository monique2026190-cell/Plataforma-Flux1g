
import { useState, useEffect, useCallback } from 'react';
import { servicoAutenticacao } from '../ServiçosFrontend/ServiçoDeAutenticação/Auth.Application';
const authService = servicoAutenticacao;
import { feedPublicationService } from '../ServiçosFrontend/ServiçosDePublicações/Servico.Publicacao.Feed';
import { marketplacePublicationService } from '../ServiçosFrontend/ServiçosDePublicações/Servico.Publicacao.Marketplace';
import { Usuario } from '../../types/Saida/Types.Estrutura.Usuario';
import { PublicacaoFeed } from '../../types/Saida/Types.Estrutura.Publicacao.Feed';
import { PublicacaoMarketplace } from '../../types/Saida/Types.Estrutura.Publicacao.Marketplace';

// Estendendo o tipo de Usuário para incluir posts e produtos.
type PerfilCompleto = Usuario & {
    posts: PublicacaoFeed[];
    products: PublicacaoMarketplace[];
};

export const HookPerfilProprio = () => {
    const [profile, setProfile] = useState<PerfilCompleto | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Se inscreve no estado de autenticação
    const [authState, setAuthState] = useState(authService.getState());
    const isAuthenticated = !!authState.user;

    useEffect(() => {
        const unsubscribe = authService.subscribe(setAuthState);
        return () => unsubscribe();
    }, []);

    const fetchProfileData = useCallback(async () => {
        // Não faz nada se não estiver autenticado ou se já estiver carregando
        if (!isAuthenticated || !authState.user?.id) {
            setIsLoading(false);
            setProfile(null);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const userId = authState.user.id;
            const userData = authState.user; // Usando o usuário do estado de autenticação

            // Busca posts e produtos em paralelo
            const [allPosts, allProducts] = await Promise.all([
                feedPublicationService.getPosts(),
                marketplacePublicationService.getProducts()
            ]);

            // Filtra as publicações para o usuário atual
            const userPosts = allPosts.filter(post => post.autorId === userId);
            const userProducts = allProducts.filter(product => product.usuarioId === userId);

            // Combina os dados do usuário com suas publicações
            const perfilCompleto: PerfilCompleto = {
                ...userData,
                posts: userPosts,
                products: userProducts,
            };

            setProfile(perfilCompleto);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Ocorreu um erro desconhecido';
            setError(errorMessage);
            console.error("Erro ao buscar dados do perfil:", errorMessage);
            setProfile(null);
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated, authState.user]); // Depende do usuário do authState

    // Lógica para buscar o perfil quando o estado de autenticação muda
    useEffect(() => {
        fetchProfileData();
    }, [fetchProfileData]);

    // Retorna o estado do perfil e uma função para recarregar
    return { profile, isLoading, error, refetch: fetchProfileData };
};
