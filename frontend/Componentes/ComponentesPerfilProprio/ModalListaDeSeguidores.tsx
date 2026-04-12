import React, { useState } from 'react';

interface FollowListModalProps {
    isOpen: boolean;
    onClose: () => void;
    users: any[];
    title: string;
}

export const ModalListaDeSeguidores: React.FC<FollowListModalProps> = ({ isOpen, onClose, users, title }) => {
    const [searchTerm, setSearchTerm] = useState('');

    if (!isOpen) return null;

    const filteredUsers = users.filter(user =>
        user.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-gray-800 rounded-lg shadow-xl max-w-sm w-full mx-4 flex flex-col" style={{maxHeight: '90vh'}}>
                <div className="flex justify-between items-center p-4 border-b border-gray-700">
                    <h2 className="text-lg font-bold text-white">{title}</h2>
                    <button onClick={onClose} className="text-white text-2xl">&times;</button>
                </div>
                
                <div className="p-4 border-b border-gray-700">
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <i className="fa-solid fa-search text-gray-400"></i>
                        </span>
                        <input
                            type="text"
                            placeholder="Pesquisar..."
                            className="w-full bg-gray-700 text-white rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="p-4 overflow-y-auto">
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map(user => (
                            <div key={user.id} className="flex items-center mb-4 transition duration-200 hover:bg-gray-700 p-2 rounded-lg">
                                <img src={user.avatar} alt={user.nickname} className="w-12 h-12 rounded-full mr-4" />
                                <div>
                                    <p className="font-bold text-white">{user.nickname}</p>
                                    <p className="text-gray-400 text-sm">{user.username}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-400 py-4">Nenhum usuário encontrado.</p>
                    )}
                </div>
            </div>
        </div>
    );
};
