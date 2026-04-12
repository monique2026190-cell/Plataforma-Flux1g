
import React from 'react';

// --- Tipagens ---
interface SlowModeEntrySettings {
    enabled: boolean;
    interval: number; // em segundos
}

interface CardModoLentoEntradaProps {
    settings: SlowModeEntrySettings;
    onSettingsChange: (newSettings: Partial<SlowModeEntrySettings>) => void;
}

// --- Componente de Toggle (Interruptor de Alternância) ---
const ToggleSwitch: React.FC<{ 
    checked: boolean; 
    onChange: (checked: boolean) => void; 
}> = ({ checked, onChange }) => {
    return (
        <button
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ease-in-out ${
                checked ? 'bg-[#00c2ff]' : 'bg-black bg-opacity-30'
            }`}
        >
            <span
                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200 ease-in-out ${
                    checked ? 'translate-x-6' : 'translate-x-1'
                }`}
            />
        </button>
    );
};


// --- Componente Principal ---
const CardModoLentoEntrada: React.FC<CardModoLentoEntradaProps> = ({ settings, onSettingsChange }) => {
    const timePresets = [
        { label: '1m', value: 60 },
        { label: '5m', value: 300 },
        { label: '10m', value: 600 },
        { label: '1h', value: 3600 },
        { label: '12h', value: 43200 },
        { label: '24h', value: 86400 },
    ];

    const handleToggle = (enabled: boolean) => {
        onSettingsChange({ enabled });
    };

    const handleIntervalChange = (interval: number) => {
        onSettingsChange({ interval });
    };

    return (
        <div className="bg-black/20 border border-white/10 rounded-2xl overflow-hidden">
            <div className="p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="font-semibold text-white text-base">Modo Lento de Entrada</h3>
                        <p className="text-sm text-gray-400/80 mt-1">
                            Controle o intervalo de tempo para novas entradas de membros.
                        </p>
                    </div>
                    <ToggleSwitch checked={settings.enabled} onChange={handleToggle} />
                </div>

                {settings.enabled && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                        <label className="block text-sm font-medium text-gray-400 mb-3">
                            Intervalo Mínimo por Entrada
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {timePresets.map(preset => (
                                <button
                                    key={preset.value}
                                    onClick={() => handleIntervalChange(preset.value)}
                                    className={`px-3.5 py-1.5 text-sm font-bold rounded-lg transition-all duration-200 ${
                                        settings.interval === preset.value
                                            ? 'bg-[#00c2ff] text-black shadow-[0_2px_10px_rgba(0,194,255,0.3)]'
                                            : 'bg-white/5 text-white hover:bg-white/10'
                                    }`}
                                >
                                    {preset.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CardModoLentoEntrada;
