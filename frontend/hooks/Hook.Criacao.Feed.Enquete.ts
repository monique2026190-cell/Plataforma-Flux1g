
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { feedPublicationService } from '../ServiçosFrontend/ServiçosDePublicações/Servico.Publicacao.Feed';

import { PublicacaoFeed } from '../types/Saida/Types.Estrutura.Publicacao.Feed';

// Definindo um tipo mais específico para as opções da enquete no hook
interface PollOption {
    id: string;
    text: string;
    votes?: number;
}

export const HookCriarEnquete = (editingPost: PublicacaoFeed | null) => {
    const navigate = useNavigate();
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState<PollOption[]>([{ id: '1', text: '' }, { id: '2', text: '' }]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (editingPost && editingPost.tipo === 'poll' && editingPost.opcoesEnquete) {
            setQuestion(editingPost.conteudo);
            // A estrutura de opcoesEnquete precisa ser conhecida para o mapeamento correto
            // Assumindo que seja um array de objetos com a propriedade 'text'
            const pollOptions = editingPost.opcoesEnquete.map((opt: any, index: number) => ({ id: `${index + 1}`, text: opt.text, votes: opt.votes }));
            setOptions(pollOptions);
        }
    }, [editingPost]);

    const handleOptionChange = (id: string, text: string) => {
        const newOptions = options.map(option => option.id === id ? { ...option, text } : option);
        setOptions(newOptions);
    };

    const addOption = () => {
        if (options.length < 5) {
            setOptions([...options, { id: `${Date.now()}`, text: '' }]);
        }
    };

    const removeOption = (id: string) => {
        if (options.length > 2) {
            setOptions(options.filter(option => option.id !== id));
        }
    };

    const handleSubmit = async () => {
        if (question.trim() === '' || options.some(opt => opt.text.trim() === '')) {
            alert('Por favor, preencha a pergunta e todas as opções da enquete.');
            return;
        }

        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('conteudo', question.trim());
        formData.append('tipo', 'poll');
        // Serializa as opções da enquete para o formato esperado pelo backend
        const pollOptionsData = options.map(opt => ({ text: opt.text.trim(), votes: opt.votes || 0 }));
        formData.append('opcoesEnquete', JSON.stringify(pollOptionsData));
        // O autorId será adicionado no backend a partir do token de autenticação

        try {
            if (editingPost) {
                // Para edição, o serviço precisaria de um método que aceite FormData.
                // Assumindo que updatePost também pode lidar com FormData.
                await feedPublicationService.updatePost(editingPost.id, { 
                    conteudo: question.trim(),
                    opcoesEnquete: pollOptionsData
                } as Partial<PublicacaoFeed>);
            } else {
                await feedPublicationService.createPost(formData);
            }
            navigate('/feed'); // Redireciona para o feed após sucesso
        } catch (error) {
            console.error("Erro ao criar/atualizar enquete:", error);
            alert('Ocorreu um erro. Tente novamente.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        question,
        setQuestion,
        options,
        handleOptionChange,
        addOption,
        removeOption,
        handleSubmit,
        isSubmitting,
        canAddOption: options.length < 5,
        canRemoveOption: options.length > 2,
    };
};
