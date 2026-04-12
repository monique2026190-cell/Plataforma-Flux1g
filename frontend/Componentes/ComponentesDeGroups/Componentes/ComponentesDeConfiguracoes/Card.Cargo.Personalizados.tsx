
import React, { useState } from 'react';
import { ModalPermissoes } from '../ComponentesModoHub/CriaçãoDeCard/Modal.Permissoes';
import { GroupRolePermissions, GroupRole } from '../../../../../tipos/types.Grupo'; // Importando a tipagem completa do cargo

interface CardCargoPersonalizadoProps {
    role: GroupRole;
    onEdit: (role: GroupRole) => void; // Para editar nome/cor
    onDelete: (roleId: string) => void;
}

// A responsabilidade de gerir as permissões de cada cargo
// ficará na página principal, mas o card terá um estado inicial se necessário.
const initialPermissions: GroupRolePermissions = {
    isAdmin: false,
    canEditGroupInfo: false,
    canManageRoles: false,
    canViewAuditLogs: false,
    canViewRevenue: false,
    canSendMessages: true,
    canDeleteMessages: false,
    canPinMessages: false,
    canBypassSlowMode: false,
    canKickMembers: false,
    canBanMembers: false,
    canApproveMembers: false,
    canInviteMembers: true,
    canManageFolders: false,
    canManageFiles: false,
    canPostScheduled: false,
    canManageAds: false,
    canToggleSlowMode: false,
    canSetSlowModeInterval: false,
    canCreateSubgroups: false,
    canManagePolls: false,
    canManageNotifications: false,
    canMentionEveryone: false,
};

export const CardCargoPersonalizado: React.FC<CardCargoPersonalizadoProps> = ({ role, onEdit, onDelete }) => {
    // O estado das permissões virá do `role.permissions`
    const [permissions, setPermissions] = useState<GroupRolePermissions>(role.permissions || initialPermissions);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Esta função agora deve sinalizar para a página principal que as permissões precisam ser atualizadas.
    const updatePermission = (key: keyof GroupRolePermissions) => {
        const newPermissions = { ...permissions, [key]: !permissions[key] };
        setPermissions(newPermissions);
        // Aqui, no futuro, você chamaria uma função do pai (ex: onUpdatePermissions(role.id, newPermissions))
    };

    return (
        <>
            <div className="bg-black/20 border border-white/10 rounded-2xl p-4 transition-all duration-300 hover:border-white/20">
                <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-4 h-4 rounded-full shadow-inner" style={{ backgroundColor: role.color }}></div>
                        <h3 className="font-bold text-white text-md">{role.name}</h3>
                    </div>
                    <div className="flex items-center space-x-1">
                        <button 
                            onClick={() => onEdit(role)} 
                            className="h-9 w-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-black hover:bg-[#00c2ff] transition-all duration-200"
                            aria-label={`Editar cargo ${role.name}`}
                        >
                            <i className="fa-solid fa-pen fa-xs"></i>
                        </button>
                        <button 
                            onClick={() => onDelete(role.id)} 
                            className="h-9 w-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-red-500/80 transition-all duration-200"
                            aria-label={`Deletar cargo ${role.name}`}
                        >
                            <i className="fa-solid fa-trash fa-xs"></i>
                        </button>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                     <p className="text-gray-400 text-sm">
                        Personalize as permissões deste cargo.
                    </p>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-white/10 hover:bg-white/20 text-white font-semibold py-2 px-3 rounded-lg transition-all duration-300 text-sm flex items-center space-x-2"
                    >
                         <i className="fa-solid fa-shield-halved"></i>
                         <span>Permissões</span>
                    </button>
                </div>
            </div>

            <ModalPermissoes 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                permissions={permissions} // Passa as permissões do estado
                onUpdatePermission={updatePermission}
            />
        </> 
    );
};
