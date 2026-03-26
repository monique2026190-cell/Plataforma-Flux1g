
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { feedPublicationService } from '../ServiçosFrontend/ServiçosDePublicações/Servico.Publicacao.Feed';
import { getInstanciaSuprema } from '../ServiçosFrontend/ServiçoDeAutenticação/Sistema.Autenticacao.Supremo';
const authService = getInstanciaSuprema();
import { PublicacaoFeed } from '../types/Saida/Types.Estrutura.Publicacao.Feed';

// Interface simplificada para o estado do formulário
interface PostFormData {
    texto: string;
    arquivosMidia: File[];
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
    
    // CORREÇÃO: Substituindo a chamada inexistente por um estado reativo que ouve o authService.
    const [currentUser, setCurrentUser] = useState(authService.getState().user);

    useEffect(() => {
        // Se inscreve para atualizações no estado de autenticação.
        const unsubscribe = authService.subscribe(state => {
            setCurrentUser(state.user);
        });
        // Limpa a inscrição ao desmontar o componente.
        return () => unsubscribe();
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
            formData.append('tipo', 'post'); // Tipo de publicação padrão
            formData.append('isConteudoAdulto', String(dadosPost.isConteudoAdulto));

            dadosPost.arquivosMidia.forEach(file => {
                formData.append('midia', file);
            });
            
            // Adicionar lógica para anúncios se necessário
            if (dadosPost.isAnuncio) {
                formData.append('linkCta', dadosPost.linkAnuncio);
                // Outros campos de anúncio
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
            const newFiles = Array.from(event.target.files);
            updateField('arquivosMidia', [...dadosPost.arquivosMidia, ...newFiles]);
        }
    };

    const handleRemoveMedia = (index: number) => {
        updateField('arquivosMidia', dadosPost.arquivosMidia.filter((_, i) => i !== index));
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
        // CORREÇÃO: Propriedades de usuário agora vêm do estado reativo e são mais robustas.
        avatarUrl: currentUser?.photo_url || currentUser?.avatar_url,
        username: currentUser?.nickname || currentUser?.username || currentUser?.name,
        navigate,
        // Mock de propriedades restantes para manter a compatibilidade da UI
        isLocationModalOpen: false,
        setIsLocationModalOpen: () => {},
        saveLocation: () => {},
        handleCountryChange: () => {},
        handleStateChange: () => {},
        targetCountry: '', 
        targetState: '',
        targetCity: '',
        setTargetCity: () => {},
        countries: [],
        states: [],
        cities: [],
    };
};
