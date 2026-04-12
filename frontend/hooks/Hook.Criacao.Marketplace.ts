
import { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { marketplacePublicationService } from '../ServiçosFrontend/ServiçosDePublicações/Servico.Publicacao.Marketplace.js';

// Tipagem para os itens da galeria de mídia
interface MediaItem {
    url: string;
    type: 'image' | 'video';
    file: File;
}

export const HookCriarItemMarketplace = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as { type?: 'paid' | 'organic' } | null;

    // Estados individuais para cada campo do formulário
    const [isPaid, setIsPaid] = useState(state?.type === 'paid');
    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('Eletrônicos');
    const [locationVal, setLocationVal] = useState('');
    const [description, setDescription] = useState('');
    const [coverImage, setCoverImage] = useState<string | null>(null);
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [additionalMedia, setAdditionalMedia] = useState<MediaItem[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Funções de manipulação dos inputs
    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, "");
        if (value === "") {
            setPrice("");
            return;
        }
        const numericValue = parseFloat(value) / 100;
        setPrice(numericValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 }));
    };

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setCoverFile(file);
            setCoverImage(URL.createObjectURL(file));
        }
    };

    const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newMedia: MediaItem[] = Array.from(files).map(file => ({
                file: file,
                url: URL.createObjectURL(file),
                type: file.type.startsWith('video') ? 'video' : 'image'
            }));
            setAdditionalMedia(prev => [...prev, ...newMedia].slice(0, 5)); // Limita a 5 itens
        }
    };

    const removeGalleryItem = (index: number) => {
        setAdditionalMedia(prev => prev.filter((_, i) => i !== index));
    };

    const handleBack = () => navigate(-1);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!coverFile) {
            alert("A imagem de capa é obrigatória.");
            return;
        }
        setIsSubmitting(true);
        try {
            // const coverImageUrl = await fileService.uploadFile(coverFile, `marketplace-items`);
            // const additionalMediaUrls = await Promise.all(
            //     additionalMedia.map(item => fileService.uploadFile(item.file, `marketplace-items`))
            // );
            const rawPrice = price.replace(/\./g, '').replace(',', '.');
            const itemData = {
                title,
                price: parseFloat(rawPrice),
                category,
                description,
                location: locationVal,
                images: [/*coverImageUrl, ...additionalMediaUrls*/].filter(Boolean) as string[],
            };
            await marketplacePublicationService.createProduct(itemData);
            navigate('/marketplace');
        } catch (err) {
            console.error("Erro ao publicar item no marketplace:", err);
            alert("Falha ao publicar o item. Tente novamente.");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Retorna a interface esperada pelo componente
    return {
        isPaid,
        title, setTitle,
        price, handlePriceChange,
        category, setCategory,
        locationVal, setLocationVal,
        description, setDescription,
        coverImage,
        additionalMedia,
        isSubmitting,
        handleCoverChange,
        handleGalleryChange,
        removeGalleryItem,
        handleBack,
        handleSubmit
    };
}
