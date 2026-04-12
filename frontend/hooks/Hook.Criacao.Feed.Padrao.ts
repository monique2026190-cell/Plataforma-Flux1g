
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { feedPublicationService } from '../ServiçosFrontend/ServiçosDePublicações/Servico.Publicacao.Feed';
import { useAuth } from '../SistemaFlux/Provedores/Provedor.Autenticacao';

interface PostFormData {
    texto: string;
    arquivosMidia: { url: string; file: File }[];
    isConteudoAdulto: boolean;
    localizacao: string;
    isAnuncio: boolean;
    orcamentoAnuncio: string;
    linkAnuncio: string;
}

// Renomeado para seguir a convenção de hooks e o padrão em português.
export const useCriarPost = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { usuario } = useAuth();
    const locationState = location.state as { isAd?: boolean } | null;

    const [dadosPost, setDadosPost] = useState<PostFormData>({
        texto: '',
        arquivosMidia: [],
        isConteudoAdulto: false,
        localizacao: 'Global',
        isAnuncio: locationState?.isAd || false,
        orcamentoAnuncio: '',
        linkAnuncio: '',
    });

    const [isPublishDisabled, setIsPublishDisabled] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<{ geral?: string } | null>(null);

    // Renomeado para português.
    const atualizarCampo = useCallback((key: keyof PostFormData, value: any) => {
        setDadosPost(prev => ({ ...prev, [key]: value }));
    }, []);

    useEffect(() => {
        const textLength = dadosPost.texto.trim().length;
        const hasMedia = dadosPost.arquivosMidia.length > 0;
        setIsPublishDisabled(!(textLength > 0 || hasMedia) || isProcessing);
    }, [dadosPost, isProcessing]);

    // Renomeado para português.
    const lidarComVoltar = () => navigate(-1);

    // Renomeado para português.
    const lidarComCliquePublicar = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (isPublishDisabled || !usuario) return;

        setIsProcessing(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('conteudo', dadosPost.texto);
            formData.append('tipo', 'post');
            formData.append('isConteudoAdulto', String(dadosPost.isConteudoAdulto));

            dadosPost.arquivosMidia.forEach(media => {
                formData.append('midia', media.file);
            });
            
            if (dadosPost.isAnuncio) {
                formData.append('linkCta', dadosPost.linkAnuncio);
            }

            // Chamada ao método de serviço com nome corrigido.
            await feedPublicationService.criarPost(formData);

            navigate('/feed');

        } catch (error: any) {
            console.error("Erro ao publicar o post:", error);
            setError({ geral: error.message || "Ocorreu um erro desconhecido." });
        } finally {
            setIsProcessing(false);
        }
    };

    // Renomeado para português.
    const lidarComMudancaDeMidia = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const newFiles = Array.from(event.target.files).map(file => ({ 
                url: URL.createObjectURL(file), 
                file 
            }));
            atualizarCampo('arquivosMidia', [...dadosPost.arquivosMidia, ...newFiles]);
        }
    };

    // Renomeado para português.
    const lidarComRemocaoDeMidia = (index: number) => {
        atualizarCampo('arquivosMidia', dadosPost.arquivosMidia.filter((_, i) => i !== index));
    };

    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [targetCountry, setTargetCountry] = useState('');
    const [targetState, setTargetState] = useState('');
    const [targetCity, setTargetCity] = useState('');
    const [countries] = useState(['Brasil', 'Portugal', 'EUA']);
    const [states, setStates] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);

    const lidarComMudancaDePais = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setTargetCountry(e.target.value);
        setTargetState(''); setTargetCity('');
        if (e.target.value === 'Brasil') setStates(['São Paulo', 'Rio de Janeiro']); else setStates([]);
    };

    const lidarComMudancaDeEstado = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setTargetState(e.target.value);
        setTargetCity('');
        if(e.target.value === 'São Paulo') setCities(['São Paulo', 'Campinas']); else setCities([]);
    };

    const salvarLocalizacao = () => {
        const locationParts = [targetCity, targetState, targetCountry].filter(Boolean);
        atualizarCampo('localizacao', locationParts.join(', ') || 'Global');
        setIsLocationModalOpen(false);
    };

    // Retorna os métodos com os novos nomes em português.
    return {
        dadosPost,
        atualizarCampo,
        isPublishDisabled,
        isProcessing,
        error,
        lidarComMudancaDeMidia,
        lidarComRemocaoDeMidia,
        lidarComVoltar,
        lidarComCliquePublicar,
        avatarUrl: usuario?.avatarUrl,
        username: usuario?.apelido || usuario?.nome,
        navigate,
        isLocationModalOpen,
        setIsLocationModalOpen,
        salvarLocalizacao,
        lidarComMudancaDePais,
        lidarComMudancaDeEstado,
        targetCountry,
        targetState,
        targetCity,
        setTargetCity,
        countries,
        states,
        cities,
    };
};
