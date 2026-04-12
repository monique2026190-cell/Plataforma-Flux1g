
import React from 'react';
import { HookPaginaGrupo } from '../hooks/Hook.Pagina.Grupo';
import CabecalhoNavegacao from '../Componentes/cabeçalhos/Cabecalho.Navegacao';

const GroupCardSkeleton = () => (
    <div className="animate-pulse w-full max-w-2xl mx-auto mt-8">
        <div className="bg-gray-700 h-48 w-full rounded-t-lg"></div>
        <div className="p-6 bg-[#1a1e26] rounded-b-lg">
            <div className="h-8 bg-gray-600 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-600 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-600 rounded w-5/6 mb-4"></div>
            <div className="flex justify-between items-center">
                <div className="h-6 bg-gray-600 rounded w-1/4"></div>
                <div className="h-10 bg-blue-500 rounded-lg w-1/3"></div>
            </div>
        </div>
    </div>
);

const ErrorDisplay = ({ message, onRetry }: { message: string, onRetry: () => void }) => (
    <div className="w-full max-w-2xl mx-auto mt-8 text-center bg-[#1a1e26] p-8 rounded-lg">
        <i className="fa-solid fa-circle-exclamation text-red-500 text-4xl mb-4"></i>
        <h2 className="text-xl font-bold text-white mb-2">Ocorreu um Erro</h2>
        <p className="text-gray-400 mb-6">{message}</p>
        <button 
            onClick={onRetry}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
        >
            Tentar Novamente
        </button>
    </div>
);

export const PG_Grupo_Entrada = () => {
    const { group, loading, error, handleJoinAction, handleBack } = HookPaginaGrupo();

    const reload = () => window.location.reload();

    return (
        <div className="min-h-screen bg-[#101216] text-white pt-[65px]">
            <CabecalhoNavegacao titulo={loading ? "Carregando Grupo..." : (group?.name || "Grupo") } onBack={handleBack} />
            
            <main className="p-4">
                {loading && <GroupCardSkeleton />}

                {error && <ErrorDisplay message={error} onRetry={reload} />}

                {group && !loading && (
                    <div className="w-full max-w-2xl mx-auto overflow-hidden rounded-lg shadow-lg bg-[#1a1e26] mt-8">
                        <img 
                            src={group.bannerUrl} 
                            alt={`Banner do grupo ${group.name}`} 
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-6">
                            <h1 className="text-3xl font-bold text-white mb-2">{group.name}</h1>
                            <p className="text-gray-300 mb-4">{group.description}</p>
                            
                            <div className="flex justify-between items-center">
                                <div className="text-sm text-gray-400">
                                    <i className="fa-solid fa-users mr-2"></i>
                                    <span>{group.memberCount.toLocaleString('pt-BR')} membros</span>
                                </div>
                                
                                <button 
                                    onClick={handleJoinAction}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 flex items-center gap-2"
                                >
                                    Entrar no Grupo
                                    <i className="fa-solid fa-arrow-right"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};
