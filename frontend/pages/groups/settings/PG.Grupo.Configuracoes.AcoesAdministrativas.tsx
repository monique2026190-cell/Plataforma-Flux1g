
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CabecalhoConfiguracaoInformacao } from '../../../Componentes/cabeçalhos/Cabecalho.Configuracao.Informacao';
import CardPunicaoMembros from '../../../Componentes/ComponentesDeGroups/Componentes/ComponentesDeConfiguracoesDeGrupo/Card.Punicao.Membros';
import { PunishmentType } from '../../../Componentes/ComponentesDeGroups/Componentes/ComponentesModoHub/Modal.Punicao.Membro';

// Tipagem para um membro (deve corresponder à do card)
interface Member {
    id: string;
    name: string;
    avatarUrl?: string;
    warnings: number;
}

// -- Mock Data Atualizada --
const initialMembers: Member[] = [
    { id: '1', name: 'Ana de Almeida', warnings: 1, avatarUrl: 'https://randomuser.me/api/portraits/women/1.jpg' },
    { id: '2', name: 'Beto Malfacini', warnings: 0, avatarUrl: 'https://randomuser.me/api/portraits/men/2.jpg' },
    { id: '3', name: 'Carla Zambelli', warnings: 3, avatarUrl: 'https://randomuser.me/api/portraits/women/3.jpg' },
    { id: '4', name: 'David Luis', warnings: 0, avatarUrl: 'https://randomuser.me/api/portraits/men/4.jpg' },
    { id: '5', name: 'Helena de Troia', warnings: 0, avatarUrl: 'https://randomuser.me/api/portraits/women/5.jpg' },
];

// --- Página Principal ---
export const PGGrupoConfiguracoesAcoesAdministrativas: React.FC = () => {
    const navigate = useNavigate();
    const [members, setMembers] = useState<Member[]>(initialMembers);

    const handlePunishMember = (memberId: string, punishment: PunishmentType, duration?: number) => {
        console.log(`Punindo membro ${memberId} com ${punishment}`, { duration });

        switch (punishment) {
            case 'warn':
                setMembers(prev => prev.map(m => m.id === memberId ? { ...m, warnings: m.warnings + 1 } : m));
                // Lógica de API para advertir
                break;
            case 'mute':
                console.log(`Membro ${memberId} silenciado por ${duration} minutos.`);
                // Lógica de API para silenciar
                break;
            case 'kick':
                setMembers(prev => prev.filter(m => m.id !== memberId));
                // Lógica de API para expulsar
                break;
            case 'ban':
                setMembers(prev => prev.filter(m => m.id !== memberId));
                // Lógica de API para banir
                break;
            default:
                console.warn('Tipo de punição desconhecido.');
        }
    };

    const handleSaveChanges = () => {
        console.log('Salvando estado final dos membros:', members);
        alert('Ações administrativas salvas! (Simulação)');
    };

    return (
        <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#0c0f14,_#0a0c10)] text-white font-['Inter'] flex flex-col">
            <CabecalhoConfiguracaoInformacao titulo="Ações Administrativas" onBack={() => navigate(-1)} />

            <main className="pt-[85px] pb-[120px] w-full max-w-2xl mx-auto px-5 overflow-y-auto flex-grow no-scrollbar">
                {/* O novo card substitui a lista antiga */}
                <CardPunicaoMembros 
                    members={members}
                    onPunish={handlePunishMember}
                />
            </main>

            <footer className="fixed bottom-0 left-0 right-0 bg-[#0c0f14]/80 backdrop-blur-sm z-30">
                <div className="max-w-2xl mx-auto p-4">
                    <button
                        onClick={handleSaveChanges}
                        className="w-full bg-[#00c2ff] text-black font-bold py-3.5 px-4 rounded-xl hover:bg-white transition-all duration-300 shadow-[0_4px_20px_rgba(0,194,255,0.4)]"
                    >
                        Salvar Alterações
                    </button>
                </div>
            </footer>
        </div>
    );
};
