
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ItemConfiguracao } from './ItemConfiguracao';

export const SessaoPrivacidade: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="settings-group">
            <h2>configurações financeiras</h2>
            
            <ItemConfiguracao 
                icon="fa-wallet" 
                label="Resgatar Saldo (Financeiro)" 
                onClick={() => navigate('/financial')} 
            />
        </div>
    );
};
