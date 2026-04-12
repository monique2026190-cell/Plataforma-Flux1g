
import React, { useState } from 'react';
import { User, Crown } from 'lucide-react';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface UserAvatarProps {
    src?: string;
    alt?: string;
    size?: AvatarSize;
    isVip?: boolean;
    className?: string;
    onClick?: (e: React.MouseEvent) => void;
}

const sizeMap: Record<AvatarSize, string> = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-[100px] h-[100px]'
};

const iconSizeMap: Record<AvatarSize, number> = {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 32,
    xl: 50
};

export const UserAvatar: React.FC<UserAvatarProps> = ({ 
    src, 
    alt = 'User', 
    size = 'md', 
    isVip = false,
    className = '',
    onClick 
}) => {
    const [hasError, setHasError] = useState(false);

    const baseClasses = `rounded-full flex-shrink-0 flex items-center justify-center border overflow-hidden transition-all ${sizeMap[size]} ${className}`;
    const borderClass = isVip ? 'border-[#FFD700] shadow-[0_0_10px_rgba(255,215,0,0.2)]' : 'border-white/10';
    const bgClass = 'bg-[#1e2531]';

    const Icon = isVip ? Crown : User;
    const iconColor = isVip ? '#FFD700' : '#00c2ff';

    if (src && !hasError) {
        return (
            <div className={`${baseClasses} ${borderClass} ${bgClass} ${onClick ? 'cursor-pointer' : ''}`} onClick={onClick}>
                <img 
                    src={src} 
                    alt={alt} 
                    onError={() => setHasError(true)}
                    className="w-full h-full object-cover"
                    loading="lazy"
                />
            </div>
        );
    }

    return (
        <div className={`${baseClasses} ${borderClass} ${bgClass} ${onClick ? 'cursor-pointer' : ''}`} onClick={onClick}>
            <Icon size={iconSizeMap[size]} color={iconColor} />
        </div>
    );
};
