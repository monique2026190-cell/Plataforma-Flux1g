
import React from 'react';
import { ItemConfiguracao } from '../ComponentesDeConfiguracaoAppFlux/ItemConfiguracao';

interface SessaoConfiguracoesDeDiretrizesDoGrupoProps {
    navigate: (path: string) => void;
    id: string;
}

export const SessaoConfiguracoesDeDiretrizesDoGrupo: React.FC<SessaoConfiguracoesDeDiretrizesDoGrupoProps> = ({ navigate, id }) => {
    return (
        <div className="settings-group">
            <h2>Diretrizes</h2>
            <ItemConfiguracao
                icon="fa-file-alt"
                label="Diretrizes do Grupo"
                onClick={() => navigate(`/group-settings/${id}/guidelines`)}
            />
        </div>
    );
};
