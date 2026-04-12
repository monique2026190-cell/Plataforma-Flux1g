
import React, { useState, useRef } from 'react';

// Placeholder para os tipos de mídia
type MediaItem = {
    id: string;
    type: 'image' | 'video';
    url: string;
    file?: File;
};

export const CardEdicaoPaginaVendas: React.FC = () => {
    // Estado local para simular a interatividade do formulário
    const [copywriting, setCopywriting] = useState('## Acesso Exclusivo à Nossa Comunidade VIP\n\nDescreva aqui os benefícios, detalhes e o que o membro receberá ao entrar no grupo. Você pode usar **negrito**, *itálico* e criar listas:\n\n- Benefício 1\n- Benefício 2\n- Benefício 3');
    const [ctaText, setCtaText] = useState('QUERO ENTRAR AGORA');
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);

    const mediaInputRef = useRef<HTMLInputElement>(null);

    const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newItems: MediaItem[] = Array.from(e.target.files).map(file => ({
                id: crypto.randomUUID(),
                type: file.type.startsWith('image') ? 'image' : 'video',
                url: URL.createObjectURL(file),
                file: file
            }));
            setMediaItems(prev => [...prev, ...newItems]);
        }
    };

    const removeMediaItem = (id: string) => {
        setMediaItems(prev => prev.filter(item => item.id !== id));
    };

    return (
        <div className="bg-black/20 border border-white/10 rounded-2xl p-6 flex flex-col gap-6">
            <style>{`
                .form-group { display: flex; flex-direction: column; gap: 8px; }
                .form-group label { font-size: 13px; color: #00c2ff; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
                .form-group input, .form-group textarea { background: #101419; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #fff; padding: 12px; font-size: 15px; transition: 0.2s; min-height: 50px; }
                .form-group input:focus, .form-group textarea:focus { border-color: #00c2ff; outline: none; box-shadow: 0 0 10px rgba(0,194,255,0.2); }
                .form-group textarea { resize: vertical; }
                .media-gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 10px; }
                .media-item { width: 100%; aspect-ratio: 1/1; border-radius: 12px; overflow: hidden; position: relative; background: #000; border: 1px solid rgba(255,255,255,0.1); }
                .media-item img, .media-item video { width: 100%; height: 100%; object-fit: cover; }
                .remove-media-btn { position: absolute; top: 6px; right: 6px; width: 24px; height: 24px; border-radius: 50%; background: rgba(0,0,0,0.7); border: none; color: #ff4d4d; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 12px; transition: 0.2s; }
                .remove-media-btn:hover { background: #ff4d4d; color: #fff; transform: scale(1.1); }
                .add-media-placeholder { display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; aspect-ratio: 1/1; border-radius: 12px; border: 2px dashed rgba(0,194,255,0.4); color: rgba(0,194,255,0.6); cursor: pointer; transition: 0.2s; gap: 8px; }
                .add-media-placeholder:hover { border-color: #00c2ff; color: #00c2ff; background: rgba(0,194,255,0.1); }
                .add-media-placeholder i { font-size: 24px; }
                .add-media-placeholder span { font-size: 12px; font-weight: 600; }
            `}</style>

            {/* Copywriting */}
            <div className="form-group">
                <label htmlFor="copywriting">Copywriting (Texto de Venda)</label>
                <textarea 
                    id="copywriting" 
                    value={copywriting} 
                    onChange={e => setCopywriting(e.target.value)} 
                    placeholder="Descreva aqui os benefícios, detalhes e o que o membro receberá..."
                    rows={10}
                />
            </div>

            {/* Galeria de Conteúdo */}
            <div className="form-group">
                <label>Galeria de Conteúdo (Imagens e Vídeos)</label>
                <div className="media-gallery-grid">
                    {mediaItems.map(item => (
                        <div key={item.id} className="media-item">
                            {item.type === 'image' ? <img src={item.url} alt="" /> : <video src={item.url} muted loop />}
                            <button className="remove-media-btn" onClick={() => removeMediaItem(item.id)}><i className="fa-solid fa-times"></i></button>
                        </div>
                    ))}
                    <label htmlFor="media-input" className="add-media-placeholder">
                        <i className="fa-solid fa-plus"></i>
                        <span>Adicionar</span>
                    </label>
                </div>
                <input id="media-input" ref={mediaInputRef} type="file" accept="image/*,video/*" multiple className="hidden" onChange={handleMediaChange} />
            </div>

            {/* Call to Action */}
            <div className="form-group">
                <label htmlFor="cta-text">Texto do Botão de Ação (CTA)</label>
                <input id="cta-text" type="text" value={ctaText} onChange={e => setCtaText(e.target.value)} placeholder="Ex: Comprar Agora, Entrar no Grupo" />
            </div>

            {/* Botão de Salvar */}
            <button className="w-full bg-[#00c2ff] hover:bg-[#00a8e0] text-black font-bold py-3 px-6 rounded-lg transition-all duration-300 text-center text-lg mt-4">
                <i className="fa-solid fa-save mr-2"></i>
                Salvar Alterações
            </button>
        </div>
    );
};
