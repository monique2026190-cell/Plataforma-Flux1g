
import React from 'react';
import { ItemConfiguracao } from '../ComponentesDeConfiguracaoAppFlux/ItemConfiguracao';

const NewBadge = () => (
    <span className="bg-[#00c2ff] text-black text-[9px] font-black px-2 py-0.5 rounded-full ml-3 shadow-[0_0_10px_rgba(0,194,255,0.3)]">
        NEW
    </span>
);

interface SessaoConfiguracoesDeMarketingProps {
    navigate: (path: string) => void;
    id: string;
}

export const SessaoConfiguracoesDeMarketing: React.FC<SessaoConfiguracoesDeMarketingProps> = ({ navigate, id }) => {
    return (
        <div className="settings-group">
            <h2>Configurações de Marketing</h2>
            <ItemConfiguracao
                icon="fa-store"
                label="Editar Página de vendas"
                onClick={() => navigate(`/group-settings/${id}/edit-sales-page`)}
                rightElement={<div className="flex items-center"><NewBadge /><i className="fas fa-chevron-right text-gray-600 text-xs ml-3"></i></div>}
            />
            <ItemConfiguracao
                icon="fa-rectangle-ad"
                label="Plataformas ADS"
                onClick={() => navigate(`/group-settings/${id}/ads-platforms`)} // Updated path
                rightElement={<div className="flex items-center"><NewBadge /><i className="fas fa-chevron-right text-gray-600 text-xs ml-3"></i></div>}
            />
            <ItemConfiguracao
                icon="fa-chart-pie"
                label="Faturamento Detalhado"
                onClick={() => navigate(`/group/${id}/revenue`)}
            />
        </div>
    );
};
