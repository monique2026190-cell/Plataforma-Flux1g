
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { SistemaGrupoSupremo } from '../ServiçosFrontend/ServiçoDeGrupos/Sistema.Grupo.Supremo';

// Tipagem para o estado do Modo Hub
interface HubModeState {
    isEnabled: boolean;
}

export const useGroupHubMode = () => {
    const { groupId } = useParams<{ groupId: string }>();
    const [hubModeState, setHubModeState] = useState<HubModeState>({ isEnabled: false });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Busca o estado atual do Modo Hub
    const fetchHubModeStatus = useCallback(async () => {
        if (!groupId) return;
        setLoading(true);
        setError(null);
        try {
            // Esta função será implementada na camada de serviço
            const response = await SistemaGrupoSupremo.getHubModeStatus(groupId);
            setHubModeState(response || { isEnabled: false });
        } catch (err) {
            setError("Não foi possível carregar o estado do Modo Hub.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [groupId]);

    // Efeito para buscar os dados ao montar o componente
    useEffect(() => {
        fetchHubModeStatus();
    }, [fetchHubModeStatus]);

    // Função para ativar ou desativar o Modo Hub
    const toggleHubMode = useCallback(async () => {
        if (!groupId) return;
        
        // Otimisticamente atualiza a UI
        const previousState = hubModeState;
        setHubModeState(prevState => ({ ...prevState, isEnabled: !prevState.isEnabled }));

        try {
            // Esta função será implementada na camada de serviço
            await SistemaGrupoSupremo.setHubModeStatus(groupId, { isEnabled: !previousState.isEnabled });
        } catch (err) {
            setError("Não foi possível atualizar o Modo Hub.");
            // Reverte a mudança otimista em caso de erro
            setHubModeState(previousState);
            console.error(err);
        }
    }, [groupId, hubModeState]);

    return {
        isHubModeEnabled: hubModeState.isEnabled,
        loading,
        error,
        toggleHubMode, // Função para a UI chamar
        refetch: fetchHubModeStatus,
    };
};
