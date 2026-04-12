
import React, { useState } from 'react';
import { ModalPermissoes } from './Modal.Permissoes'; // Corrigido: importando o modal correto
import { GroupRolePermissions } from '../../../../../tipos/types.Grupo';

// Estado inicial para as permissões do cargo de entrada, usando a tipagem correta
const initialPermissions: GroupRolePermissions = {
    isAdmin: false,
    canEditGroupInfo: false,
    canManageRoles: false,
    canViewAuditLogs: false,
    canViewRevenue: false,
    canSendMessages: true, // Por padrão, novos membros podem enviar mensagens
    canDeleteMessages: false,
    canPinMessages: false,
    canBypassSlowMode: false,
    canKickMembers: false,
    canBanMembers: false,
    canApproveMembers: false,
    canInviteMembers: true, // Por padrão, novos membros podem convidar outros
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

// Componente Principal do Card do Cargo Padrão
const CardCargoPadrao: React.FC = () => {
    const [permissions, setPermissions] = useState<GroupRolePermissions>(initialPermissions);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Função para atualizar uma permissão específica
    const updatePermission = (key: keyof GroupRolePermissions) => {
        setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <>
            <div className="bg-black/20 border border-white/10 rounded-2xl p-5">
                <div className="flex justify-between items-center">
                    <div className="flex-grow pr-4">
                        <h3 className="text-lg font-bold text-white">Cargo Padrão de Entrada</h3>
                        <p className="text-gray-400 text-sm mt-1">
                            Este será o cargo atribuído automaticamente a novos membros.
                        </p>
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="flex-shrink-0 bg-white/10 hover:bg-white/20 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 flex items-center space-x-2"
                    >
                         <i className="fa-solid fa-shield-halved"></i>
                         <span>Permissões</span>
                    </button>
                </div>
            </div>

            {/* Modal de Permissões de Cargo (o correto) */}
            <ModalPermissoes 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                permissions={permissions}
                onUpdatePermission={updatePermission}
            />
        </>
    );
};

export default CardCargoPadrao;
