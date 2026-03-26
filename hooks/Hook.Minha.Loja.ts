
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getInstanciaSuprema } from '../ServiçosFrontend/ServiçoDeAutenticação/Sistema.Autenticacao.Supremo';
const authService = getInstanciaSuprema();
import { BusinessDashboardData } from '../types';

// Dados simulados de campanhas, já que o serviço foi removido
const mockCampaigns = [
    {
        id: 'campaign-1',
        userId: 'user-2',
        name: 'Promoção de Lançamento',
        status: 'active',
        startDate: '2024-07-01',
        endDate: '2024-07-31',
        budget: 500,
        reach: 12000,
        clicks: 800,
        conversions: 50,
    },
    {
        id: 'campaign-2',
        userId: 'user-2',
        name: 'Queima de Estoque',
        status: 'ended',
        startDate: '2024-06-01',
        endDate: '2024-06-15',
        budget: 300,
        reach: 7500,
        clicks: 450,
        conversions: 25,
    }
];

export const HookMinhaLoja = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'products' | 'campaigns'>('products');
    const [dashboardData, setDashboardData] = useState<BusinessDashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    // --- Gerenciamento de Estado de Autenticação Reativo ---
    const [authState, setAuthState] = useState(authService.getState());
    const { user } = authState;

    useEffect(() => {
        const unsubscribe = authService.subscribe(setAuthState);
        return () => unsubscribe(); // Limpa a inscrição ao desmontar
    }, []);

    const loadAggregatedData = useCallback(async () => {
        if (!user) {
            navigate('/');
            return;
        }
        setLoading(true);
        try {
            // 1. Produtos do usuário agora são uma lista vazia, pois o serviço foi removido.
            console.log("marketplaceService não encontrado. Produtos do usuário não serão carregados.");
            const userProducts = [];

            // 2. Buscar campanhas do usuário (usando os dados simulados)
            const userCampaigns = mockCampaigns.filter(campaign => campaign.userId === user.id);

            // 3. Agregar os dados no formato esperado
            const data: BusinessDashboardData = {
                products: userProducts,
                campaigns: userCampaigns,
                stats: {
                    totalProducts: userProducts.length,
                    activeCampaigns: userCampaigns.filter(c => c.status === 'active').length,
                    totalRevenue: userProducts.reduce((sum, p) => sum + (p.price || 0), 0), // Simulação simples
                }
            };
            
            setDashboardData(data);
        } catch (e) {
            console.error("Erro ao carregar dados agregados:", e);
        } finally {
            setLoading(false);
        }
    }, [navigate, user]); // Dependência 'user' adicionada

    useEffect(() => {
        loadAggregatedData();
    }, [loadAggregatedData]);

    const deleteProduct = async (id: string) => {
        // A lógica de deleção foi removida pois o marketplaceService não existe mais.
        console.log(`Simulando deleção do produto ${id}. A lista será recarregada.`);
        loadAggregatedData(); // Recarrega os dados para refletir a mudança (lista vazia)
    };

    const endCampaign = async (id: string) => {
        // await adService.updateCampaignStatus(id, 'ended');
        console.log('Simulando o encerramento da campanha');
        loadAggregatedData(); // Recarrega os dados
    };

    const resumeCampaign = async (id: string) => {
        // await adService.updateCampaignStatus(id, 'active');
        console.log('Simulando o resumo da campanha');
        loadAggregatedData(); // Recarrega os dados
    };



    const deleteCampaign = async (id: string) => {
        // await adService.deleteCampaign(id);
        console.log('Simulando a exclusão da campanha');
        loadAggregatedData();
    };

    const handleBack = () => {
        navigate(-1);
    };

    return {
        activeTab,
        setActiveTab,
        dashboardData,
        loading,
        deleteProduct,
        endCampaign,
        resumeCampaign,
        deleteCampaign,
        handleBack
    };
}
