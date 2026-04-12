
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ItemConfiguracao } from './ItemConfiguracao';

// A interface de props não é mais necessária, pois o componente não recebe mais props.

export const SessaoSegurancaEPrivacidade: React.FC = () => {
    const navigate = useNavigate();

    // O card de conteúdo +18 foi removido daqui.

    return (
        <div className="settings-group">
            <h2>Configurações de segurança e privacidade</h2>
            
            <ItemConfiguracao 
                icon="fa-shield-alt" 
                label="Segurança e Login" 
                onClick={() => navigate('/pg-configuracao-seguranca-e-login')} 
            />

            <ItemConfiguracao 
                icon="fa-user-slash" 
                label="Gerenciar Bloqueios" 
                onClick={() => navigate('/pg-configuracao-gestao-de-bloqueios')} 
            />

            <ItemConfiguracao 
                icon="fa-file-alt" 
                label="Termos e Privacidade" 
                onClick={() => navigate('/terms')} 
            />

            <ItemConfiguracao 
                icon="fa-headset" 
                label="Ajuda e Suporte" 
                onClick={() => navigate('/help')} 
            />
        </div>
    );
};
