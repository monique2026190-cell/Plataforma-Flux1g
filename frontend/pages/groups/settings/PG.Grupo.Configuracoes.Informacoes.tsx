
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HookConfiguracaoGrupoPrincipal } from '../../../hooks/Hook.Configuracao.Grupo.Principal';
import { useAtualizarInformacoesGrupo } from '../../../hooks/Hook.Grupo.Config.Atualizar.Informacoes';
import { CabecalhoConfiguracaoInformacao } from '../../../Componentes/cabeçalhos/Cabecalho.Configuracao.Informacao';

export const PGGrupoConfiguracoesInformacoes: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { group, loading, refreshGroup } = HookConfiguracaoGrupoPrincipal(id);
    const { isSaving, error, atualizarInformacoes } = useAtualizarInformacoesGrupo();

    const [avatar, setAvatar] = useState<string | undefined>(undefined);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (group) {
            setAvatar(group.avatar);
            setName(group.name);
            setDescription(group.description);
        }
    }, [group]);

    const handleAvatarChange = () => {
        // Placeholder for avatar change logic
        alert('Funcionalidade de troca de avatar a ser implementada.');
    };

    const handleSaveChanges = async () => {
        if (!id) return;

        const success = await atualizarInformacoes(id, { name, description });

        if (success) {
            alert('Alterações salvas com sucesso!');
            if (refreshGroup) refreshGroup();
            navigate(`/group-settings/${id}`);
        } else {
            alert(`Erro ao salvar: ${error}`);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0c0f14] flex items-center justify-center text-white">
                <i className="fa-solid fa-circle-notch fa-spin text-2xl text-[#00c2ff]"></i>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#0c0f14,_#0a0c10)] text-white font-['Inter'] flex flex-col">
            <CabecalhoConfiguracaoInformacao titulo="Informações Principais" onBack={() => navigate(-1)} />

            <main className="pt-[85px] pb-[120px] w-full max-w-2xl mx-auto px-5 overflow-y-auto flex-grow no-scrollbar">
                <div className="flex flex-col items-center py-8">
                    <div className="relative">
                        <img
                            src={avatar || 'https://via.placeholder.com/150'}
                            alt="Avatar do Grupo"
                            className="w-32 h-32 rounded-full object-cover border-4 border-white/10 shadow-lg"
                        />
                        <button
                            onClick={handleAvatarChange}
                            className="absolute bottom-0 right-0 bg-[#00c2ff] hover:bg-white transition-all text-black w-10 h-10 rounded-full flex items-center justify-center border-4 border-[#0c0f14]"
                            aria-label="Mudar avatar"
                        >
                            <i className="fa-solid fa-camera-rotate text-lg"></i>
                        </button>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <label htmlFor="group-name" className="block text-sm font-medium text-gray-400 mb-2">
                            Nome do Grupo
                        </label>
                        <input
                            type="text"
                            id="group-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Insira o nome do grupo"
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00c2ff] transition-all"
                        />
                    </div>
                    <div>
                        <label htmlFor="group-description" className="block text-sm font-medium text-gray-400 mb-2">
                            Descrição do Grupo
                        </label>
                        <textarea
                            id="group-description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={5}
                            placeholder="Descreva a finalidade do seu grupo"
                            className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00c2ff] transition-all no-scrollbar"
                        />
                    </div>
                </div>
            </main>

            <footer className="fixed bottom-0 left-0 right-0 bg-[#0c0f14]/80 backdrop-blur-sm z-30">
                 <div className="max-w-2xl mx-auto p-4">
                    <button
                        onClick={handleSaveChanges}
                        disabled={isSaving}
                        className="w-full bg-[#00c2ff] text-black font-bold py-3.5 px-4 rounded-xl hover:bg-white transition-all duration-300 shadow-[0_4px_20px_rgba(0,194,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? (
                            <>
                                <i className="fa-solid fa-circle-notch fa-spin mr-2"></i>
                                Salvando...
                            </>
                        ) : (
                            'Salvar Alterações'
                        )}
                    </button>
                </div>
            </footer>
        </div>
    );
};
