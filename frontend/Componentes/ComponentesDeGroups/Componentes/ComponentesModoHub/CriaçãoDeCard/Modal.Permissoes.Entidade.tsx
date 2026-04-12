
import React from 'react';
import { PermissionToggle } from '../../ComponentesDeConfiguracoesDeGrupo/roles/PermissionToggle';

// Interface para as permissões específicas de uma entidade (pasta, seção)
export interface EntidadePermissions {
    podeVer: boolean;
    podeEditar: boolean;
    podeDeletar: boolean;
    podeGerenciarConteudo: boolean;
}

// Props para o componente do modal
interface ModalPermissoesEntidadeProps {
    isOpen: boolean;
    onClose: () => void;
    permissions: EntidadePermissions;
    onUpdatePermission: (key: keyof EntidadePermissions) => void;
    nomeCargo: string; 
    nomeEntidade: string;
}

// Componente do Modal
export const ModalPermissoesEntidade: React.FC<ModalPermissoesEntidadeProps> = ({ 
    isOpen, 
    onClose, 
    permissions, 
    onUpdatePermission, 
    nomeCargo,
    nomeEntidade
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60] animate-fade-in-fast">
            <div className="bg-[#141820] border border-white/10 rounded-2xl p-6 w-full max-w-md m-4 flex flex-col max-h-[90vh]">
                {/* Cabeçalho */}
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-bold text-white">Permissões de "{nomeCargo}"</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <i className="fa-solid fa-times text-xl"></i>
                    </button>
                </div>
                <p className="text-gray-400 text-sm mb-6">
                    Controle o que este cargo pode fazer com a entidade "{nomeEntidade}".
                </p>

                {/* Lista de Permissões */}
                <div className="overflow-y-auto space-y-2">
                    <div className="bg-black/20 rounded-xl p-4">
                        <div className="space-y-2">
                            <PermissionToggle label="Ver Pasta / Seção" active={permissions.podeVer} onToggle={() => onUpdatePermission('podeVer')} />
                            <PermissionToggle label="Editar Pasta / Seção" active={permissions.podeEditar} onToggle={() => onUpdatePermission('podeEditar')} />
                            <PermissionToggle label="Deletar Pasta / Seção" active={permissions.podeDeletar} onToggle={() => onUpdatePermission('podeDeletar')} danger />
                            <PermissionToggle label="Gerenciar Conteúdo Interno" active={permissions.podeGerenciarConteudo} onToggle={() => onUpdatePermission('podeGerenciarConteudo')} />
                        </div>
                    </div>
                </div>

                {/* Rodapé */}
                 <div className="mt-6 pt-4 border-t border-white/10">
                    <button onClick={onClose} className="w-full bg-[#00c2ff] text-black font-bold py-3 px-4 rounded-xl hover:bg-white transition-all duration-300 shadow-[0_4px_20px_rgba(0,194,255,0.4)]">
                        Salvar Alterações
                    </button>
                </div>
            </div>
        </div>
    );
};
