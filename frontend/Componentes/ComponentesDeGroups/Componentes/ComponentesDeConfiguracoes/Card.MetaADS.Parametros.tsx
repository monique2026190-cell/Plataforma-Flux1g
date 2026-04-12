
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export const CardParametrosMetaADS: React.FC = () => {
    const { id: groupId } = useParams<{ id: string }>();
    const [pixelId, setPixelId] = useState('');
    const [accessToken, setAccessToken] = useState('');
    const [utmMedium, setUtmMedium] = useState('');
    const [utmCampaign, setUtmCampaign] = useState('');

    useEffect(() => {
        const fetchCredenciais = async () => {
            if (groupId) {
                try {
                    // TODO: serviço de Meta ADS removido
                    // const data = await servicoDeMetaAd.obterCredenciaisMeta(groupId);
                } catch (error) {
                    console.error("Erro ao buscar credenciais:", error);
                }
            }
        };
        fetchCredenciais();
    }, [groupId]);

    const handleSavePixel = async () => {
        if (!groupId) {
            alert("ID do grupo não encontrado.");
            return;
        }
        if (!pixelId || !accessToken) {
            alert('Por favor, preencha o ID do Pixel e o Token de Acesso.');
            return;
        }
        try {
            // TODO: serviço de Meta ADS removido
            // await servicoDeMetaAd.salvarCredenciaisMeta(groupId, pixelId, accessToken);
            alert('Configurações do Pixel salvas com sucesso!');
        } catch (error) {
            console.error("Erro ao salvar credenciais:", error);
            alert('Falha ao salvar as configurações do Pixel.');
        }
    };
    
    const handleSaveParams = () => {
        console.log("Salvando parâmetros UTM:", { groupId, utmMedium, utmCampaign });
        alert('Parâmetros UTM salvos com sucesso! (Simulado)');
    }

    return (
        <>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mt-6">
                <h3 className="font-bold text-lg text-white/90 mb-4">Conectar Pixel da Meta</h3>
                <p className="text-sm text-white/50 mb-6">Conecte seu Pixel da Meta para rastrear eventos e otimizar suas campanhas.</p>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="pixel_id" className="block text-sm font-medium text-white/70 mb-2">ID do Pixel</label>
                        <input
                            type="text"
                            id="pixel_id"
                            value={pixelId}
                            onChange={(e) => setPixelId(e.target.value)}
                            placeholder="Cole o ID do seu Pixel aqui"
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        />
                    </div>

                    <div>
                        <label htmlFor="access_token" className="block text-sm font-medium text-white/70 mb-2">Token de Acesso</label>
                        <input
                            type="text"
                            id="access_token"
                            value={accessToken}
                            onChange={(e) => setAccessToken(e.target.value)}
                            placeholder="Cole seu token de acesso da API de Conversões"
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        />
                    </div>

                    <button 
                        onClick={handleSavePixel}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                    >
                        Salvar Credenciais
                    </button>
                </div>
            </div>
            
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mt-6">
                <h3 className="font-bold text-lg text-white/90 mb-4">Parâmetros de URL (UTM)</h3>
                <p className="text-sm text-white/50 mb-6">Defina os parâmetros para rastrear a origem do tráfego gerado por suas campanhas no Meta Ads.</p>

                <div className="space-y-4">
                    <div>
                        <label htmlFor="utm_source" className="block text-sm font-medium text-white/70 mb-2">utm_source</label>
                        <input
                            type="text"
                            id="utm_source"
                            defaultValue="meta"
                            readOnly
                            className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white/50 cursor-not-allowed"
                        />
                    </div>

                    <div>
                        <label htmlFor="utm_medium" className="block text-sm font-medium text-white/70 mb-2">utm_medium</label>
                        <input
                            type="text"
                            id="utm_medium"
                            value={utmMedium}
                            onChange={(e) => setUtmMedium(e.target.value)}
                            placeholder="Ex: cpc, social, stories"
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        />
                    </div>

                    <div>
                        <label htmlFor="utm_campaign" className="block text-sm font-medium text-white/70 mb-2">utm_campaign</label>
                        <input
                            type="text"
                            id="utm_campaign"
                            value={utmCampaign}
                            onChange={(e) => setUtmCampaign(e.target.value)}
                            placeholder="Ex: lancamento_produto_x"
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        />
                    </div>

                    <button 
                        onClick={handleSaveParams}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                    >
                        Salvar Parâmetros
                    </button>
                </div>
            </div>
        </>
    );
};
