import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../SistemaFlux/Provedores/Provedor.Autenticacao';

interface CompleteProfileForm {
    nickname: string;
    name: string;
    bio: string;
    avatar: File | null;
    accountType: 'public' | 'private';
}

export const useCompleteProfile = () => {
    const navigate = useNavigate();
    const { usuario, autenticado, processando, logout, possibilitaCompletarPerfil } = useAuth();

    const [previaImagem, setPreviaImagem] = useState<string | null>(null);
    const [arquivoSelecionado, setArquivoSelecionado] = useState<File | null>(null);
    const [cortarAberto, setCortarAberto] = useState(false);
    const [imagemOriginal, setImagemOriginal] = useState<string>('');

    const {
        register,
        handleSubmit,
        setError,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<CompleteProfileForm>({
        mode: 'onChange',
        defaultValues: {
            nickname: usuario?.nome || '',
            name: '',
            bio: '',
            accountType: 'public',
        }
    });

    useEffect(() => {
        if (possibilitaCompletarPerfil === undefined) {
            throw new Error("A função 'completarPerfil' não foi fornecida pelo 'AuthContext'. Verifique o 'Provedor.Autenticacao' e certifique-se de que ela está sendo exportada no valor do provedor.");
        }

        if (!processando) {
            if (!autenticado) {
                navigate('/login');
            } else if (usuario?.perfilCompleto) {
                navigate('/feed');
            }
        }
    }, [navigate, autenticado, processando, usuario, possibilitaCompletarPerfil]);

    const aoMudarImagem = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setImagemOriginal(ev.target?.result as string);
                setCortarAberto(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const aoSalvarImagemCortada = (base64Cortada: string) => {
        setPreviaImagem(base64Cortada);
        fetch(base64Cortada)
          .then(res => res.blob())
          .then(blob => {
              const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });
              setArquivoSelecionado(file);
          });
    };

    const aoSubmeter = async (form: CompleteProfileForm) => {
        try {
            const { nickname, name, bio, accountType } = form;

            const formData = new FormData();
            formData.append('nome', nickname);
            formData.append('apelido', name);
            formData.append('bio', bio);
            formData.append('tipoDeConta', accountType);
            if (arquivoSelecionado) {
                formData.append('avatar', arquivoSelecionado);
            }

            if (usuario?.id) {
                await possibilitaCompletarPerfil(formData);
                navigate('/feed');
            } else {
                throw new Error("ID do usuário não encontrado.");
            }
        } catch (err: any) {
            console.error("Falha ao completar o perfil:", err);
            const errorMessage = err.response?.data?.message || err.message || 'Ocorreu um erro desconhecido.';

            if (errorMessage.includes('APELIDO_TAKEN')) {
                setError('name', { type: 'manual', message: 'Este nome de usuário já está em uso.' });
            } else {
                setError('root.serverError', { type: 'manual', message: 'Não foi possível finalizar o cadastro.' });
            }
        }
    };

    const aoSair = () => {
        logout();
        navigate('/login');
    };

    return {
        register,
        onSubmit: handleSubmit(aoSubmeter),
        watch,
        setValue,
        errors,
        isSubmitting,
        previaImagem,
        cortarAberto,
        setCortarAberto,
        imagemOriginal,
        aoMudarImagem,
        aoSalvarImagemCortada,
        aoSair
    };
};