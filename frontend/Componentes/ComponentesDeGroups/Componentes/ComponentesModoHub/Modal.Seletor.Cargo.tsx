
import React from 'react';
import { GroupRole } from '../../../../tipos/types.Grupo';

interface ModalSeletorCargoProps {
    isOpen: boolean;
    onClose: () => void;
    roles: GroupRole[];
    onSelectRole: (roleId: string | null) => void;
    memberName: string; // Adicionado para personalizar o título
}

const ModalSeletorCargo: React.FC<ModalSeletorCargoProps> = ({ isOpen, onClose, roles, onSelectRole, memberName }) => {
    if (!isOpen) return null;

    const handleSelect = (roleId: string | null) => {
        onSelectRole(roleId);
        onClose();
    };

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300"
            onClick={onClose}
        >
            <div 
                className="bg-[#1a1f29] border border-white/10 rounded-2xl p-6 w-full max-w-sm shadow-2xl transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale"
                onClick={e => e.stopPropagation()} // Impede o fecho ao clicar dentro do modal
            >
                <h2 className="text-xl font-bold mb-2 text-white">Atribuir Cargo</h2>
                <p className="text-gray-400 mb-6">Selecione um novo cargo para <span className="font-semibold text-white">{memberName}</span>.</p>

                <div className="space-y-2 max-h-60 overflow-y-auto no-scrollbar pr-2 -mr-2">
                    {roles.map(role => (
                        <button
                            key={role.id}
                            onClick={() => handleSelect(role.id)}
                            className="w-full flex items-center gap-3 text-left p-3 rounded-lg hover:bg-white/10 transition-all duration-200"
                        >
                            <div 
                                className="w-5 h-5 rounded-full shadow-inner"
                                style={{ backgroundColor: role.color }}
                            ></div>
                            <span className="font-semibold text-white">{role.name}</span>
                        </button>
                    ))}
                </div>

                <div className="mt-6 border-t border-white/10 pt-4 space-y-3">
                     <button
                        onClick={() => handleSelect(null)} // `null` para remover o cargo
                        className="w-full bg-red-500/10 text-red-400 font-bold py-3 px-4 rounded-lg hover:bg-red-500/20 transition-all duration-300"
                    >
                        <i className="fa-solid fa-times mr-2"></i>
                        Remover Cargo
                    </button>
                    <button 
                        onClick={onClose}
                        className="w-full bg-black/20 hover:bg-white/10 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300"
                    >
                        Cancelar
                    </button>
                </div>
            </div>

            {/* Animações em CSS para o modal */}
            <style>{`
                @keyframes fadeInScale {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in-scale {
                    animation: fadeInScale 0.2s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default ModalSeletorCargo;
