
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SistemaGrupoSupremo } from '../ServiçosFrontend/ServiçoDeGrupos/Sistema.Grupo.Supremo';

import { Group, CurrencyCode } from '../types';

interface UnifiedMetric {
    provider: string;
    method: string;
    country: string;
    count: number;
    percentage: number;
}

export interface RevenueStats {
    hoje: number;
    ontem: number;
    d30: number;
    d60: number;
    d90: number;
    d180: number;
    total: number;
    unifiedMetrics: UnifiedMetric[];
    totalSales: number;
}

export const useGroupRevenue = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [group, setGroup] = useState<Group | null>(null);
    const [loading, setLoading] = useState(true);
    const [statsBRL, setStatsBRL] = useState<RevenueStats | null>(null);
    const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>('BRL');
    const [conversionRate, setConversionRate] = useState(1);

    const [authState, setAuthState] = useState(authService.getState());
    const { user } = authState;

    useEffect(() => {
        const unsubscribe = authService.subscribe(setAuthState);
        return () => unsubscribe();
    }, []);

    const loadData = useCallback(async () => {
        setLoading(true);
        if (!user || !id) {
            setLoading(false);
            return;
        }

        try {
            const foundGroup = await SistemaGrupoSupremo.getGroupDetails(id);
            if (foundGroup) {
                setGroup(foundGroup);
            } else {
                setLoading(false);
                return;
            }

            const groupTransactions: any[] = [];

            const now = Date.now();
            const oneDay = 24 * 60 * 60 * 1000;
            const todayStart = new Date(new Date().setHours(0,0,0,0)).getTime();
            const yesterdayStart = todayStart - oneDay;

            const metricMap: Record<string, number> = {};
            const result: RevenueStats = {
                hoje: 0, ontem: 0, d30: 0, d60: 0, d90: 0, d180: 0, total: 0,
                unifiedMetrics: [],
                totalSales: groupTransactions.length
            };

            groupTransactions.forEach(t => {
                const amount = parseFloat(t.amount || t.valor || '0');
                const ts = new Date(t.created_at || t.createdAt || t.date_created || 0).getTime();
                
                const isPaid = ['paid', 'completed', 'approved', 'settled'].includes((t.status || '').toLowerCase());
                if (!isPaid) {
                    result.totalSales -= 1;
                    return;
                }

                result.total += amount;

                if (ts >= todayStart) result.hoje += amount;
                else if (ts >= yesterdayStart && ts < todayStart) result.ontem += amount;

                if (ts >= now - (30 * oneDay)) result.d30 += amount;
                if (ts >= now - (60 * oneDay)) result.d60 += amount;
                if (ts >= now - (90 * oneDay)) result.d90 += amount;
                if (ts >= now - (180 * oneDay)) result.d180 += amount;
                
                const prov = (t.provider || t.provedor || 'desconhecido').toLowerCase();
                const meth = (t.method || t.metodo || 'não informado').split(' ')[0];
                const country = (t.country || t.pais || 'BR').toUpperCase();
                
                const key = `${prov}|${meth}|${country}`;
                metricMap[key] = (metricMap[key] || 0) + 1;
            });

            if (result.totalSales > 0) {
                result.unifiedMetrics = Object.entries(metricMap).map(([key, count]) => {
                    const [provider, method, country] = key.split('|');
                    return {
                        provider,
                        method,
                        country,
                        count,
                        percentage: (count / result.totalSales) * 100
                    };
                }).sort((a, b) => b.count - a.count);
            }

            setStatsBRL(result);
        } catch (e) {
            console.error("Erro ao carregar faturamento:", e);
        } finally {
            setLoading(false);
        }
    }, [id, user]);

    useEffect(() => { loadData(); }, [loadData]);

    useEffect(() => {
        // currencyService foi removido. A conversão de moeda está desativada, a taxa será sempre 1.
        setConversionRate(1);
    }, [selectedCurrency]);

    const stats = useMemo(() => {
        if (!statsBRL) return null;
        if (conversionRate === 1) return statsBRL; // Sempre será o caso agora
        const rate = conversionRate;
        return {
            ...statsBRL,
            hoje: statsBRL.hoje * rate, ontem: statsBRL.ontem * rate,
            d30: statsBRL.d30 * rate, d60: statsBRL.d60 * rate,
            d90: statsBRL.d90 * rate, d180: statsBRL.d180 * rate,
            total: statsBRL.total * rate
        };
    }, [statsBRL, conversionRate]);

    const locale = useMemo(() => {
        // Mapeamento de moedas para locales, já que o currencyService foi removido.
        const currencyToLocaleMap: { [key: string]: string } = {
            'BRL': 'pt-BR',
            'USD': 'en-US',
            'EUR': 'de-DE', 
        };
        return currencyToLocaleMap[selectedCurrency] || 'pt-BR';
    }, [selectedCurrency]);

    return {
        group,
        loading,
        isConverting: false, // O estado de conversão foi removido
        stats,
        selectedCurrency,
        setSelectedCurrency,
        locale,
        navigate
    };
};
