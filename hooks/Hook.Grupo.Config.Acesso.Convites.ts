
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { SistemaGrupoSupremo } from '../ServiçosFrontend/ServiçoDeGrupos/Sistema.Grupo.Supremo';

// Interface para o link de convite
interface InviteLink {
    id: string;
    code: string;
    url: string;
    uses: number;
    maxUses: number | null;
    expiresAt: string | null;
    isPermanent: boolean;
}

export const useGroupAccessAndInvites = () => {
    const { groupId } = useParams<{ groupId: string }>();
    const [inviteLinks, setInviteLinks] = useState<InviteLink[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Função para buscar os links de convite
    const fetchInviteLinks = useCallback(async () => {
        if (!groupId) return;
        setLoading(true);
        try {
            const links = await SistemaGrupoSupremo.getInviteLinks(groupId);
            setInviteLinks(links || []);
        } catch (err) {
            setError('Falha ao carregar os links de convite.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [groupId]);

    // Efeito para buscar os links na montagem do componente
    useEffect(() => {
        fetchInviteLinks();
    }, [fetchInviteLinks]);

    // Função para criar um novo link de convite
    const createNewInviteLink = useCallback(async (options: { maxUses?: number, expiresIn?: number }) => {
        if (!groupId) return;
        try {
            // A lógica de criação pode precisar de opções, como tempo de expiração ou usos máximos
            await SistemaGrupoSupremo.createInviteLink(groupId, options);
            // Após criar, recarrega a lista para mostrar o novo link
            await fetchInviteLinks(); 
        } catch (err) {
            setError('Falha ao criar o novo link de convite.');
            console.error(err);
            // Lançar o erro pode ser útil para o componente que chama
            throw err;
        }
    }, [groupId, fetchInviteLinks]);

    // Função para revogar (excluir) um link de convite
    const revokeInviteLink = useCallback(async (linkId: string) => {
        if (!groupId) return;
        try {
            await SistemaGrupoSupremo.revokeInviteLink(groupId, linkId);
            // Remove o link da lista localmente para uma atualização rápida da UI
            setInviteLinks(prevLinks => prevLinks.filter(link => link.id !== linkId));
        } catch (err) {
            setError('Falha ao revogar o link de convite.');
            console.error(err);
            throw err;
        }
    }, [groupId]);

    return {
        inviteLinks,
        loading,
        error,
        refetchInvites: fetchInviteLinks,      // Para recarregamento manual
        createInvite: createNewInviteLink, // Para criar novos links
        revokeInvite: revokeInviteLink,    // Para excluir links
    };
};
