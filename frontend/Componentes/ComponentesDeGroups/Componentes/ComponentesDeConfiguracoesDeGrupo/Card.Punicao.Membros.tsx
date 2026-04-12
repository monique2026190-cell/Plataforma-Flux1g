
import React, { useState } from 'react';
import ModalPunicaoMembro, { PunishmentType } from '../ComponentesModoHub/Modal.Punicao.Membro';

// Tipagem para um membro
interface Member {
    id: string;
    name: string;
    avatarUrl?: string;
    warnings: number;
}

// Props para o card
interface CardPunicaoMembrosProps {
    members: Member[];
    onPunish: (memberId: string, punishment: PunishmentType, duration?: number) => void;
}

// --- Componente do Item do Membro ---
const MemberItem: React.FC<{ member: Member; onPunish: () => void; }> = ({ member, onPunish }) => (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-all duration-200">
        <div className="flex items-center gap-3">
            <img 
                src={member.avatarUrl || `https://ui-avatars.com/api/?name=${member.name}&background=random`}
                alt={`Avatar de ${member.name}`}
                className="w-10 h-10 rounded-full object-cover bg-black/20"
            />
            <div>
                <span className="font-semibold text-white">{member.name}</span>
                <p className="text-xs text-yellow-400/70">{member.warnings} {member.warnings === 1 ? 'Advertência' : 'Advertências'}</p>
            </div>
        </div>
        <button
            onClick={onPunish}
            className="bg-red-500/10 border border-red-500/30 text-red-400 font-bold py-2 px-4 rounded-lg hover:bg-red-500/20 transition-all duration-300"
            aria-label={`Punir ${member.name}`}>
            <i className="fa-solid fa-gavel mr-2"></i>
            Punir
        </button>
    </div>
);

// --- Componente Principal do Card ---
const CardPunicaoMembros: React.FC<CardPunicaoMembrosProps> = ({ members, onPunish }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);

    const filteredMembers = members.filter(member => 
        member.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenModal = (member: Member) => {
        setSelectedMember(member);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedMember(null);
    };

    const handleConfirmPunishment = (punishment: PunishmentType, duration?: number) => {
        if (selectedMember) {
            onPunish(selectedMember.id, punishment, duration);
        }
    };

    return (
        <>
            <div className="bg-black/20 border border-white/10 rounded-2xl p-4">
                {/* Cabeçalho com campo de pesquisa */}
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

                {/* Lista de Membros */}
                <div className="space-y-1 max-h-[500px] overflow-y-auto no-scrollbar pr-1 -mr-1">
                    {filteredMembers.length > 0 ? (
                        filteredMembers.map(member => (
                            <MemberItem 
                                key={member.id}
                                member={member}
                                onPunish={() => handleOpenModal(member)}
                            />
                        ))
                    ) : (
                        <div className="text-center py-10 text-gray-500">
                            <p>Nenhum membro encontrado.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de Punição Integrado */}
            <ModalPunicaoMembro 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                member={selectedMember}
                onConfirm={handleConfirmPunishment}
            />
        </>
    );
};

export default CardPunicaoMembros;
