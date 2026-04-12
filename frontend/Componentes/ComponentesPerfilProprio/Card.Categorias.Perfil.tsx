import React from 'react';

interface CardCategoriasPerfilProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    hasProducts: boolean;
}

export const CardCategoriasPerfil: React.FC<CardCategoriasPerfilProps> = ({ activeTab, setActiveTab, hasProducts }) => {
    const tabs = [
        { id: 'posts', label: 'Posts', icon: 'fa-solid fa-pen-to-square' },
        { id: 'fotos', label: 'Fotos', icon: 'fa-solid fa-camera' },
        { id: 'reels', label: 'Reels', icon: 'fa-solid fa-film' },
    ];

    if (hasProducts) {
        tabs.splice(1, 0, { id: 'products', label: 'Loja', icon: 'fa-solid fa-store' });
    }

    return (
        // Estilo replicado do CartaoDeInformacoesDoPerfil, sem bordas arredondadas
        <nav className="tabs-nav bg-gradient-to-br from-slate-800 to-slate-900 border-y border-cyan-500/20 shadow-xl flex overflow-hidden">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    className={`flex-1 py-3 text-center text-sm transition-all duration-200 focus:outline-none flex flex-col items-center justify-center space-y-1 border-r border-slate-700 last:border-r-0 ${
                        activeTab === tab.id
                            ? 'bg-slate-700 font-semibold text-slate-100' // Estado ativo
                            : 'font-medium text-slate-400 hover:bg-slate-700/50 hover:text-slate-200' // Estado inativo e hover
                    }`}
                    onClick={() => setActiveTab(tab.id)}
                >
                    <span>{tab.label}</span>
                    <i className={`${tab.icon} text-lg`}></i>
                </button>
            ))}
        </nav>
    );
};
