
import { useState, useEffect, useCallback } from 'react';
import { SistemaGrupoSupremo } from '../ServiçosFrontend/ServiçoDeGrupos/Sistema.Grupo.Supremo';
import { useAuth } from '../ServiçosFrontend/serviços/provedor/AuthProvider'; // Corrigido

interface Group {
    id: string;
    ownerId: string;
    name: string;
    description: string;
    isSalesPlatformEnabled?: boolean;
    isVip?: boolean;
    imagemCapa?: string;
    tipo?: string;
    creatorEmail?: string;
    price?: number;
    donoId?: string;
    descricao?: string;
    nome?: string;
}

export const HookConfiguracaoGrupoPrincipal = (groupId: string | undefined) => {
    const { usuario } = useAuth(); // Corrigido
    const [group, setGroup] = useState<Group | null>(null);
    const [loading, setLoading] = useState(true);
    const [isOwner, setIsOwner] = useState(false);

    const fetchGroupDetails = useCallback(async () => {
        if (!groupId) {
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const groupData = await SistemaGrupoSupremo.getGroupDetails(groupId);
            setGroup(groupData);
            // A lógica para verificar a propriedade do grupo permanece a mesma
            if (usuario && groupData.ownerId === usuario.id) {
                setIsOwner(true);
            } else {
                setIsOwner(false);
            }
        } catch (error) {
            console.error("Erro ao buscar detalhes do grupo:", error);
            setGroup(null);
        } finally {
            setLoading(false);
        }
    }, [groupId, usuario?.id]);

    useEffect(() => {
        fetchGroupDetails();
    }, [fetchGroupDetails]);

    const refreshGroup = () => {
        fetchGroupDetails();
    };

    return { group, loading, isOwner, refreshGroup };
};
