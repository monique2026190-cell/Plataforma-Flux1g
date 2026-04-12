
import React from 'react';
import { ItemConfiguracao } from '../ComponentesDeConfiguracaoAppFlux/ItemConfiguracao';

interface SessaoConfiguracoesDeAuditoriaProps {
    navigate: (path: string) => void;
    id: string;
}

export const SessaoConfiguracoesDeAuditoria: React.FC<SessaoConfiguracoesDeAuditoriaProps> = ({ navigate, id }) => {
    return (
        <div className="settings-group">
            <h2>Configurações de Auditoria</h2>
            <ItemConfiguracao
                icon="fa-comment-dots"
                label="Auditoria de mensagens"
                onClick={() => navigate(`/group-settings/${id}/message-audit`)}
                rightElement={<div className="flex items-center"><i className="fas fa-chevron-right text-gray-600 text-xs ml-3"></i></div>}
            />
            <ItemConfiguracao
                icon="fa-right-from-bracket"
                label="Auditoria de entrada e saída"
                onClick={() => navigate(`/group-settings/${id}/entry-exit-audit`)}
                rightElement={<div className="flex items-center"><i className="fas fa-chevron-right text-gray-600 text-xs ml-3"></i></div>}
            />
            <ItemConfiguracao
                icon="fa-flag"
                label="Auditoria de denúncias"
                onClick={() => navigate(`/group-settings/${id}/report-audit`)}
                rightElement={<div className="flex items-center"><i className="fas fa-chevron-right text-gray-600 text-xs ml-3"></i></div>}
            />
            <ItemConfiguracao
                icon="fa-sliders"
                label="Auditoria de ajustes"
                onClick={() => navigate(`/group-settings/${id}/settings-audit`)} // Updated path
                rightElement={<div className="flex items-center"><i className="fas fa-chevron-right text-gray-600 text-xs ml-3"></i></div>}
            />
        </div>
    );
};
