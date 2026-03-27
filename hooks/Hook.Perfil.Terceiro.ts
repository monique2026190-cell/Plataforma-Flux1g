import { useState, useEffect, useCallback } from 'react';
import { servicoAutenticacao } from '../ServiçosFrontend/ServiçoDeAutenticação/Auth.Application';
const authService = servicoAutenticacao;
import { Usuario } from '../../types/Saida/Types.Estrutura.Usuario';

export const HookPerfilTerceiro = (userId: string) => {
    const [profile, setProfile] = useState<Usuario | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProfile = useCallback(async () => {
        if (!userId) {
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        try {
            const data: Usuario = await authService.getProfile(userId);
            setProfile(data);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message || 'Erro ao carregar o perfil');
            }
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    return { profile, isLoading, error, refetch: fetchProfile };
};
