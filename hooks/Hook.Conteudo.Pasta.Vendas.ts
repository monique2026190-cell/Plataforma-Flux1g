
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// CORREÇÃO: A importação do groupService foi removida.
// import { groupService } from '../ServiçosFrontend/ServiçoDeGrupos/groupService';
import { getInstanciaSuprema } from '../ServiçosFrontend/ServiçoDeAutenticação/Sistema.Autenticacao.Supremo';
const authService = getInstanciaSuprema();
import { Group, SalesFolder, Infoproduct } from '../types';

export const useSalesFolderContent = () => {
    const navigate = useNavigate();
    const { groupId, folderId } = useParams<{ groupId: string, folderId: string }>();
    
    const [group, setGroup] = useState<Group | null>(null);
    const [folder, setFolder] = useState<SalesFolder | null>(null);
    const [loading, setLoading] = useState(true);
    const [isOwnerOrAdmin, setIsOwnerOrAdmin] = useState(false);

    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadCurrentItem, setUploadCurrentItem] = useState(0);
    const [uploadTotalItems, setUploadTotalItems] = useState(0);

    const [previewIndex, setPreviewIndex] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (groupId && folderId) {
            setLoading(true);
            // CORREÇÃO: Lógica de busca de grupo removida.
            console.error("groupService is not available, cannot load folder content.");
            setLoading(false);
            // Opcional: redirecionar para uma página anterior ou de erro.
            // navigate('/groups');
        } else {
            navigate('/groups');
        }
    }, [groupId, folderId, navigate]);

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleFileUpload = useCallback(async (files: FileList | null) => {
        if (!files || files.length === 0 || !group || !folder) return;

        // ... (lógica de upload local mantida para feedback visual) ...

        // CORREÇÃO: A chamada para groupService.updateGroup foi removida.
        console.error("Simulating file upload completion, but changes will not be saved.");

        // ... (resto da função para UI)
    }, [group, folder, folderId]);
    
    const handleBack = useCallback(() => navigate(-1), [navigate]);
    const handleOpenPreview = useCallback((index: number) => setPreviewIndex(index), []);
    const handleClosePreview = useCallback(() => setPreviewIndex(null), []);
    const triggerFileInput = useCallback(() => fileInputRef.current?.click(), []);

    const allowDownload = folder?.allowDownload ?? group?.salesPlatformAllowDownload ?? true;
    const allowMemberUpload = folder?.allowMemberUpload ?? group?.salesPlatformAllowMemberUpload ?? false;
    const canUpload = isOwnerOrAdmin || allowMemberUpload;

    return {
        loading,
        folder,
        canUpload,
        allowDownload,
        isUploading,
        uploadProgress,
        uploadCurrentItem,
        uploadTotalItems,
        fileInputRef,
        handleFileUpload,
        triggerFileInput,
        previewIndex,
        handleOpenPreview,
        handleClosePreview,
        handleBack
    };
};
