
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CabecalhoConfiguracaoInformacao } from '../../../Componentes/cabeçalhos/Cabecalho.Configuracao.Informacao';
import { CardParametrosMetaADS } from '../../../Componentes/ComponentesDeGroups/Componentes/ComponentesDeConfiguracoes/Card.MetaADS.Parametros';
import { CardMetaADSEventos } from '../../../Componentes/ComponentesDeGroups/Componentes/ComponentesDeConfiguracoes/Card.MetaADS.Eventos';
import { CardPixelsConectados } from '../../../Componentes/ComponentesDeGroups/Componentes/ComponentesDeConfiguracoes/Card.Pixels.Conectados';

export const PGGrupoConfiguracoesPlataformasADS: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#0c0f14,_#0a0c10)] text-white font-['Inter'] flex flex-col">
            <CabecalhoConfiguracaoInformacao titulo="Plataformas ADS" onBack={() => navigate(-1)} />

            <main className="pt-[85px] pb-[40px] w-full max-w-2xl mx-auto px-5 overflow-y-auto flex-grow no-scrollbar">
                {/* O novo card para gerenciar todos os pixels */}
                <CardPixelsConectados />

                {/* Cards de configuração do Meta ADS, sempre visíveis para facilitar */}
                <CardParametrosMetaADS />
                <CardMetaADSEventos />
            </main>
        </div>
    );
};
