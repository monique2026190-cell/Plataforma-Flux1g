
import React, { useState, useMemo } from 'react';
import { GroupRole } from '../../../../../tipos/types.Grupo';
import ModalSeletorCargo from '../ComponentesModoHub/Modal.Seletor.Cargo';

// --- TIPAGENS ---
interface Member {
    id: string;
    name: string;
    avatarUrl?: string;
    roleId: string | null;
}

interface CardDistribuicaoCargosProps {
    members: Member[];
    roles: GroupRole[];
    onUpdateMemberRole: (memberId: string, roleId: string | null) => void;
}

// --- COMPONENTES FILHO ---

// Componente para um único item de membro (SIMPLIFICADO)
const MemberItem: React.FC<{ 
    member: Member; 
    onSelectRole: () => void;
}> = ({ member, onSelectRole }) => (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-all duration-200">
        {/* Informações do Membro */}
        <div className="flex items-center gap-3">
            <img 
                src={member.avatarUrl || `https://ui-avatars.com/api/?name=${member.name}&background=random`}
                alt={`Avatar de ${member.name}`}
                className="w-10 h-10 rounded-full object-cover bg-black/20"
            />
            <span className="font-semibold text-white">{member.name}</span>
        </div>

        {/* Apenas o Botão de Ação Consistente */}
        <button
            onClick={onSelectRole}
            className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-black/20 border border-white/10 rounded-xl text-gray-400 hover:bg-[#00c2ff]/20 hover:text-[#00c2ff] hover:border-[#00c2ff]/50 transition-all duration-200"
            aria-label="Gerenciar cargo"
        >
            <i className="fa-solid fa-ellipsis"></i>
        </button>
    </div>
);

// Componente para uma secção de cargo (passa menos props para MemberItem agora)
const RoleSection: React.FC<{role: GroupRole | null, members: Member[], onOpenRoleSelector: (member: Member) => void}> = ({ role, members, onOpenRoleSelector }) => {
    if (members.length === 0) return null;

    return (
        <div className="mb-4">
            <div className="px-2 mb-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">
                    {role ? role.name : 'Sem Cargo'} - {members.length}
                </h3>
            </div>
            <div className="space-y-1">
                {members.map(member => (
                    <MemberItem 
                        key={member.id}
                        member={member}
                        onSelectRole={() => onOpenRoleSelector(member)}
                    />
                ))}
            </div>
        </div>
    );
};


// --- COMPONENTE PRINCIPAL (sem alterações de lógica) ---
const CardDistribuicaoCargos: React.FC<CardDistribuicaoCargosProps> = ({ members, roles, onUpdateMemberRole }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);

    const { membersByRole, totalFiltered } = useMemo(() => {
        const filtered = searchTerm
            ? members.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()))
            : members;

        const grouped: { [key: string]: Member[] } = {};
        filtered.forEach(member => {
            const roleKey = member.roleId || 'no-role';
            if (!grouped[roleKey]) { grouped[roleKey] = []; }
            grouped[roleKey].push(member);
        });

        return { membersByRole: grouped, totalFiltered: filtered.length };
    }, [members, searchTerm]);

    const sortedRoles = useMemo(() => roles.sort((a, b) => b.priority - a.priority), [roles]);

    const handleOpenRoleSelector = (member: Member) => {
        setSelectedMember(member);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedMember(null);
    };

    const handleSelectRole = (roleId: string | null) => {
        if (selectedMember) {
            onUpdateMemberRole(selectedMember.id, roleId);
        }
    };

    return (
        <>
            <div className="bg-black/20 border border-white/10 rounded-2xl p-4">
                <div className="mb-4">
                     <div className="relative">
                        <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"></i>
                        <input 
                            type="text"
                            placeholder="Pesquisar membros..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full bg-black/20 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00c2ff] transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-1 max-h-[500px] overflow-y-auto no-scrollbar pr-2 -mr-2">
                    {totalFiltered > 0 ? (
                        <>
                            {sortedRoles.map(role => (
                                <RoleSection 
                                    key={role.id}
                                    role={role}
                                    members={membersByRole[role.id] || []}
                                    onOpenRoleSelector={handleOpenRoleSelector}
                                />
                            ))}
                            <RoleSection 
                                role={null}
                                members={membersByRole['no-role'] || []}
                                onOpenRoleSelector={handleOpenRoleSelector}
                            />
                        </>
                    ) : (
                        <div className="text-center py-10 text-gray-500">
                            <p>Nenhum membro encontrado.</p>
                        </div>
                    )}
                </div>
            </div>

            {selectedMember && (
                <ModalSeletorCargo 
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    roles={roles}
                    onSelectRole={handleSelectRole}
                    memberName={selectedMember.name}
                />
            )}
        </>
    );
};

export default CardDistribuicaoCargos;
