
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AreaChartData {
    name: string;
    value: number; // Valor da receita
    salesCount?: number; // Número de vendas (opcional)
}

interface GraficoAreaReceitaProps {
    data?: AreaChartData[];
    loading: boolean;
    title: string;
}

const formatAsCurrency = (value: number) => {
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

export const GraficoAreaReceita: React.FC<GraficoAreaReceitaProps> = ({ data, loading, title }) => {

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
                    <i className="fa-solid fa-chart-area text-4xl text-white/20 mb-3"></i>
                    <p className="text-white/50">Dados insuficientes para exibir o gráfico.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 col-span-1 md:col-span-3 shadow-lg">
            <h3 className="font-bold text-lg text-white/90 mb-4">{title}</h3>
            
            <div style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <AreaChart
                        data={data}
                        margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                    >
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00c2ff" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#00c2ff" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                        <XAxis dataKey="name" stroke="rgba(255, 255, 255, 0.7)" tick={{ fontSize: 12 }} />
                        <YAxis stroke="rgba(255, 255, 255, 0.7)" tick={{ fontSize: 12 }} tickFormatter={formatAsCurrency} />
                        <Tooltip
                            contentStyle={{ 
                                background: 'rgba(20, 24, 30, 0.8)', 
                                borderColor: 'rgba(255, 255, 255, 0.2)',
                                color: '#fff' 
                            }}
                            formatter={(value: number, name: string, props) => {
                                const payload = props.payload as AreaChartData;
                                const salesInfo = payload.salesCount ? ` (${payload.salesCount} vendas)` : '';
                                return [formatAsCurrency(value), `Receita${salesInfo}`];
                            }}
                            labelFormatter={(label) => <span className="font-bold">{label}</span>}
                        />
                        <Area type="monotone" dataKey="value" stroke="#00c2ff" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
