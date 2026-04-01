
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { feedPublicationService } from '../ServiçosFrontend/ServiçosDePublicações/Servico.Publicacao.Feed';
import { servicoAutenticacao } from '../ServiçosFrontend/Servico.Autenticacao';

interface PostFormData {
    texto: string;
    arquivosMidia: { url: string; file: File }[];
    isConteudoAdulto: boolean;
    localizacao: string;
    isAnuncio: boolean;
    orcamentoAnuncio: string;
    linkAnuncio: string;
}

export const HookCriarPost = () => {
    const navigate = useNavigate();
    const location = useLocation();
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
    
    // Estado para armazenar o usuário atual
    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        const verificarUsuario = async () => {
            // Tentativa de obter o usuário da sessão
            const user = await servicoAutenticacao.verificarSessao();
            setCurrentUser(user);
        };

        verificarUsuario();
    }, []);

    const updateField = useCallback((key: keyof PostFormData, value: any) => {
        setDadosPost(prev => ({ ...prev, [key]: value }));
    }, []);

    useEffect(() => {
        const textLength = dadosPost.texto.trim().length;
        const hasMedia = dadosPost.arquivosMidia.length > 0;
        setIsPublishDisabled(!(textLength > 0 || hasMedia) || isProcessing);
    }, [dadosPost, isProcessing]);

    const handleBack = () => navigate(-1);

    const handlePublishClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (isPublishDisabled || !currentUser) return;

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

            await feedPublicationService.createPost(formData);

            navigate('/feed');

        } catch (error: any) {
            console.error("Erro ao publicar o post:", error);
            setError({ geral: error.message || "Ocorreu um erro desconhecido." });
        } finally {
            setIsProcessing(false);
        }
    };

    const handleMediaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const newFiles = Array.from(event.target.files).map(file => ({ 
                url: URL.createObjectURL(file), 
                file 
            }));
            updateField('arquivosMidia', [...dadosPost.arquivosMidia, ...newFiles]);
        }
    };

    const handleRemoveMedia = (index: number) => {
        updateField('arquivosMidia', dadosPost.arquivosMidia.filter((_, i) => i !== index));
    };

    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [targetCountry, setTargetCountry] = useState('');
    const [targetState, setTargetState] = useState('');
    const [targetCity, setTargetCity] = useState('');
    const [countries] = useState(['Brasil', 'Portugal', 'EUA']);
    const [states, setStates] = useState<string[]>([]);
    const [cities, setCities] = useState<string[]>([]);

    const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setTargetCountry(e.target.value);
        setTargetState('');
        setTargetCity('');
        if (e.target.value === 'Brasil') setStates(['São Paulo', 'Rio de Janeiro']);
        else setStates([]);
    };

    const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setTargetState(e.target.value);
        setTargetCity('');
        if(e.target.value === 'São Paulo') setCities(['São Paulo', 'Campinas']);
        else setCities([]);
    };

    const saveLocation = () => {
        const locationParts = [targetCity, targetState, targetCountry].filter(Boolean);
        updateField('localizacao', locationParts.join(', ') || 'Global');
        setIsLocationModalOpen(false);
    };

    return {
        dadosPost,
        updateField,
        isPublishDisabled,
        isProcessing,
        error,
        handleMediaChange,
        handleRemoveMedia,
        handleBack,
        handlePublishClick,
        avatarUrl: currentUser?.photo_url,
        username: currentUser?.nickname || currentUser?.name,
        navigate,
        isLocationModalOpen,
        setIsLocationModalOpen,
        saveLocation,
        handleCountryChange,
        handleStateChange,
        targetCountry,
        targetState,
        targetCity,
        setTargetCity,
        countries,
        states,
        cities,
    };
};
