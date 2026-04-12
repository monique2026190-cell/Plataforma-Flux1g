
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CabecalhoConfiguracaoInformacao } from '../../../Componentes/cabeçalhos/Cabecalho.Configuracao.Informacao';
import { CardEdicaoPaginaVendas } from '../../../Componentes/ComponentesDeGroups/Componentes/ComponentesDeConfiguracoes/Card.Edicao.Pagina.Vendas';

export const PGEditarPaginasVendas: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#0c0f14,_#0a0c10)] text-white font-['Inter'] flex flex-col">
            <CabecalhoConfiguracaoInformacao titulo="Editar Página de Vendas" onBack={() => navigate(-1)} />

            <main className="pt-[85px] pb-[40px] w-full max-w-3xl mx-auto px-5 overflow-y-auto flex-grow no-scrollbar">
                {/* O card de edição agora ocupa o espaço central, proporcionando uma experiência focada */}
                <CardEdicaoPaginaVendas />
            </main>
        </div>
    );
};
