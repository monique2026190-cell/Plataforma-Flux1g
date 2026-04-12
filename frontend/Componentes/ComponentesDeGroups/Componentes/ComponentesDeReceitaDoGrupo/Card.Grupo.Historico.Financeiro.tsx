
import React from 'react';

// Define a interface para uma única transação no histórico
interface Transaction {
    id: string;
    description: string;
    date: string;
    amount: number;
    currency: 'BRL' | 'USD' | 'EUR';
    status: 'completed' | 'pending';
}

// Define as props do componente, que agora espera um array de transações
interface CardGrupoHistoricoFinanceiroProps {
    transactions?: Transaction[];
    loading: boolean;
}

// Helper para formatar moeda
const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
};

// Componente para um item da lista de transações
const TransactionItem: React.FC<{ transaction: Transaction }> = ({ transaction }) => {
    const isCompleted = transaction.status === 'completed';
    const icon = isCompleted ? 'fa-check-circle' : 'fa-clock';
    const color = isCompleted ? 'text-green-400' : 'text-yellow-400';

    return (
        <li className="flex items-center justify-between py-3 border-b border-white/10">
            <div className="flex items-center gap-4">
                <div className={`text-xl ${color}`}>
                    <i className={`fa-solid ${icon}`}></i>
                </div>
                <div>
                    <p className="font-medium text-white/90">{transaction.description}</p>
                    <p className="text-sm text-white/50">{transaction.date}</p>
                </div>
            </div>
            <div className={`font-bold text-lg ${isCompleted ? 'text-white' : 'text-white/70'}`}>
                {formatCurrency(transaction.amount, transaction.currency)}
            </div>
        </li>
    );
};

export const CardGrupoHistoricoFinanceiro: React.FC<CardGrupoHistoricoFinanceiroProps> = ({ transactions, loading }) => {
    if (loading) {
        return (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 col-span-1 md:col-span-3">
                <h3 className="font-bold text-lg text-white/90 mb-4">Histórico Financeiro</h3>
                <div className="flex justify-center items-center h-40">
                    <i className="fa-solid fa-circle-notch fa-spin text-2xl text-[#00c2ff]"></i>
                </div>
            </div>
        );
    }

    if (!transactions || transactions.length === 0) {
        return (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 col-span-1 md:col-span-3">
                <h3 className="font-bold text-lg text-white/90 mb-1">Histórico Financeiro</h3>
                <div className="text-center py-10">
                    <i className="fa-solid fa-receipt text-4xl text-white/20 mb-3"></i>
                    <p className="text-white/50">Nenhuma transação encontrada.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 col-span-1 md:col-span-3 shadow-lg">
            <h3 className="font-bold text-lg text-white/90 mb-2">Histórico Financeiro</h3>
            <ul className="space-y-2">
                {transactions.map(tx => (
                    <TransactionItem key={tx.id} transaction={tx} />
                ))}
            </ul>
        </div>
    );
};
