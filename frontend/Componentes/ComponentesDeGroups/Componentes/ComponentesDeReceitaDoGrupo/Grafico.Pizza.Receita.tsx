
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

// A interface de dados agora inclui a contagem de vendas (opcional)
interface PieChartData {
    name: string;
    value: number; // Valor da receita
    salesCount?: number; // Número de vendas
}

interface GraficoPizzaReceitaProps {
    data?: PieChartData[];
    loading: boolean;
    title: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD', '#EC7063'];

const formatAsCurrency = (value: number) => {
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const GraficoPizzaReceita: React.FC<GraficoPizzaReceitaProps> = ({ data, loading, title }) => {

    if (loading) {
        return (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 col-span-1 md:col-span-3">
                <h3 className="font-bold text-lg text-white/90 mb-4">{title}</h3>
                <div className="flex justify-center items-center h-64">
                    <i className="fa-solid fa-circle-notch fa-spin text-2xl text-[#00c2ff]"></i>
                </div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 col-span-1 md:col-span-3">
                <h3 className="font-bold text-lg text-white/90 mb-1">{title}</h3>
                <div className="text-center py-16">
                    <i className="fa-solid fa-chart-pie text-4xl text-white/20 mb-3"></i>
                    <p className="text-white/50">Dados insuficientes para exibir o gráfico.</p>
                </div>
            </div>
        );
    }

    const totalValue = data.reduce((acc, entry) => acc + entry.value, 0);

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 col-span-1 md:col-span-3 shadow-lg">
            <h3 className="font-bold text-lg text-white/90 mb-4">{title}</h3>
            
            <div style={{ width: '100%', height: 180 }}>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            innerRadius={60}
                            fill="#8884d8"
                            dataKey="value"
                            paddingAngle={2}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ 
                                background: 'rgba(20, 24, 30, 0.8)', 
                                borderColor: 'rgba(255, 255, 255, 0.2)',
                                color: '#fff' 
                            }}
                            formatter={(value: number, name: string, props) => {
                                const payload = props.payload as PieChartData;
                                const salesInfo = payload.salesCount ? ` (${payload.salesCount} vendas)` : '';
                                return [formatAsCurrency(value), `${name}${salesInfo}`];
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Legenda Detalhada com Cabeçalho */}
            <div className="mt-6 space-y-2 text-xs">
                 {/* Cabeçalho da Legenda */}
                 <div className="flex items-center justify-between font-semibold text-white/50 px-2 py-1 border-b border-white/10">
                    <span className="w-2/5">Categoria</span>
                    <span className="w-1/5 text-center">Vendas</span>
                    <span className="w-1/5 text-right">Receita</span>
                    <span className="w-1/5 text-right">%</span>
                </div>
                {data.map((entry, index) => {
                    const percentage = (entry.value / totalValue) * 100;
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
