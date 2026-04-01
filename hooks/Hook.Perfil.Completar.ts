
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../SistemaFlux/Provedores/Provedor.Autenticacao';
import { CompleteProfileViewModel, CompleteProfileForm } from '../viewmodels/CompleteProfileViewModel';
import { dadosProviderSessao } from '../ServiçosFrontend/Infra/Dados.Provider.Sessao';

export const useCompleteProfile = () => {
    const navigate = useNavigate();
    const { usuario, autenticado, processando, logout } = useAuth();

    const [previaImagem, setPreviaImagem] = useState<string | null>(null);
    const [arquivoSelecionado, setArquivoSelecionado] = useState<File | null>(null);
    const [cortarAberto, setCortarAberto] = useState(false);
    const [imagemOriginal, setImagemOriginal] = useState<string>('');

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<CompleteProfileForm>({
        mode: 'onChange',
        defaultValues: {
            nickname: usuario?.nome || '',
            name: '',
            bio: '',
        }
    });

    useEffect(() => {
        if (!processando) {
            if (!autenticado) {
                navigate('/login');
            } else if (usuario?.perfilCompleto) {
                navigate('/feed');
            }
        }
    }, [navigate, autenticado, processando, usuario]);

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
            const request = CompleteProfileViewModel.toRequest(form);
            // Assumindo que o ID do usuário está disponível no objeto `usuario` do `useAuth`
            if (usuario?.id) {
                await dadosProviderSessao.completarPerfil(usuario.id, request.apelido, request.nome, request.bio, arquivoSelecionado);
                navigate('/feed');
            } else {
                throw new Error("ID do usuário não encontrado.");
            }
        } catch (err: any) {
            console.error("Falha ao completar o perfil:", err);
            const errorMessage = err.message || 'Ocorreu um erro desconhecido.';

            if (errorMessage.includes('APELIDO_TAKEN')) {
                setError('nickname', { type: 'manual', message: 'Este apelido já está em uso.' });
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
        handleSubmit: handleSubmit(aoSubmeter),
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
