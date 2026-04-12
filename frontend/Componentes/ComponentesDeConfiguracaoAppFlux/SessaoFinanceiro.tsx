
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ItemConfiguracao } from './ItemConfiguracao';

export const SessaoFinanceiro: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="settings-group">
            <h2>Configurações Financeiras</h2>
            
            <ItemConfiguracao 
                icon="fa-wallet" 
                label="Resgatar Saldo (Financeiro)" 
                onClick={() => navigate('/financial')} 
            />

            <ItemConfiguracao 
                icon="fa-building-columns"
                label="Configurar provedor"
                onClick={() => navigate('/financial/providers')}
            />
        </div>
    );
};
