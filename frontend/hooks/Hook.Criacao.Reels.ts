
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { ServiçoPublicacaoReels } from '../ServiçosFrontend/ServiçosDePublicações/Servico.Publicacao.Reels';
import { DadosCriacaoReel, ErrosCriacaoReel } from '../tipos';

// A referência a 'Group' e 'groupService' foi completamente removida.

export const HookCriarReel = () => {
  const navigate = useNavigate();

  // O estado não inclui mais o 'groupId'.
  const [dadosReel, setDadosReel] = useState<Omit<DadosCriacaoReel, 'groupId'>>({ 
    descricao: '',
    arquivoVideo: null,
  });

  const [isCreating, setIsCreating] = useState(false);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<ErrosCriacaoReel>({});

  // O useEffect que buscava os grupos foi removido.

  const updateField = useCallback((field: keyof typeof dadosReel, value: any) => {
    setDadosReel(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
        updateField('arquivoVideo', file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setVideoPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        setErrors({});
    } else {
        setErrors({ arquivoVideo: 'Por favor, selecione um arquivo de vídeo válido.' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isCreating) return;

    if (!dadosReel.arquivoVideo) {
      return setErrors({ arquivoVideo: 'Um vídeo é obrigatório para criar o Reel.' });
    }
    if (!dadosReel.descricao.trim()) {
      return setErrors({ descricao: 'A descrição é obrigatória.' });
    }

    setIsCreating(true);
    setErrors({});

    try {
      // const user = authService.getCurrentUser(); // Removido temporariamente
      // if (!user) {
      //   throw new Error("Usuário não autenticado.");
      // }
      
      // A chamada de criação agora envia os dados sem qualquer referência a grupo.
      await ServiçoPublicacaoReels.create({
        ...dadosReel,
        authorId: "temp-user-id", // ID do usuário fixo temporariamente
      });

      // O redirecionamento agora é sempre para o feed principal.
      navigate('/feed');

    } catch (err: any) {
      console.error("Erro ao criar o Reel:", err);
      setErrors({ geral: err.message || 'Ocorreu um erro ao criar seu Reel.' });
    } finally {
      setIsCreating(false);
    }
  };

  return {
    dadosReel,
    updateField,
    videoPreview,
    isCreating,
    // 'userGroups' foi removido do retorno.
    errors,
    handleFileChange,
    handleSubmit,
    navigate
  };
};
