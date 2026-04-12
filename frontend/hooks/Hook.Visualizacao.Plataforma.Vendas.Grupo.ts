
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// CORREÇÃO: A importação do groupService foi removida.
// import { groupService } from '../ServiçosFrontend/ServiçoDeGrupos/groupService';

import { Group } from '../types';

export const useGroupSalesPlatformView = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [group, setGroup] = useState<Group | null>(null);
    const [canManage, setCanManage] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            setLoading(true);
            // CORREÇÃO: Lógica de busca de grupo removida.
            console.error("groupService is not available, cannot load group sales platform view.");
            setGroup(null);
            setCanManage(false);
            setLoading(false);
            // Opcional: redirecionar imediatamente se os dados do grupo são essenciais.
            // navigate('/groups');
        } else {
            setLoading(false);
        }
    }, [id, navigate]);

    const handleFolderClick = useCallback((folderId: string) => {
        if (group) {
            navigate(`/group-folder/${group.id}/${folderId}`);
        }
    }, [group, navigate]);

    const handleChannelClick = useCallback((channelId: string) => {
        if (group) {
            navigate(`/group-chat/${group.id}/${channelId}`);
        }
    }, [group, navigate]);

    const handleBack = useCallback(() => {
        navigate('/groups');
    }, [navigate]);

    return {
        group,
        canManage,
        loading,
        handleFolderClick,
        handleChannelClick,
        handleBack
    };
};
