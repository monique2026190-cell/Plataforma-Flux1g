
import React, { useState } from 'react';

// Tipos para o Pixel
interface Pixel {
    id: string; // ID único para o item na lista
    platform: 'meta' | 'google' | 'tiktok';
    pixelId: string;
}

const platformDetails = {
    meta: { name: 'Meta Ads', icon: 'fa-brands fa-meta' },
    google: { name: 'Google Ads', icon: 'fa-brands fa-google' },
    tiktok: { name: 'TikTok Ads', icon: 'fa-brands fa-tiktok' },
};

export const CardPixelsConectados: React.FC = () => {
    const [pixels, setPixels] = useState<Pixel[]>([
        // Exemplo inicial
        { id: '1', platform: 'meta', pixelId: '123456789012345' },
    ]);
    const [isAdding, setIsAdding] = useState(false);
    const [newPlatform, setNewPlatform] = useState<'meta' | 'google' | 'tiktok'>('meta');
    const [newPixelId, setNewPixelId] = useState('');

    const handleAddPixel = () => {
        if (!newPixelId.trim()) return;
        const newPixel: Pixel = {
            id: Date.now().toString(),
            platform: newPlatform,
            pixelId: newPixelId.trim(),
        };
        setPixels([...pixels, newPixel]);
        setNewPixelId('');
        setIsAdding(false);
    };

    const handleRemovePixel = (idToRemove: string) => {
        setPixels(pixels.filter(p => p.id !== idToRemove));
    };

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mt-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg text-white/90">Pixels Conectados</h3>
                {!isAdding && (
                    <button 
                        onClick={() => setIsAdding(true)}
                        className="bg-blue-600/50 hover:bg-blue-600/80 text-white text-sm font-bold py-1 px-3 rounded-lg transition-colors"
                    >
                        + Adicionar
                    </button>
                )}
            </div>

            {/* Formulário para adicionar novo pixel */}
            {isAdding && (
                <div className="bg-black/20 p-4 rounded-lg mb-4">
                    <h4 className="font-semibold text-white/80 mb-3">Adicionar Novo Pixel</h4>
                    <div className="space-y-4">
                        <select 
                            value={newPlatform}
                            onChange={(e) => setNewPlatform(e.target.value as any)}
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="meta">Meta Ads (Pixel)</option>
                            <option value="google">Google Ads (Tag)</option>
                            <option value="tiktok">TikTok Ads (Pixel)</option>
                        </select>
                        <input
                            type="text"
                            value={newPixelId}
                            onChange={(e) => setNewPixelId(e.target.value)}
                            placeholder="Cole o ID aqui"
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="flex gap-2">
                            <button onClick={handleAddPixel} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">Salvar</button>
                            <button onClick={() => setIsAdding(false)} className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-2 px-4 rounded-lg">Cancelar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Lista de pixels conectados */}
            <div className="space-y-3">
                {pixels.length > 0 ? (
                    pixels.map(pixel => (
                        <div key={pixel.id} className="flex items-center justify-between bg-black/20 p-3 rounded-lg">
                            <div className="flex items-center gap-3">
                                <i className={`${platformDetails[pixel.platform].icon} text-xl text-white/70`}></i>
                                <div>
                                    <span className="font-medium text-white/90">{platformDetails[pixel.platform].name}</span>
                                    <p className="text-sm text-white/50 font-mono">{pixel.pixelId}</p>
                                </div>
                            </div>
                            <button onClick={() => handleRemovePixel(pixel.id)} className="text-white/40 hover:text-red-500 transition-colors">
                                <i className="fa-solid fa-trash"></i>
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-white/40 py-4">Nenhum pixel conectado ainda.</p>
                )}
            </div>
        </div>
    );
};
