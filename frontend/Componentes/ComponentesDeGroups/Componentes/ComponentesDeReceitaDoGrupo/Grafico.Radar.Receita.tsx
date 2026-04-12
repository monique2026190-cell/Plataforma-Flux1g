
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface ChartData {
    name: string;
    value: number;
    salesCount?: number;
}

interface GraficoRadarReceitaProps {
    data?: ChartData[];
    loading: boolean;
    title: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#EC7063'];

const formatAsCurrency = (value: number) => {
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const GraficoRadarReceita: React.FC<GraficoRadarReceitaProps> = ({ data = [], loading, title }) => {

    if (loading) {
        // ... loading state
    }

    if (data.length === 0) {
        // ... empty state
    }

    const totalValue = data.reduce((acc, entry) => acc + entry.value, 0);
    const maxRevenue = Math.max(...data.map(item => item.value));

    const processedData = data.map(item => ({
        ...item,
        normalizedValue: maxRevenue > 0 ? (item.value / maxRevenue) * 100 : 0,
    }));

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 col-span-1 md:col-span-3 shadow-lg">
            <h3 className="font-bold text-lg text-white/90 mb-4">{title}</h3>
            <ResponsiveContainer width="100%" height={250}>
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={processedData}>
                    <PolarGrid stroke="rgba(255, 255, 255, 0.2)" />
                    <PolarAngleAxis dataKey="name" tick={{ fill: '#fff', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Tooltip
                        cursor={{ stroke: '#00c2ff', strokeWidth: 1, fill: 'transparent' }}
                        contentStyle={{
                            background: 'rgba(20, 24, 30, 0.8)',
                            borderColor: 'rgba(255, 255, 255, 0.2)',
                            color: '#fff'
                        }}
                         formatter={(value: number, name: string, props) => {
                            // O tooltip agora é simples, pois a legenda tem os detalhes
                            const originalValue = props.payload.value;
                            const salesInfo = props.payload.salesCount ? ` (${props.payload.salesCount} vendas)` : '';
                            return [formatAsCurrency(originalValue), `Receita${salesInfo}`];
                        }}
                    />
                    <Radar 
                        name="Receita" 
                        dataKey="normalizedValue"
                        stroke="#00c2ff" 
                        fill="#00c2ff" 
                        fillOpacity={0.6} 
                    />
                </RadarChart>
            </ResponsiveContainer>

            {/* Legenda Detalhada (estilo pizza) */}
            <div className="mt-6 space-y-2 text-xs">
                <div className="flex items-center justify-between font-semibold text-white/50 px-2 py-1 border-b border-white/10">
                    <span className="w-2/5">Categoria</span>
                    <span className="w-1/5 text-center">Vendas</span>
                    <span className="w-1/5 text-right">Receita</span>
                    <span className="w-1/5 text-right">%</span>
                </div>
                {data.map((entry, index) => {
                    const percentage = totalValue > 0 ? (entry.value / totalValue) * 100 : 0;
                    const color = COLORS[index % COLORS.length]; // Reutilizando a paleta de cores

                    return (
                        <div key={`legend-${index}`} className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-white/5">
                            <div className="flex items-center w-2/5">
                                <span className="w-3 h-3 rounded-full mr-3 flex-shrink-0" style={{ backgroundColor: color }}></span>
                                <span className="text-white/90 truncate">{entry.name}</span>
                            </div>
                            <div className="w-1/5 text-center text-white/80">{entry.salesCount || '-'}</div>
                            <div className="w-1/5 text-right font-medium text-white">{formatAsCurrency(entry.value)}</div>
                            <div className="w-1/5 text-right text-white/80">{percentage.toFixed(1)}%</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
