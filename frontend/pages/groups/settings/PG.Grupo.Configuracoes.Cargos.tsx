
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CabecalhoConfiguracaoCargos } from '../../../Componentes/cabeçalhos/Cabecalho.Configuracao.Cargos';
import CardCargoPadrao from '../../../Componentes/ComponentesDeGroups/Componentes/ComponentesModoHub/CriaçãoDeCard/Card.Cargo.Padrao';
import { CardCargoPersonalizado } from '../../../Componentes/ComponentesDeGroups/Componentes/ComponentesDeConfiguracoes/Card.Cargo.Personalizados';
import { GroupRole } from '../../../tipos/types.Grupo';
import { useGrupoConfigCargosCriacao } from '../../../hooks/Hook.Grupo.Config.Cargos.Criacao';

export const PGGrupoConfiguracoesCargos: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { roles, loading, error, addRole, updateRole, deleteRole } = useGrupoConfigCargosCriacao(id);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<GroupRole | null>(null);

    const handleOpenModal = (role: GroupRole | null) => {
        setSelectedRole(role);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedRole(null);
    };

    const handleSaveRole = async (roleData: { name: string; color: string }) => {
        try {
            if (selectedRole) {
                await updateRole(selectedRole.id, roleData);
            } else {
                await addRole(roleData);
            }
            handleCloseModal();
        } catch (e) {
            alert('Ocorreu um erro ao salvar o cargo. Tente novamente.');
        }
    };

    const handleDeleteRole = async (roleId: string) => {
        if (window.confirm('Tem certeza que deseja excluir este cargo?')) {
            try {
                await deleteRole(roleId);
            } catch (e) {
                alert('Ocorreu um erro ao excluir o cargo. Tente novamente.');
            }
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
            <CabecalhoConfiguracaoCargos titulo="Cargos do Grupo" onBack={() => navigate(-1)} />

            <main className="pt-[85px] pb-[120px] w-full max-w-2xl mx-auto px-5 overflow-y-auto flex-grow no-scrollbar">
                <div className="mb-10">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Cargo Padrão de Entrada</h3>
                    <CardCargoPadrao />
                </div>

                <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">Cargos Personalizados</h3>
                    <div className="space-y-3">
                        {roles.length > 0 ? (
                            roles.map(role => (
                                <CardCargoPersonalizado
                                    key={role.id}
                                    role={role}
                                    onEdit={handleOpenModal}
                                    onDelete={handleDeleteRole}
                                />
                            ))
                        ) : (
                            <div className="bg-black/20 border border-dashed border-white/10 rounded-2xl p-8 text-center text-gray-500">
                                <i className="fa-solid fa-shield-halved text-3xl mb-3"></i>
                                <p className="font-bold">Nenhum cargo personalizado.</p>
                                <p className="text-sm mt-1">Crie cargos para organizar seus membros. <br/> Clique no botão abaixo para começar.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <footer className="fixed bottom-0 left-0 right-0 bg-[#0c0f14]/80 backdrop-blur-sm z-30">
                <div className="max-w-2xl mx-auto p-4">
                    <button
                        onClick={() => handleOpenModal(null)}
                        className="w-full bg-[#00c2ff] text-black font-bold py-3.5 px-4 rounded-xl hover:bg-white transition-all duration-300 shadow-[0_4px_20px_rgba(0,194,255,0.4)]"
                    >
                        <i className="fa-solid fa-plus mr-2"></i>
                        Adicionar Novo Cargo
                    </button>
                </div>
            </footer>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1a1f29] border border-white/10 rounded-2xl p-6 w-full max-w-sm">
                        <h2 className="text-xl font-bold mb-6">{selectedRole ? 'Editar Cargo' : 'Adicionar Novo Cargo'}</h2>
                        <form onSubmit={async e => {
                            e.preventDefault();
                            const form = e.target as HTMLFormElement;
                            const name = (form.elements.namedItem('name') as HTMLInputElement).value;
                            const color = (form.elements.namedItem('color') as HTMLInputElement).value;
                            await handleSaveRole({ name, color });
                        }}>
                            <div className="mb-4">
                                <label htmlFor="role-name" className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">Nome do Cargo</label>
                                <input
                                    type="text"
                                    id="role-name"
                                    name="name"
                                    defaultValue={selectedRole?.name}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00c2ff] transition-all"
                                    required
                                />
                            </div>
                            <div className="mb-8">
                                <label htmlFor="role-color" className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wider">Cor do Cargo</label>
                                <input
                                    type="color"
                                    id="role-color"
                                    name="color"
                                    defaultValue={selectedRole?.color || '#ffffff'}
                                    className="w-full h-12 bg-black/20 border-none rounded-lg cursor-pointer"
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button type="button" onClick={handleCloseModal} className="bg-black/20 hover:bg-white/10 text-white font-bold py-2.5 px-5 rounded-lg transition-all">Cancelar</button>
                                <button type="submit" className="bg-[#00c2ff] hover:bg-white text-black font-bold py-2.5 px-5 rounded-lg transition-all">Salvar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
