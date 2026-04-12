
import React, { useState } from 'react';
import { useGroupRevenue } from '../../hooks/Hook.Receita.Grupo';
import { useParams } from 'react-router-dom';
import { CardGrupoHistoricoFinanceiro } from '../../Componentes/ComponentesDeGroups/Componentes/ComponentesDeReceitaDoGrupo/Card.Grupo.Historico.Financeiro';
import { GraficoPizzaReceita } from '../../Componentes/ComponentesDeGroups/Componentes/ComponentesDeReceitaDoGrupo/Grafico.Pizza.Receita';
import { GraficoRadarReceita } from '../../Componentes/ComponentesDeGroups/Componentes/ComponentesDeReceitaDoGrupo/Grafico.Radar.Receita';
import { GraficoBarraReceita } from '../../Componentes/ComponentesDeGroups/Componentes/ComponentesDeReceitaDoGrupo/Grafico.Barra.Receita';
import CabecalhoNavegacao from '../../Componentes/cabeçalhos/Cabecalho.Navegacao';
import { ModalFiltroDimensao } from '../../Componentes/ComponentesDeGroups/Componentes/ComponentesDeReceitaDoGrupo/Modal.Filtro.Dimensao';

export const PGGrupoReceita: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { group, loading } = useGroupRevenue();

    const [chartType, setChartType] = useState('bar');
    const [dimension, setDimension] = useState('pais');
    const [period, setPeriod] = useState('30d');

    // --- DADOS DE EXEMPLO ---
    const revenueByCountryData = [
        { name: 'Brasil', value: 45000, salesCount: 320 },
        { name: 'EUA', value: 32000, salesCount: 150 },
        { name: 'Portugal', value: 18000, salesCount: 95 },
        { name: 'Espanha', value: 12000, salesCount: 70 },
        { name: 'Outros', value: 8000, salesCount: 50 },
    ];

    const revenueByMethodData = [
        { name: 'Cartão', value: 75000, salesCount: 410 },
        { name: 'PIX', value: 25000, salesCount: 150 },
        { name: 'Boleto', value: 10000, salesCount: 80 },
        { name: 'PayPal', value: 5000, salesCount: 45 },
    ];

    const revenueByCurrencyData = [
        { name: 'BRL', value: 60000, salesCount: 390 },
        { name: 'USD', value: 40000, salesCount: 180 },
        { name: 'EUR', value: 15000, salesCount: 115 },
    ];
    
    const revenueByProviderData = [
        { name: 'Stripe', value: 85000, salesCount: 500 },
        { name: 'PayPal', value: 25000, salesCount: 150 },
        { name: 'SyncPay', value: 5000, salesCount: 35 },
    ];

    const getChartData = () => {
        // A lógica de busca de dados precisará ser atualizada para usar o `period`
        switch (dimension) {
            case 'pais': return { data: revenueByCountryData, title: 'Receita por País' };
            case 'metodo': return { data: revenueByMethodData, title: 'Receita por Método de Pagamento' };
            case 'moeda': return { data: revenueByCurrencyData, title: 'Receita por Moeda' };
            case 'provedor': return { data: revenueByProviderData, title: 'Receita por Provedor' };
            default: return { data: revenueByCountryData, title: 'Receita por País' };
        }
    };

    const { data: chartData, title: dimensionTitle } = getChartData();

    const chartTitle = chartType === 'radar'
        ? `Radar Comparativo: ${dimensionTitle.replace('Receita por ', '')}`
        : dimensionTitle;

    const financialHistoryTransactions:any = [];

    if (loading || !group) {
        // ... (código de carregamento)
    }

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#0c0f14,_#0a0c10)] text-white font-['Inter'] flex flex-col overflow-hidden">
            <CabecalhoNavegacao titulo="Receita do Grupo" />

            <main className="pt-[85px] pb-[100px] w-full max-w-4xl mx-auto px-5 overflow-y-auto flex-grow no-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ModalFiltroDimensao 
                        onDimensionChange={setDimension}
                        currentDimension={dimension}
                        onChartTypeChange={setChartType}
                        chartType={chartType}
                        onPeriodChange={setPeriod}
                        currentPeriod={period}
                    />

                    <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {chartType === 'pie' && <GraficoPizzaReceita data={chartData} loading={loading} title={chartTitle} />}
                        {chartType === 'bar' && <GraficoBarraReceita data={chartData} loading={loading} title={chartTitle} />}
                        {chartType === 'radar' && <GraficoRadarReceita data={chartData} loading={loading} title={chartTitle} />}
                    </div>
                    
                    <CardGrupoHistoricoFinanceiro transactions={financialHistoryTransactions} loading={loading} />
                </div>
            </main>
        </div>
    );
};
