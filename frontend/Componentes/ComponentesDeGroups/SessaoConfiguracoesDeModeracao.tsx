
import React from 'react';
import { ItemConfiguracao } from '../ComponentesDeConfiguracaoAppFlux/ItemConfiguracao';
import { Group } from '../../types';

const NewBadge = () => (
    <span className="bg-[#00c2ff] text-black text-[9px] font-black px-2 py-0.5 rounded-full ml-3 shadow-[0_0_10px_rgba(0,194,255,0.3)]">
        NEW
    </span>
);

interface SessaoConfiguracoesDeModeracaoProps {
    navigate: (path: string) => void;
    id: string;
    group: Group;
    isOwner: boolean;
}

export const SessaoConfiguracoesDeModeracao: React.FC<SessaoConfiguracoesDeModeracaoProps> = ({ navigate, id, group, isOwner }) => {
    return (
        <div className="settings-group">
            <h2>Moderação</h2>
            <ItemConfiguracao
                icon="fa-id-card-clip"
                label="Criação de Cargos"
                onClick={() => navigate(`/group-settings/${id}/roles`)}
                rightElement={<div className="flex items-center"><NewBadge /><i className="fas fa-chevron-right text-gray-600 text-xs ml-3"></i></div>}
            />
            <ItemConfiguracao
                icon="fa-users"
                label="Distribuição de Cargos"
                onClick={() => navigate(`/group-settings/${id}/role-distribution`)} // Updated path
            />
            <ItemConfiguracao
                icon="fa-key"
                label="Acesso e Convites"
                onClick={() => navigate(`/group-settings/${id}/access`)}
                rightElement={<div className="flex items-center"><i className="fas fa-chevron-right text-gray-600 text-xs ml-3"></i></div>}
            />
            <ItemConfiguracao
                icon="fa-shield-halved"
                label="Ações administrativas"
                onClick={() => navigate(`/group-settings/${id}/admin-actions`)} // Updated path
                rightElement={<div className="flex items-center"><i className="fas fa-chevron-right text-gray-600 text-xs ml-3"></i></div>}
            />
            <ItemConfiguracao
                icon="fa-book"
                label="Diretrizes do grupo"
                onClick={() => navigate(`/group-settings/${id}/guidelines`)}
                rightElement={<div className="flex items-center"><i className="fas fa-chevron-right text-gray-600 text-xs ml-3"></i></div>}
            />
            <ItemConfiguracao
                icon="fa-calendar-check"
                label="Mensagens Agendadas"
                onClick={() => navigate(`/group-settings/${id}/schedule`)}
                rightElement={<div className="flex items-center"><i className="fas fa-chevron-right text-gray-600 text-xs ml-3"></i></div>}
            />
            {group.isVip && isOwner && (
                <ItemConfiguracao
                    icon="fa-crown"
                    label="Funil de Vendas VIP"
                    onClick={() => navigate(`/group-settings/${id}/vip`)}
                    rightElement={<div className="flex items-center"><i className="fa-solid fa-star text-[#FFD700] text-sm"></i><i className="fas fa-chevron-right text-gray-600 text-xs ml-3"></i></div>}
                />
            )}
        </div>
    );
};
