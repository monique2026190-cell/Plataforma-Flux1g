
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { servicoAutenticacao } from '../ServiçosFrontend/ServiçoDeAutenticação/Auth.Application';
const authService = servicoAutenticacao;

export const useCompleteProfile = () => {
    const navigate = useNavigate();
    const [authState, setAuthState] = useState(authService.getState());

    // Estado para o upload e corte da imagem de perfil (mantido)
    const [previaImagem, setPreviaImagem] = useState<string | null>(null);
    const [arquivoSelecionado, setArquivoSelecionado] = useState<File | null>(null);
    const [cortarAberto, setCortarAberto] = useState(false);
    const [imagemOriginal, setImagemOriginal] = useState<string>('');

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<any>({
        // Define um modo de validação mais interativo
        mode: 'onChange',
    });

    // Hooks para verificar o estado de autenticação (mantidos)
    useEffect(() => {
        const unsubscribe = authService.subscribe(setAuthState);
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const { user, loading } = authState;
        if (!loading) {
            if (!user) navigate('/');
            else if (user.perfilCompleto) navigate('/feed');
        }
    }, [navigate, authState]);

    // Funções de manipulação da imagem de perfil (mantidas)
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

    // Nova função de submissão, integrada com react-hook-form
    const aoSubmeter = async (data: any) => {
        try {
            // TODO: Adicionar lógica de upload da imagem (arquivoSelecionado)
            // const urlDaFoto = arquivoSelecionado ? await servicoDeArquivos.upload(arquivoSelecionado) : '';

            await authService.completeProfile({
                ...data,
                urlFoto: '' // Substituir pela urlDaFoto quando o upload for implementado
            });

            navigate('/feed');

        } catch (err: any) {
            console.error("Falha ao completar o perfil:", err);
            const errorMessage = err.message || 'Ocorreu um erro desconhecido.';
            
            // Associa erros da API aos campos do formulário
            if (errorMessage.includes('APELIDO_TAKEN')) {
                setError('nickname', { type: 'manual', message: 'Este apelido já está em uso. Tente outro.' });
            } else if (errorMessage.includes('NOME_USUARIO_TAKEN')) {
                setError('name', { type: 'manual', message: 'Este nome de usuário já está em uso. Tente outro.' });
            } else {
                // Erro genérico associado à raiz do formulário
                setError('root.serverError', { type: 'manual', message: 'Não foi possível finalizar o cadastro. Tente novamente mais tarde.' });
            }
        }
    };

    const aoSair = () => {
        authService.logout();
        navigate('/');
    };

    return {
        // Propriedades do react-hook-form para o componente
        register,
        handleSubmit: handleSubmit(aoSubmeter),
        errors,
        isSubmitting,

        // Estado e funções da imagem
        previaImagem,
        cortarAberto,
        setCortarAberto,
        imagemOriginal,
        aoMudarImagem,
        aoSalvarImagemCortada,
        
        // Outras ações
        aoSair
    };
};
