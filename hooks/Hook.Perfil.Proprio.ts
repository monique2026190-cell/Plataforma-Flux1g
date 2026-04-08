
import { useState, useEffect } from 'react';
import { useAuth } from '../SistemaFlux/Provedores/Provedor.Autenticacao';

export const HookPerfilProprio = () => {
    const { usuario, processando, erro } = useAuth(); 

    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!processando) {
            setIsLoading(false);
            if (erro) {
                setError(erro || 'Ocorreu um erro desconhecido');
                setProfile(null);
            } else if (usuario) {
                // Mapeia o usuário do contexto para o formato esperado pelo perfil
                const perfilCompleto = {
                    ...usuario,
                    posts: usuario.posts || [],
                    products: usuario.products || [],
                    photos: usuario.photos || [],
                    reels: usuario.reels || [],
                };
                setProfile(perfilCompleto);
            } else {
                setProfile(null);
            }
        }
    }, [usuario, processando, erro]);

    // A função refetch pode ser mantida se houver uma maneira de forçar a atualização do contexto de autenticação
    const refetch = () => {
        // A lógica de recarregamento dependerá da implementação do Provedor de Autenticação
        console.log("Recarregamento manual não implementado neste hook, depende do contexto.");
    };

    return { profile, isLoading, error, refetch };
};
