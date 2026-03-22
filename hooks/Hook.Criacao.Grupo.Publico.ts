
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SistemaGrupoSupremo } from '../ServiçosFrontend/ServiçoDeGrupos/Sistema.Grupo.Supremo';
import SistemaAutenticacaoSupremo from '../ServiçosFrontend/ServiçoDeAutenticação/Sistema.Autenticacao.Supremo';

export const useCreatePublicGroup = () => {
    const navigate = useNavigate();
    const [groupName, setGroupName] = useState('');
    const [description, setDescription] = useState('');
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

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!groupName) return;

        setIsCreating(true);
        const currentUser = SistemaAutenticacaoSupremo.getCurrentUser();
        if (!currentUser) {
            alert("Usuário não autenticado!");
            setIsCreating(false);
            return;
        }

        try {
            // Refatorado para usar o SistemaGrupoSupremo
            const newGroup = await SistemaGrupoSupremo.criarGrupoPublico({
                name: groupName,
                description,
                coverImageBlob: coverImage, // Assumindo que o serviço lida com a conversão
                createdBy: currentUser.uid,
            });

            console.log('Grupo público criado com sucesso:', newGroup);
            navigate(`/group/${newGroup.id}`);
        } catch (error) {
            console.error("Erro ao criar grupo público:", error);
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
