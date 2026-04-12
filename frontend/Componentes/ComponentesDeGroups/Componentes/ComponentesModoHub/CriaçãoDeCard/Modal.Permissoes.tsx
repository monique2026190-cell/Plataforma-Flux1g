
import React from 'react';
import { GroupRolePermissions } from '../../../../../tipos/types.Grupo';
import { PermissionToggle } from '../../ComponentesDeConfiguracoesDeGrupo/roles/PermissionToggle';

// Componente para agrupar e destacar seções de permissões
const PermissionSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="bg-black/20 rounded-xl p-4 mb-4">
        <h4 className="text-md font-bold text-[#00c2ff] mb-3">
            {title}
        </h4>
        <div className="space-y-2">
            {children}
        </div>
    </div>
);

// Componente do Modal de Permissões
export const ModalPermissoes = ({
    isOpen,
    onClose,
    permissions,
    onUpdatePermission
}: {
    isOpen: boolean;
    onClose: () => void;
    permissions: GroupRolePermissions;
    onUpdatePermission: (key: keyof GroupRolePermissions) => void;
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-fast">
            <div className="bg-[#141820] border border-white/10 rounded-2xl p-6 w-full max-w-lg m-4 flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-xl font-bold text-white">Permissões do Cargo Padrão</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <i className="fa-solid fa-times text-xl"></i>
                    </button>
                </div>
                
                <p className="text-gray-400 text-sm mb-6">
                    Estas permissões serão aplicadas a todos os novos membros.
                </p>

                <div className="overflow-y-auto pr-2 -mr-2 space-y-1 no-scrollbar">
                    <PermissionSection title="Mensagens">
                        <PermissionToggle label="Enviar Mensagens" active={permissions.canSendMessages} onToggle={() => onUpdatePermission('canSendMessages')} />
                        <PermissionToggle label="Apagar Mensagens de Terceiros" active={permissions.canDeleteMessages} onToggle={() => onUpdatePermission('canDeleteMessages')} />
                        <PermissionToggle label="Fixar Mensagens" active={permissions.canPinMessages} onToggle={() => onUpdatePermission('canPinMessages')} />
                        <PermissionToggle label="Mencionar @todos" active={permissions.canMentionEveryone} onToggle={() => onUpdatePermission('canMentionEveryone')} />
                    </PermissionSection>

                    <PermissionSection title="Moderação de Membros">
                        <PermissionToggle label="Convidar Novos Membros" active={permissions.canInviteMembers} onToggle={() => onUpdatePermission('canInviteMembers')} />
                        <PermissionToggle label="Expulsar Membros" active={permissions.canKickMembers} onToggle={() => onUpdatePermission('canKickMembers')} />
                        <PermissionToggle label="Banir Membros" active={permissions.canBanMembers} onToggle={() => onUpdatePermission('canBanMembers')} danger />
                    </PermissionSection>

                    <PermissionSection title="Controle de Chat">
                        <PermissionToggle label="Ativar/Desativar Modo Lento" active={permissions.canToggleSlowMode} onToggle={() => onUpdatePermission('canToggleSlowMode')} />
                        <PermissionToggle label="Definir Intervalo do Modo Lento" active={permissions.canSetSlowModeInterval} onToggle={() => onUpdatePermission('canSetSlowModeInterval')} />
                        <PermissionToggle label="Ignorar Modo Lento" active={permissions.canBypassSlowMode} onToggle={() => onUpdatePermission('canBypassSlowMode')} />
                    </PermissionSection>

                    <PermissionSection title="Gerenciamento do Grupo">
                        <PermissionToggle label="Editar Informações do Grupo" active={permissions.canEditGroupInfo} onToggle={() => onUpdatePermission('canEditGroupInfo')} />
                        <PermissionToggle label="Criar Subgrupos (Canais)" active={permissions.canCreateSubgroups} onToggle={() => onUpdatePermission('canCreateSubgroups')} />
                        <PermissionToggle label="Gerenciar Mídia" active={permissions.canManageFiles} onToggle={() => onUpdatePermission('canManageFiles')} />
                        <PermissionToggle label="Gerenciar Enquetes" active={permissions.canManagePolls} onToggle={() => onUpdatePermission('canManagePolls')} />
                        <PermissionToggle label="Gerenciar Notificações" active={permissions.canManageNotifications} onToggle={() => onUpdatePermission('canManageNotifications')} />
                        <PermissionToggle label="Gerenciar Cargos" active={permissions.canManageRoles} onToggle={() => onUpdatePermission('canManageRoles')} />
                    </PermissionSection>

                    <PermissionSection title="Administração Avançada">
                        <PermissionToggle label="Administrador Geral (Perigoso)" active={permissions.isAdmin} onToggle={() => onUpdatePermission('isAdmin')} danger />
                    </PermissionSection>
                </div>

                 <div className="mt-6 pt-4 border-t border-white/10">
                    <button onClick={onClose} className="w-full bg-[#00c2ff] text-black font-bold py-3 px-4 rounded-xl hover:bg-white transition-all duration-300 shadow-[0_4px_20px_rgba(0,194,255,0.4)]">
                        Salvar Alterações
                    </button>
                </div>
            </div>
        </div>
    );
};
