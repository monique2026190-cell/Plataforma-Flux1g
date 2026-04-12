
import React from 'react';

// --- Tipagens ---
export interface NotificationSettings {
    masterMute: boolean;
    mentionsAndReplies: boolean;
    newMessages: boolean;
    newMembers: boolean;
    groupAnnouncements: boolean;
}

interface CardConfiguracaoNotificacoesProps {
    settings: NotificationSettings;
    onSettingsChange: (newSettings: Partial<NotificationSettings>) => void;
}

// --- Componente de Toggle (Interruptor de Alternância) ---
const ToggleSwitch: React.FC<{ 
    checked: boolean; 
    onChange: (checked: boolean) => void; 
    disabled?: boolean; 
}> = ({ checked, onChange, disabled }) => {
    return (
        <button
            role="switch"
            aria-checked={checked}
            onClick={() => !disabled && onChange(!checked)}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ease-in-out ${
                disabled
                    ? 'cursor-not-allowed bg-gray-700'
                    : checked
                    ? 'bg-[#00c2ff]'
                    : 'bg-black bg-opacity-30'
            }`}
            disabled={disabled}
        >
            <span
                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out ${
                    checked ? 'translate-x-6' : 'translate-x-1'
                }`}
            />
        </button>
    );
};

// --- Componente de Item de Configuração ---
const SettingItem: React.FC<{
    icon: string;
    title: string;
    description: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
    isFirst?: boolean;
    isLast?: boolean;
}> = ({ icon, title, description, checked, onChange, disabled, isFirst, isLast }) => (
    <div className={`flex items-center justify-between p-4 ${!isFirst && 'border-t border-white border-opacity-5'}`}>
        <div className="flex items-center gap-4">
            <i className={`${icon} text-xl w-6 text-center ${disabled ? 'text-gray-600' : 'text-gray-400'}`}></i>
            <div>
                <h3 className={`font-semibold ${disabled ? 'text-gray-600' : 'text-white'}`}>{title}</h3>
                <p className={`text-sm max-w-md ${disabled ? 'text-gray-700' : 'text-gray-500'}`}>{description}</p>
            </div>
        </div>
        <ToggleSwitch checked={checked} onChange={onChange} disabled={disabled} />
    </div>
);

// --- Componente Principal ---
const CardConfiguracaoNotificacoes: React.FC<CardConfiguracaoNotificacoesProps> = ({ settings, onSettingsChange }) => {

    return (
        <div className="bg-white bg-opacity-5 border border-white border-opacity-10 rounded-2xl overflow-hidden">
             <SettingItem
                icon="fa-solid fa-bell-slash"
                title="Pausar Tudo"
                description="Suspende temporariamente todas as notificações deste grupo."
                checked={settings.masterMute}
                onChange={(checked) => onSettingsChange({ masterMute: checked })}
                isFirst
            />
            
            <div className={`${settings.masterMute ? 'opacity-40 pointer-events-none' : ''}`}>
                 <SettingItem
                    icon="fa-solid fa-at"
                    title="Menções e Respostas"
                    description="Seja notificado quando mencionarem você ou responderem suas mensagens."
                    checked={settings.mentionsAndReplies}
                    onChange={(checked) => onSettingsChange({ mentionsAndReplies: checked })}
                    disabled={settings.masterMute}
                />
                 <SettingItem
                    icon="fa-solid fa-comments"
                    title="Atividade de Mensagens"
                    description="Receba notificações sobre novas mensagens no grupo."
                    checked={settings.newMessages}
                    onChange={(checked) => onSettingsChange({ newMessages: checked })}
                    disabled={settings.masterMute}
                />
                 <SettingItem
                    icon="fa-solid fa-user-plus"
                    title="Entrada de Membros"
                    description="Saiba quando novos membros se juntam ao grupo."
                    checked={settings.newMembers}
                    onChange={(checked) => onSettingsChange({ newMembers: checked })}
                    disabled={settings.masterMute}
                    isLast
                />
            </div>
        </div>
    );
};

export default CardConfiguracaoNotificacoes;
