
import { useState, useEffect, useCallback } from 'react';
import { servicoAutenticacao } from '../ServiçosFrontend/ServiçoDeAutenticação/Auth.Application';
const authService = servicoAutenticacao;

export const HookConfiguracoes = () => {
    const [isPrivate, setIsPrivate] = useState(false);
    const [isAdultContent, setIsAdultContent] = useState(() => localStorage.getItem('settings_18_plus') === 'true');
    
    const [authState, setAuthState] = useState(authService.getState());
    const { user } = authState;

    useEffect(() => {
        const unsubscribe = authService.subscribe(setAuthState);
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        if (user?.profile) {
            setIsPrivate(user.profile.isPrivate);
        }
    }, [user]);

    const togglePrivacy = useCallback(async () => {
        const newState = !isPrivate;
        setIsPrivate(newState);
        if (user && user.email && user.profile) {
            try {
                await authService.completeProfile(user.email, { ...user.profile, isPrivate: newState });
                return newState;
            } catch (e) {
                console.error(e);
                setIsPrivate(!newState);
                return !newState;
            }
        }
        return isPrivate;
    }, [isPrivate, user]);

    const toggleAdultContent = useCallback(() => {
        const newState = !isAdultContent;
        setIsAdultContent(newState);
        localStorage.setItem('settings_18_plus', String(newState));
    }, [isAdultContent]);

    const logout = () => {
        authService.logout();
    };

    return {
        isPrivate,
        isAdultContent,
        togglePrivacy,
        toggleAdultContent,
        logout
    };
};
