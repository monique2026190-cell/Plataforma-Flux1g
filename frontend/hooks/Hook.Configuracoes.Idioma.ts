
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


export const LANGUAGES = [
    { id: 'pt', label: 'Português', flag: '🇧🇷', nativeName: 'Brasil' },
    { id: 'en', label: 'English', flag: '🇺🇸', nativeName: 'United States' },
    { id: 'es', label: 'Español', flag: '🇪🇸', nativeName: 'España' }
];

export const HookConfiguracoesIdioma = () => {
    const navigate = useNavigate();

    // --- Gerenciamento de Estado de Autenticação Reativo ---
    const [authState, setAuthState] = useState(authService.getState());
    const { user } = authState;

    useEffect(() => {
        const unsubscribe = authService.subscribe(setAuthState);
        return () => unsubscribe();
    }, []);
    
    // O estado do idioma atual, inicializado com o valor do usuário ou localStorage
    const [currentLangId, setCurrentLangId] = useState(() => {
        return user?.language || localStorage.getItem('app_language') || 'pt';
    });
    
    // Atualiza o idioma se o usuário mudar (ex: login/logout)
    useEffect(() => {
        const lang = user?.language || localStorage.getItem('app_language') || 'pt';
        setCurrentLangId(lang);
    }, [user]);

    const handleLanguageSelect = async (langId: string) => {
        // O preferenceService foi removido. A alteração será salva apenas localmente.
        try {
            console.log("preferenceService não encontrado. Salvando idioma no localStorage.");
            localStorage.setItem('app_language', langId);
            setCurrentLangId(langId);
            // Em um app real, aqui você iria recarregar as traduções com i18next
            navigate(-1);
        } catch (error) {
            console.error("Falha ao atualizar o idioma localmente:", error);
        }
    };

    const handleBack = () => {
        if (window.history.state && window.history.state.idx > 0) {
            navigate(-1);
        } else {
            navigate('/settings');
        }
    };

    return {
        currentLangId,
        handleLanguageSelect,
        handleBack,
        languages: LANGUAGES
    };
};
