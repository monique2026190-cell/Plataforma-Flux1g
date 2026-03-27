
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SistemaGrupoSupremo } from '../ServiçosFrontend/ServiçoDeGrupos/Sistema.Grupo.Supremo';
import { servicoAutenticacao } from '../ServiçosFrontend/ServiçoDeAutenticação/Auth.Application';
const authService = servicoAutenticacao;

export const useCreatePaidGroup = () => {
    const navigate = useNavigate();
    const [groupName, setGroupName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [coverImage, setCoverImage] = useState<string | null>(null);
    const [rawImage, setRawImage] = useState<string | null>(null);
    const [isCropOpen, setIsCropOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    const handleCoverChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setRawImage(e.target?.result as string);
                setIsCropOpen(true);
            };
            reader.readAsDataURL(event.target.files[0]);
        }
    };

    const handleCroppedImage = (image: string) => {
        setCoverImage(image);
        setIsCropOpen(false);
    };

    const dataURLtoBlob = (dataurl: string) => {
        const arr = dataurl.split(',');
        const mimeMatch = arr[0].match(/:(.*?);/);
        if (!mimeMatch) return null;
        const mime = mimeMatch[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!groupName || price <= 0) return;

        setIsCreating(true);
        const currentUser = authService.getCurrentUser();
        if (!currentUser) {
            alert("Usuário não autenticado!");
            setIsCreating(false);
            return;
        }

        try {
            const coverBlob = coverImage ? dataURLtoBlob(coverImage) : null;

            const payload = {
                groupName,
                description,
                selectedCoverFile: coverBlob,
                numericPrice: price,
                currency: 'BRL', 
                vipMediaItems: [],
                vipDoorText: 'Acesso Exclusivo',
                vipButtonText: 'Assinar Agora',
                accessType: 'subscription',
                accessConfig: {},
                selectedProviderId: null,
                pixelId: null,
                pixelToken: null,
            };

            const onProgress = (percentage: number, count: number, total: number) => {
                console.log(`Upload progress: ${percentage.toFixed(2)}% (${count}/${total})`);
            };

            // Refatorado para usar o SistemaGrupoSupremo
            const newGroup = await SistemaGrupoSupremo.criarGrupoPago(payload, onProgress);

            console.log('Grupo VIP criado com sucesso:', newGroup);
            navigate(`/group/${newGroup.id}`);
        } catch (error) {
            console.error("Erro ao criar grupo VIP:", error);
            alert("Falha ao criar o grupo. Tente novamente.");
        } finally {
            setIsCreating(false);
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    return {
        groupName, setGroupName,
        description, setDescription,
        price, setPrice,
        coverImage, setCoverImage,
        isCreating,
        isCropOpen, setIsCropOpen,
        rawImage, setRawImage,
        handleCoverChange,
        handleCroppedImage,
        handleSubmit,
        handleBack,
        navigate,
    };
};
