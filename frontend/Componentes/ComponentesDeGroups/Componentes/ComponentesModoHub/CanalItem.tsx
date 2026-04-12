
import React from 'react';
import IconeArquivoVideo from '../../../Icones/Icone.ArquivoMP4';
import IconeArquivoTexto from '../../../Icones/Icone.ArquivoTXT';
import IconeArquivoFotos from '../../../Icones/Icone.Arquivo.Fotos';
import IconeArquivoAudio from '../../../Icones/Icone.Arquivo.Audio';
import IconeArquivoDocumento from '../../../Icones/Icone.Arquivo.Documento';

interface CanalItemProps {
    channel: {
        id: string;
        name: string;
    };
}

const CanalItem: React.FC<CanalItemProps> = ({ channel }) => {
    const getFileIcon = (fileName: string) => {
        if (fileName.toLowerCase().includes('vídeo') || fileName.toLowerCase().includes('(mp4)')) {
            return <IconeArquivoVideo />;
        } else if (fileName.toLowerCase().includes('texto') || fileName.toLowerCase().includes('(txt)')) {
            return <IconeArquivoTexto />;
        } else if (fileName.toLowerCase().includes('imagens') || fileName.toLowerCase().includes('(jpg)')) {
            return <IconeArquivoFotos />;
        } else if (fileName.toLowerCase().includes('áudio') || fileName.toLowerCase().includes('(mp3)')) {
            return <IconeArquivoAudio />;
        } else if (fileName.toLowerCase().includes('documento') || fileName.toLowerCase().includes('(pdf)') || fileName.toLowerCase().includes('(doc)')) {
            return <IconeArquivoDocumento />;
        }
        return <IconeArquivoFotos />; // Ícone padrão
    };

    return (
        <div className="flex items-center p-2 bg-gray-800 rounded-lg mb-2 justify-between">
            <div className="flex items-center">
                {getFileIcon(channel.name)}
                <span className="ml-3 text-white">{channel.name}</span>
            </div>
        </div>
    );
};

export default CanalItem;
