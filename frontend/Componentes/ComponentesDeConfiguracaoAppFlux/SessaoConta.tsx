
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ItemConfiguracao } from './ItemConfiguracao';

import { ModalDeSelecaoDeIdioma, IDIOMAS } from './ModalDeSelecaoDeIdioma';

interface SessaoContaProps {
    isPrivate: boolean;
    onTogglePrivacy: () => void;
}

export const SessaoConta: React.FC<SessaoContaProps> = ({ isPrivate, onTogglePrivacy }) => {
    const navigate = useNavigate();
    const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
    
    const [authState, setAuthState] = useState(authService.getState());
    const { user } = authState;

    useEffect(() => {
        const unsubscribe = authService.subscribe(setAuthState);
        return () => unsubscribe();
    }, []);

    const [currentLangId, setCurrentLangId] = useState(user?.language || localStorage.getItem('app_language') || 'pt');

    useEffect(() => {
        setCurrentLangId(user?.language || localStorage.getItem('app_language') || 'pt');
    }, [user]);

    const currentLangLabel = IDIOMAS.find(l => l.id === currentLangId)?.label || 'Português';

    const handleLanguageSelect = async (langId: string) => {
        // preferenceService removido. Salva no localStorage.
        console.log("preferenceService não encontrado. Salvando idioma no localStorage.");
        localStorage.setItem('app_language', langId);
        setCurrentLangId(langId);
        setIsLanguageModalOpen(false);
    };

    const renderSwitch = (checked: boolean, onChange: () => void) => (
        <label className="switch" onClick={(e) => e.stopPropagation()}>
            <input type="checkbox" checked={checked} onChange={onChange} />
            <span className="slider"></span>
        </label>
    );

    return (
        <>
            <div className="settings-group">
                <h2>Configurações de conta</h2>
                <ItemConfiguracao 
                    icon="fa-user-edit" 
                    label="Editar Perfil" 
                    onClick={() => navigate('/profile/edit')} 
                />
                <ItemConfiguracao 
                    icon="fa-lock" 
                    label="Conta Privada" 
                    onClick={onTogglePrivacy}
                    rightElement={renderSwitch(isPrivate, onTogglePrivacy)}
                />
                <ItemConfiguracao 
                    icon="fa-language" 
                    label="Idioma" 
                    onClick={() => setIsLanguageModalOpen(true)} 
                    rightElement={
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-gray-500 uppercase">{currentLangLabel}</span>
                            <i className="fas fa-chevron-right text-gray-600 text-xs"></i>
                        </div>
                    }
                />
                <ItemConfiguracao 
                    icon="fa-bell" 
                    label="Configurações de Notificação" 
                    onClick={() => navigate('/pg-configuracao-notificacao')} 
                />
            </div>

            <ModalDeSelecaoDeIdioma
                isOpen={isLanguageModalOpen}
                onClose={() => setIsLanguageModalOpen(false)}
                currentLanguage={currentLangId}
                onSelect={handleLanguageSelect}
            />
        </>
    );
};
