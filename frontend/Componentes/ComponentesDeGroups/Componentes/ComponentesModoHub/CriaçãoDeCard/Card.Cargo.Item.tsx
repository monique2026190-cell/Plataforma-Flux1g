
import React, { useState } from 'react';
import { EntidadePermissions, ModalPermissoesEntidade } from './Modal.Permissoes.Entidade'; // Importando o novo modal
import { FaPen } from 'react-icons/fa';

// Props para o componente
interface CardCargoItemProps {
  nome: string;
}

// Permissões iniciais para um cargo de entidade
const initialPermissions: EntidadePermissions = {
    podeVer: true,
    podeEditar: false,
    podeDeletar: false,
    podeGerenciarConteudo: false,
};

const CardCargoItem: React.FC<CardCargoItemProps> = ({ nome }) => {
    const [permissions, setPermissions] = useState<EntidadePermissions>(initialPermissions);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const updatePermission = (key: keyof EntidadePermissions) => {
        setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <>
            <div 
                onClick={() => setIsModalOpen(true)}
                className="flex justify-between items-center bg-gray-900/50 p-4 rounded-lg border border-gray-700/60 hover:bg-gray-700/50 transition-all duration-200 cursor-pointer group"
            >
                <span className="text-white font-medium">{nome}</span>
                <div className="flex items-center gap-2 text-gray-500 group-hover:text-white transition-colors">
                  <FaPen size={12}/>
                  <span className='text-sm'>Editar</span>
                </div>
            </div>

            {/* Usando o novo Modal de Permissões de Entidade */}
            {isModalOpen && (
                <ModalPermissoesEntidade 
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    permissions={permissions}
                    onUpdatePermission={updatePermission}
                    nomeCargo={nome}
                    nomeEntidade="Pasta/Seção Atual" // Este nome seria dinâmico
                />
            )}
        </> 
    );
};

export default CardCargoItem;
