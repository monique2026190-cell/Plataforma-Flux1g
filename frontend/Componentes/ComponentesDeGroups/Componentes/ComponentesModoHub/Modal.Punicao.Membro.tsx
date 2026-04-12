
import React, { useState } from 'react';

// Tipagem para um membro, para que o modal saiba com quem está a lidar
interface Member {
    id: string;
    name: string;
    avatarUrl?: string;
    warnings: number;
}

// Tipos de Punição
type PunishmentType = 'warn' | 'mute' | 'kick' | 'ban';

interface ModalPunicaoMembroProps {
    isOpen: boolean;
    onClose: () => void;
    member: Member | null;
    onConfirm: (punishment: PunishmentType, duration?: number) => void; // Duração em minutos
}

const ModalPunicaoMembro: React.FC<ModalPunicaoMembroProps> = ({ isOpen, onClose, member, onConfirm }) => {
    const [selectedPunishment, setSelectedPunishment] = useState<PunishmentType | null>(null);
    const [muteDuration, setMuteDuration] = useState(60); // Padrão de 60 minutos

    if (!isOpen || !member) return null;

    const handleConfirm = () => {
        if (selectedPunishment) {
            const duration = selectedPunishment === 'mute' ? muteDuration : undefined;
            onConfirm(selectedPunishment, duration);
            onClose(); // Fecha o modal após confirmar
        }
    };

    const punishments = [
        { id: 'warn', label: 'Advertir Membro', icon: 'fa-triangle-exclamation', color: 'yellow' },
        { id: 'mute', label: 'Silenciar Membro', icon: 'fa-microphone-slash', color: 'blue' },
        { id: 'kick', label: 'Expulsar do Grupo', icon: 'fa-right-from-bracket', color: 'orange' },
        { id: 'ban', label: 'Banir Permanentemente', icon: 'fa-gavel', color: 'red' },
    ] as const;

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300"
            onClick={onClose}
        >
            <div 
                className="bg-[#1a1f29] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex items-center gap-4 mb-6">
                    <img 
                        src={member.avatarUrl || `https://ui-avatars.com/api/?name=${member.name}&background=random`}
                        alt={`Avatar de ${member.name}`}
                        className="w-14 h-14 rounded-full object-cover bg-black/20"
                    />
                    <div>
                        <h2 className="text-xl font-bold text-white">Punir Membro</h2>
                        <p className="text-gray-400">Você está a aplicar uma punição a <span className="font-semibold text-white">{member.name}</span>.</p>
                    </div>
                </div>

                <div className="space-y-3">
                    {punishments.map(p => (
                        <button 
                            key={p.id}
                            onClick={() => setSelectedPunishment(p.id)}
                            className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 ${selectedPunishment === p.id ? `border-${p.color}-500 bg-${p.color}-500/10` : 'border-white/10 bg-black/20 hover:bg-white/5'}`}>
                            <i className={`fa-solid ${p.icon} text-xl text-${p.color}-400 w-6 text-center`}></i>
                            <span className="font-semibold text-white">{p.label}</span>
                        </button>
                    ))}
                </div>

                {/* Campo de duração para a opção 'Silenciar' */}
                {selectedPunishment === 'mute' && (
                     <div className="mt-4 p-4 bg-black/20 rounded-lg animate-fade-in-fast">
                         <label htmlFor="mute-duration" className="block text-sm font-semibold text-gray-300 mb-2">Duração do Silenciamento (em minutos)</label>
                         <input 
                            id="mute-duration"
                            type="number"
                            value={muteDuration}
                            onChange={e => setMuteDuration(parseInt(e.target.value))}
                            className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#00c2ff]"
                         />
                     </div>
                )}

                <div className="mt-6 pt-4 border-t border-white/10 flex gap-3">
                    <button 
                        onClick={onClose}
                        className="w-full bg-black/20 hover:bg-white/10 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={handleConfirm}
                        disabled={!selectedPunishment}
                        className="w-full font-bold py-3 px-4 rounded-lg transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed bg-red-600 text-white hover:bg-red-700 disabled:bg-red-500/40"
                    >
                        Confirmar Punição
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes fadeInScale { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
                .animate-fade-in-scale { animation: fadeInScale 0.2s ease-out forwards; }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                .animate-fade-in-fast { animation: fadeIn 0.3s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default ModalPunicaoMembro;
