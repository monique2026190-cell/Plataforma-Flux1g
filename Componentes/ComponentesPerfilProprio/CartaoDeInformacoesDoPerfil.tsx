import React from 'react';
import './CartaoDeInformacoesDoPerfil.css';
import { UserAvatar } from '../ComponenteDeInterfaceDeUsuario/user/UserAvatar';
import { Stat } from './Stat';

interface Props {
    avatar: string;
    nickname: string;
    username: string;
    bio: string;
    website: string;
    stats: {
        posts: number;
        followers: number;
        following: number;
    };
    isOwnProfile?: boolean;
    onAvatarClick?: () => void;
    onFollowersClick?: () => void;
    onFollowingClick?: () => void;
}

export const CartaoDeInformacoesDoPerfil: React.FC<Props> = ({ 
    avatar, 
    nickname, 
    username, 
    bio, 
    website,
    stats,
    isOwnProfile,
    onAvatarClick,
    onFollowersClick,
    onFollowingClick
}) => {
    // Função para formatar números grandes
    const formatStat = (num: number): string => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toString();
    };

    return (
        <div className="w-full max-w-[500px] mx-auto font-sans bg-transparent text-white p-4">
            {/* Seção do Avatar e Estatísticas */}
            <div className="flex items-center justify-between mb-4">
                <div onClick={onAvatarClick} className="cursor-pointer">
                    <UserAvatar size={"2xl"} src={avatar} />
                </div>
                <div className="flex justify-around flex-grow">
                    <Stat value={formatStat(stats.posts)} label="Posts" />
                    <Stat value={formatStat(stats.followers)} label="Seguidores" onClick={onFollowersClick} />
                    <Stat value={formatStat(stats.following)} label="Seguindo" onClick={onFollowingClick} />
                </div>
            </div>

            {/* Detalhes do Usuário */}
            <div className="text-left mb-4">
                <p className="font-bold text-lg">{nickname}</p>
                <p className="text-sm text-gray-400">{username}</p>
                {bio && <p className="text-base my-2">{bio}</p>}
                {website && 
                    <a 
                        href={website} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
                    >
                        {website}
                    </a>
                }
            </div>

            {/* Botões de Ação */}
            {isOwnProfile && (
                <div className="flex items-center space-x-2">
                    <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200">
                        Editar Perfil
                    </button>
                    <button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200">
                        Compartilhar Perfil
                    </button>
                </div>
            )}
        </div>
    );
};