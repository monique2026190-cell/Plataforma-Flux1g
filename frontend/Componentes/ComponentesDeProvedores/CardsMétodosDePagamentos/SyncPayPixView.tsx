
import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface SyncPayPixViewProps {
    pixCode: string;
    pixImage?: string;
    onCopy: () => void;
    isCopied: boolean;
    onBack: () => void;
}

export const SyncPayPixView: React.FC<SyncPayPixViewProps> = ({ pixCode, pixImage, onCopy, isCopied, onBack }) => {
    return (
        <div className="animate-fade-in">
            <h3 className="text-lg font-bold text-[#00c2ff] mb-2">Pagar com Pix</h3>
            <div className="bg-white p-2.5 rounded-xl mb-4 inline-block shadow-lg">
                {pixImage ? <img src={pixImage} className="w-[180px]" alt="QR Code" /> : <QRCodeSVG value={pixCode} size={180} />}
            </div>
            <textarea 
                readOnly 
                className="w-full bg-[#1a1f26] text-white p-3 rounded-lg text-[10px] font-mono border border-dashed border-[#00c2ff] h-20 resize-none mb-4 outline-none" 
                value={pixCode} 
            />
            <button onClick={onCopy} className="w-full py-3 bg-[#00c2ff] text-black rounded-lg font-bold shadow-lg">
                {isCopied ? 'CÓDIGO COPIADO!' : 'COPIAR CÓDIGO PIX'}
            </button>
            <button 
                onClick={onBack} 
                className="mt-4 text-[10px] text-[#00c2ff] underline"
            >
                Trocar método de pagamento
            </button>
        </div>
    );
};
