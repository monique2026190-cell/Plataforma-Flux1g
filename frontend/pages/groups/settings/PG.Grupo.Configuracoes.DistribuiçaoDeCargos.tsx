
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CabecalhoConfiguracaoInformacao } from '../../../Componentes/cabeçalhos/Cabecalho.Configuracao.Informacao';
import CardDistribuicaoCargos from '../../../Componentes/ComponentesDeGroups/Componentes/ComponentesDeConfiguracoesDeGrupo/Card.Distribuicao.Cargos';
import { useGrupoConfigCargosDistribuicao } from '../../../hooks/Hook.Grupo.Config.Cargos.Distribuicao';

export const PGGrupoConfiguracoesDistribuiçaoDeCargos: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { 
        members, 
        roles, 
        loading, 
        error, 
        isSaving, 
        updateMemberRole, 
        saveChanges 
    } = useGrupoConfigCargosDistribuicao(id);

    const handleSaveChanges = async () => {
        try {
            await saveChanges();
            alert('Distribuição de cargos salva com sucesso!');
        } catch (e) {
            alert('Ocorreu um erro ao salvar as alterações. Tente novamente.');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0c0f14] flex items-center justify-center text-white">
                <i className="fa-solid fa-circle-notch fa-spin text-2xl text-[#00c2ff]"></i>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#0c0f14] flex flex-col items-center justify-center text-white">
                <h1 className="font-bold text-lg text-red-500 mb-4">Erro ao Carregar</h1>
                <p className="text-center mb-6">{error}</p>
                <button onClick={() => navigate(-1)} className="bg-white/10 px-4 py-2 rounded-lg font-bold">Voltar</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#0c0f14,_#0a0c10)] text-white font-['Inter'] flex flex-col">
            <CabecalhoConfiguracaoInformacao titulo="Distribuição de Cargos" onBack={() => navigate(-1)} />

            <main className="pt-[85px] pb-[120px] w-full max-w-2xl mx-auto px-5 overflow-y-auto flex-grow no-scrollbar">
                {members.length > 0 ? (
                    <CardDistribuicaoCargos 
                        members={members}
                        roles={roles}
                        onUpdateMemberRole={updateMemberRole}
                    />
                ) : (
                    <div className="bg-black/20 border border-dashed border-white/10 rounded-2xl p-8 mt-8 text-center text-gray-500">
                        <i className="fa-solid fa-users-slash text-3xl mb-3"></i>
                        <p className="font-bold">Nenhum membro encontrado.</p>
                        <p className="text-sm mt-1">Não há membros neste grupo para distribuir cargos.</p>
                    </div>
                )}
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
