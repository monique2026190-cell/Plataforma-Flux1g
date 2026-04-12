import { useState, useEffect } from 'react';

// Simulando um delay de API
const fetchDelay = (ms: number) => new Promise(res => setTimeout(res, ms));

// Hook para buscar dados da plataforma do grupo
export const useGroupPlatformData = () => {
    const [groupData, setGroupData] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                await fetchDelay(1000);
                setGroupData({
                    id: 'grupo01',
                    name: 'Grupo de Testes',
                    description: 'Este é um grupo de testes para a plataforma de hospedagem de arquivos.',
                    coverImageUrl: 'https://picsum.photos/seed/grupo01/800/200',
                    sections: [
                        {
                            id: 'sessao01',
                            title: 'Documentos Importantes',
                            folders: [
                                {
                                    id: 'pasta01',
                                    name: 'Manuais e Guias',
                                    channels: [
                                        { id: 'canal01', name: 'Canal de Vídeo Exemplo' },
                                        { id: 'canal02', name: 'Canal de Texto Exemplo' },
                                        { id: 'canal03', name: 'Canal de Imagens Diversas' },
                                        { id: 'canal07', name: 'Podcast sobre Novidades (MP3)' }, // Áudio
                                        { id: 'canal08', name: 'Manual de Uso (PDF)' }, // Documento
                                    ]
                                },
                                {
                                    id: 'pasta02',
                                    name: 'Relatórios Mensais',
                                    channels: [
                                        { id: 'canal04', name: 'Relatório de Vendas (MP4)' },
                                        { id: 'canal05', name: 'Feedback de Clientes (TXT)' },
                                        { id: 'canal06', name: 'Gráficos de Performance (JPG)' },
                                        { id: 'canal09', name: 'Gravação da Reunião (MP3)' }, // Áudio
                                        { id: 'canal10', name: 'Termos de Serviço (DOC)' }, // Documento
                                    ]
                                },
                            ]
                        },
                        {
                            id: 'sessao02',
                            title: 'Recursos de Mídia',
                            folders: [
                                {
                                    id: 'pasta03',
                                    name: 'Vídeos de Treinamento',
                                    channels: []
                                },
                                {
                                    id: 'pasta04',
                                    name: 'Apresentações',
                                    channels: []
                                },
                            ]
                        }
                    ]
                });
            } catch (err) {
                setError('Falha ao carregar os dados do grupo.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { groupData, loading, error, setGroupData };
};