
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface BarChartData {
    name: string;
    value: number;
    salesCount?: number;
}

interface GraficoBarraReceitaProps {
    data?: BarChartData[];
    loading: boolean;
    title: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#EC7063'];

const formatAsCurrency = (value: number) => {
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const formatYAxis = (value: number) => {
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
    return `$${value}`;
};

export const GraficoBarraReceita: React.FC<GraficoBarraReceitaProps> = ({ data = [], loading, title }) => {

    if (loading) {
        // ... loading state
    }

    if (data.length === 0) {
        // ... empty state
    }

    const totalValue = data.reduce((acc, entry) => acc + entry.value, 0);

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 col-span-1 md:col-span-3 shadow-lg">
            <h3 className="font-bold text-lg text-white/90 mb-4">{title}</h3>
            
            <div style={{ width: '100%', height: 250 }}>
                <ResponsiveContainer>
                    <BarChart
                        data={data}
                        margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" vertical={false} />
                        <XAxis dataKey="name" stroke="rgba(255, 255, 255, 0.7)" tick={{ fontSize: 12 }} />
                        <YAxis stroke="rgba(255, 255, 255, 0.7)" tick={{ fontSize: 12 }} tickFormatter={formatYAxis} />
                        <Tooltip
                            cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
                            contentStyle={{ 
                                background: 'rgba(20, 24, 30, 0.8)', 
                                borderColor: 'rgba(255, 255, 255, 0.2)',
                                color: '#fff',
                                borderRadius: '8px'
                            }}
                            formatter={(value: number, name: string, props) => {
                                const salesInfo = props.payload.salesCount ? ` (${props.payload.salesCount} vendas)` : '';
                                return [formatAsCurrency(value), `Receita${salesInfo}`];
                            }}
                        />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

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
                    const color = COLORS[index % COLORS.length];

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
