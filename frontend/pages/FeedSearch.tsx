
import React from 'react';
import { HookPesquisaFeed } from '../hooks/Hook.Pesquisa.Feed';
import { FeedSearchHeader } from '../Componentes/ComponentesDeFeed/search/FeedSearchHeader';
import { FeedSearchFilters } from '../Componentes/ComponentesDeFeed/search/FeedSearchFilters';
import { FeedSearchResults } from '../Componentes/ComponentesDeFeed/search/FeedSearchResults';

export const FeedSearch: React.FC = () => {
    const {
        searchTerm,
        setSearchTerm,
        activeTab,
        setActiveTab,
        filter,
        setFilter,
        postResults,
        userResults,
        loading,
        currentUser,
        handleBack,
    } = HookPesquisaFeed();

    return (
        <div className="h-screen bg-[#0a0c10] text-white font-['Inter'] flex flex-col overflow-hidden">
            <FeedSearchHeader 
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                onBack={handleBack}
                loading={loading}
            />
            
            <FeedSearchFilters 
                activeTab={activeTab}
                onTabChange={setActiveTab}
                activeFilter={filter}
                onFilterChange={setFilter}
                show={searchTerm.trim().length > 0}
            />

            <main className="flex-1 overflow-y-auto no-scrollbar">
                <FeedSearchResults 
                    activeTab={activeTab}
                    postResults={postResults}
                    userResults={userResults}
                    loading={loading}
                    searchTerm={searchTerm}
                    currentUser={currentUser}
                />
            </main>
        </div>
    );
};
