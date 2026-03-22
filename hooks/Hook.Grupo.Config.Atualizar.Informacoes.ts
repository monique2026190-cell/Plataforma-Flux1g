
import { useState } from 'react';
import { SistemaGrupoSupremo } from '../ServiçosFrontend/ServiçoDeGrupos/Sistema.Grupo.Supremo';

export const useAtualizarInformacoesGrupo = () => {
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const atualizarInformacoes = async (groupId: string, data: { name?: string; description?: string }) => {
        setIsSaving(true);
        setError(null);
        try {
            await SistemaGrupoSupremo.updateGroupSettings(groupId, data);
            return true;
        } catch (e) {
            const errorMessage = e instanceof Error ? e.message : 'Ocorreu um erro desconhecido.';
            console.error("Falha ao atualizar informações do grupo:", errorMessage);
            setError(errorMessage);
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    return { isSaving, error, atualizarInformacoes };
};
