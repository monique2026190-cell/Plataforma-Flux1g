
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { servicoAutenticacao } from '../ServiçosFrontend/ServiçoDeAutenticação/Auth.Application';
const authService = servicoAutenticacao;
import { CriacaoContaDto } from '../types/Entrada/Dto.Estrutura.Conta.Flux';


export const useHookCriacaoPerfilFlux = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [dados, setDados] = useState<CriacaoContaDto>({
        nome: '',
        email: '',
        senha: '',
    });

    const [errors, setErrors] = useState<Partial<Record<keyof CriacaoContaDto, string>>>({});
    const [loading, setLoading] = useState(false);
    const [isValid, setIsValid] = useState(false);

    const updateField = (key: keyof CriacaoContaDto, value: string) => {
        setDados((prev) => ({ ...prev, [key]: value }));
    };

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const ref = params.get('ref');
        if (ref) {
            // Você pode querer adicionar um campo para o código de referência no DTO se for necessário
        }
    }, [location]);

    useEffect(() => {
        const newErrors: Partial<Record<keyof CriacaoContaDto, string>> = {};
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

        if (dados.email && !emailRegex.test(dados.email)) {
            newErrors.email = "Formato de e-mail inválido.";
        }

        if (dados.senha && dados.senha.length < 6) {
            newErrors.senha = "A senha deve ter pelo menos 6 caracteres.";
        }

        if (dados.nome && dados.nome.length < 3) {
            newErrors.nome = "O nome deve ter pelo menos 3 caracteres.";
        }

        setErrors(newErrors);

        const allFilled = dados.email && dados.senha && dados.nome;
        setIsValid(!!allFilled && Object.keys(newErrors).length === 0);

    }, [dados]);

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValid) return;

        setLoading(true);
        setErrors({});

        try {
            await authService.criarConta(dados);
            navigate('/verify-email');

        } catch (err: any) {
            setErrors(prev => ({ ...prev, formulario: err.message || 'Ocorreu um erro no cadastro.' }));
        } finally {
            setLoading(false);
        }
    }, [isValid, dados, navigate]);

    return {
        dados,
        updateField,
        errors,
        loading,
        isValid,
        handleSubmit,
    };
};
