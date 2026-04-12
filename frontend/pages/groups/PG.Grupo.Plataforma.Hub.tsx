
import React, { useState, useRef } from 'react';
import { useGroupPlatformData } from '../../hooks/Hook.Grupo.Plataforma.Hub';
import { Footer } from '../../Componentes/layout/Footer';
import PastaCard from '../../Componentes/ComponentesDeGroups/Componentes/ComponentesModoHub/Card.Pasta';
import BotaoAlternadorOrganizacao from '../../Componentes/ComponentesDeGroups/Componentes/ComponentesModoHub/Botao.Alternador.Organizacao';
import BotaoCriar from '../../Componentes/ComponentesDeGroups/Componentes/ComponentesModoHub/Botao.Criar';
import CardGrupoInformacoes from '../../Componentes/ComponentesDeGroups/Componentes/ComponentesModoHub/Card.Grupo.Informacoes';
import CabecalhoNavegacao from '../../Componentes/cabeçalhos/Cabecalho.Navegacao';
import CardContainerPesquisa from '../../Componentes/ComponentesDeGroups/Componentes/ComponentesModoHub/Card.Container.Pesquisa';
import CardSessaoTitulo from '../../Componentes/ComponentesDeGroups/Componentes/ComponentesModoHub/Card.Sessao.Titulo';
import ModalGestao from '../../Componentes/ComponentesDeGroups/Componentes/ComponentesModoHub/Modal.Gestao';
import CanalItem from '../../Componentes/ComponentesDeGroups/Componentes/ComponentesModoHub/CanalItem';

type TipoVisualizacao = 'lista' | 'grade';

export const PG_Grupo_Plataforma_Hub: React.FC = () => {
    const { groupData, loading, error, setGroupData } = useGroupPlatformData();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFolder, setSelectedFolder] = useState<any | null>(null);
    const [visualizacao, setVisualizacao] = useState<TipoVisualizacao>('grade');
    const [modalOpenForFolder, setModalOpenForFolder] = useState<any | null>(null);

    const handleFolderClick = (folder: any) => {
        setSelectedFolder(folder);
    };

    const handleBackToFolders = () => {
        setSelectedFolder(null);
    };

    const handleCriarSessao = () => {
        const title = prompt('Digite o nome da nova seção:');
        if (title && groupData) {
            const newSection = {
                id: `section${Date.now()}`,
                title,
                folders: [],
            };
            setGroupData({
                ...groupData,
                sections: [...groupData.sections, newSection],
            });
        }
    };

    const handleCriarPasta = () => {
        if (!groupData || groupData.sections.length === 0) {
            alert('Crie uma seção primeiro!');
            return;
        }

        const sectionChoices = groupData.sections.map((s, i) => `${i + 1}: ${s.title}`).join('\n');
        const sectionIndexStr = prompt(`Digite o número da seção para adicionar a pasta:\n${sectionChoices}`);
        
        if (!sectionIndexStr) return;

        const sectionIndex = parseInt(sectionIndexStr, 10) - 1;

        if (isNaN(sectionIndex) || sectionIndex < 0 || sectionIndex >= groupData.sections.length) {
            alert('Seleção de seção inválida.');
            return;
        }

        const name = prompt('Digite o nome da nova pasta:');
        if (name) {
            const newFolder = {
                id: `folder${Date.now()}`,
                name,
                channels: [],
            };

            const updatedSections = groupData.sections.map((section, index) => {
                if (index === sectionIndex) {
                    return {
                        ...section,
                        folders: [...section.folders, newFolder],
                    };
                }
                return section;
            });

            setGroupData({
                ...groupData,
                sections: updatedSections,
            });
        }
    };

    const handleEditFolder = () => {
        if (modalOpenForFolder) {
            console.log(`Editando a pasta: ${modalOpenForFolder.name}`);
            setModalOpenForFolder(null);
        }
    };

    const handleDeleteFolder = () => {
        if (modalOpenForFolder) {
            console.log(`Deletando a pasta: ${modalOpenForFolder.name}`);
            setModalOpenForFolder(null);
        }
    };

    const openFolderModal = (e: React.MouseEvent, folder: any) => {
        e.stopPropagation();
        setModalOpenForFolder(folder);
    };

    const allSections = groupData?.sections || [];
    const filteredSections = !searchTerm
        ? allSections
        : allSections
            .map(section => ({
                ...section,
                folders: section.folders.filter(folder =>
                    folder.name.toLowerCase().includes(searchTerm.toLowerCase())
                ),
            }))
            .filter(section => section.folders.length > 0);

    const renderFoldersView = () => (
        <div>
            {filteredSections.map(section => (
                <div key={section.id} className="mb-10">
                    <CardSessaoTitulo titulo={section.title} />
                    <div className={`${visualizacao === 'grade' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6' : 'flex flex-col gap-3'}`}>
                        {section.folders.map(folder => (
                            <PastaCard
                                key={folder.id}
                                nomePasta={folder.name}
                                layout={visualizacao}
                                onClick={() => handleFolderClick(folder)}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );

    const renderChannelsView = () => (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-3xl font-bold">{selectedFolder.name}</h3>
            </div>
            <div className={`${visualizacao === 'grade' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'flex flex-col gap-2'}`}>
                {selectedFolder.channels
                    .filter((channel: any) => !searchTerm || channel.name.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((channel: any) => (
                        <CanalItem 
                            key={channel.id} 
                            channel={channel} 
                            visualizacao={visualizacao} 
                        />
                    ))}
            </div>
        </div>
    );

    const renderContent = () => {
        if (loading) return <div className="text-center p-10 pt-[89px]"><div className="loader"></div>Carregando...</div>;
        if (error) return <div className="text-center p-10 pt-[89px] text-red-400">Erro ao carregar conteúdo: {error}</div>;
        if (!groupData) return <div className="text-center p-10 pt-[89px]">Nenhum dado de grupo encontrado.</div>;

        return (
            <div className="w-full max-w-5xl mx-auto px-4">
                 {!selectedFolder && (
                    <div className="mb-8">
                        <CardGrupoInformacoes 
                            nome={groupData.name}
                            descricao={groupData.description}
                            imagemCapaUrl={groupData.coverImageUrl}
                        />
                    </div>
                )}

                <div className="flex justify-between items-center mb-8">
                    <CardContainerPesquisa 
                        placeholder={selectedFolder ? "Buscar conteúdos..." : "Buscar pastas..."}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="ml-4">
                        <BotaoAlternadorOrganizacao visualizacaoAtual={visualizacao} onMudarVisualizacao={setVisualizacao} />
                    </div>
                </div>

                <main>
                    {selectedFolder ? renderChannelsView() : renderFoldersView()}
                </main>
                
                {!selectedFolder && <BotaoCriar onCriarSessao={handleCriarSessao} onCriarPasta={handleCriarPasta} />}

                {modalOpenForFolder && (
                    <ModalGestao 
                        onClose={() => setModalOpenForFolder(null)}
                        onEdit={handleEditFolder}
                        onDelete={handleDeleteFolder}
                    />
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans">
            <CabecalhoNavegacao titulo={selectedFolder ? selectedFolder.name : (groupData?.name || 'Arquivos')} onBack={selectedFolder ? handleBackToFolders : undefined} />
            <main className="flex-grow pt-[85px] pb-20">
                {renderContent()}
            </main>
            <Footer />
        </div>
    );
};
