
import React, { useState } from 'react';
import { FaWrench, FaUsersCog, FaArrowLeft } from 'react-icons/fa';
import CardCargoPadrao from './CriaçãoDeCard/Card.Cargo.Padrao';
import CardCargoItem from './CriaçãoDeCard/Card.Cargo.Item';

// Tipos de view para o modal
type ModalView = 'main' | 'acoes' | 'cargos';

interface ModalGestaoProps {
  titulo: string;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

// --- Componente de Botão de Seleção (Tela Principal) --- //
const SelectionButton = ({ label, description, icon, onClick }: { label: string, description: string, icon: React.ReactNode, onClick: () => void }) => (
    <button 
        onClick={onClick}
        className="w-full text-left bg-gray-900/50 hover:bg-gray-700/50 border border-gray-700/60 rounded-lg p-5 transition-all duration-200 flex items-center gap-5"
    >
        <div className="text-[#00c2ff]">{icon}</div>
        <div>
            <h4 className="font-bold text-white text-lg">{label}</h4>
            <p className="text-gray-400 text-sm">{description}</p>
        </div>
    </button>
);


// --- Componente Principal do Modal --- //
const ModalGestao: React.FC<ModalGestaoProps> = ({ titulo, onClose, onEdit, onDelete }) => {
  const [view, setView] = useState<ModalView>('main');

  const handleModalContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Dados de exemplo para outros cargos
  const outrosCargos = [{ nome: 'Administrador' }, { nome: 'Membro' }];

  const getTitle = () => {
    if (view === 'acoes') return 'Ações Rápidas';
    if (view === 'cargos') return 'Gerenciar Cargos';
    return `Gerenciar "${titulo}"`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div 
        className="bg-gray-800 rounded-xl shadow-xl w-full max-w-lg flex flex-col border border-gray-700 max-h-[90vh]" 
        onClick={handleModalContentClick}
      >
        {/* Cabeçalho Dinâmico */}
        <div className="flex items-center p-5 border-b border-gray-700/60">
          {view !== 'main' && (
            <button onClick={() => setView('main')} className="text-gray-400 hover:text-white transition-colors mr-4">
              <FaArrowLeft size={18} />
            </button>
          )}
          <h3 className="flex-1 text-xl font-bold text-white">{getTitle()}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors ml-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        {/* Conteúdo Dinâmico */}
        <div className="p-6 overflow-y-auto animate-fade-in-fast">
          {view === 'main' && (
            <div className="space-y-4">
              <SelectionButton 
                label="Ações" 
                description="Editar ou deletar esta entidade."
                icon={<FaWrench size={24}/>}
                onClick={() => setView('acoes')}
              />
              <SelectionButton 
                label="Cargos e Permissões"
                description="Definir quem pode ver e interagir."
                icon={<FaUsersCog size={24}/>}
                onClick={() => setView('cargos')}
              />
            </div>
          )}

          {view === 'acoes' && (
            <div className="flex flex-col gap-4">
                <button onClick={onEdit} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition-all transform hover:scale-105">
                    Editar
                </button>
                <button onClick={onDelete} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-md transition-all transform hover:scale-105">
                    Deletar
                </button>
            </div>
          )}

          {view === 'cargos' && (
            <div className="space-y-4">
              <CardCargoPadrao />
              <h4 className="text-lg font-semibold text-white pt-4 border-t border-gray-700/60">Cargos Personalizados</h4>
              {outrosCargos.map(cargo => (
                <CardCargoItem key={cargo.nome} nome={cargo.nome} />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default ModalGestao;
