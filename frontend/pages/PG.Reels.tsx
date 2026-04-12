
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconeCurtidas } from '../Componentes/ComponentesReels/Icone.Curtidas';
import { IconeComentarios } from '../Componentes/ComponentesReels/Icone.Comentarios';
import { IconeCompartilhar } from '../Componentes/ComponentesReels/Icone.Compartilhar';
import { IconeVisualizacoes } from '../Componentes/ComponentesReels/Icone.Visualizacoes';
import { CardInformacoesReels } from '../Componentes/ComponentesReels/Card.Informacoes.Reels';
// O caminho foi atualizado para apontar para o ficheiro que contém a lógica do painel.
import { PainelComentariosReels } from '../Componentes/ComponenteDeInterfaceDeUsuario/comments/Card.Comentario.Reels';
import { Comment } from '../types';

// --- Dados Fictícios (Mock Data) ---
const mockReel = {
    id: '1',
    user: {
        username: 'flux_creative',
        avatar: 'https://placehold.co/40x40/00c2ff/white?text=F',
    },
    description: 'Este é um Reel de exemplo a demonstrar a nova interface! #flux #reels #demo',
    videoUrl: 'https://videos.pexels.com/video-files/853881/853881-hd_720_1366_25fps.mp4',
    views: 1250,
    likes: 243,
    comments: 32,
};

const mockComments: Comment[] = [
    {
        id: 'c1', userId: 'user2', username: 'beatriz_design', 
        text: 'Uau, que edição incrível! Qual software usaste?',
        timestamp: Date.now() - 1000 * 60 * 5, // 5 minutos atrás
        likes: 15, avatar: 'https://placehold.co/40x40/ff6600/white?text=B', replies: [
            {
                id: 'c3', userId: 'user1', username: 'flux_creative', 
                text: 'Obrigado! Usei o DaVinci Resolve para a cor e o Premiere Pro para a montagem.',
                timestamp: Date.now() - 1000 * 60 * 3, // 3 minutos atrás
                likes: 8, avatar: 'https://placehold.co/40x40/00c2ff/white?text=F',
                replyToUsername: 'beatriz_design'
            }
        ]
    },
    {
        id: 'c2', userId: 'user3', username: 'ricardo_fotografia', 
        text: 'A transição aos 0:05 ficou muito suave. Grande trabalho!',
        timestamp: Date.now() - 1000 * 60 * 10, // 10 minutos atrás
        likes: 4, avatar: 'https://placehold.co/40x40/33cc33/white?text=R'
    },
];
// ------------------------------------

export const PG_Reels: React.FC = () => {
    const [curtido, setCurtido] = useState(false);
    const [contagemCurtidas, setContagemCurtidas] = useState(mockReel.likes);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isCommentPanelOpen, setIsCommentPanelOpen] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const navigate = useNavigate();

    const handleLikeClick = () => {
        setCurtido(!curtido);
        setContagemCurtidas(contagemCurtidas + (curtido ? -1 : 1));
    };

    const handleCommentClick = () => {
        setIsPlaying(false); // Pausa o vídeo
        setIsCommentPanelOpen(true);
    };

    const closeCommentPanel = () => {
        setIsCommentPanelOpen(false);
        setIsPlaying(true); // Retoma o vídeo
    }

    const handleShareClick = () => {
        alert('Funcionalidade de partilha em breve!');
    };

    const togglePlay = () => {
        if (!isCommentPanelOpen) {
            setIsPlaying(!isPlaying);
        }
    };

    useEffect(() => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.play();
            } else {
                videoRef.current.pause();
            }
        }
    }, [isPlaying]);

    return (
        <div className="reels-page">
            <style>{`
                .reels-page { position: relative; background: #1a1a1a; height: 100dvh; width: 100%; overflow: hidden; display: flex; justify-content: center; align-items: center; color: white; }
                .reels-container { position: relative; width: 100%; max-width: 450px; height: 100%; background: black; border-radius: 8px; display: flex; flex-direction: column; justify-content: flex-end; cursor: pointer; }
                .reels-video { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; z-index: 1; border-radius: 8px; }
                .video-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; display: flex; justify-content: center; align-items: center; background-color: rgba(0, 0, 0, 0.4); z-index: 5; }
                .reels-actions { position: absolute; right: 10px; bottom: 20px; display: flex; flex-direction: column; align-items: center; gap: 22px; z-index: 10; }
                .reels-info { position: absolute; bottom: 10px; left: 5px; right: 80px; z-index: 10; }
                .view-switcher {
                    position: absolute;
                    top: 85px;
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 20;
                    display: flex;
                    align-items: center;
                    padding: 4px;
                    background-color: rgba(26, 30, 38, 0.5);
                    backdrop-filter: blur(8px);
                    border: 1px solid rgba(255, 255, 255, 0.15);
                    border-radius: 9999px;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
                    transition: background-color 0.3s ease;
                }
                .view-switcher:hover {
                    background-color: rgba(26, 30, 38, 0.7);
                }
                .switcher-button {
                    padding: 8px 24px;
                    border-radius: 9999px;
                    background-color: transparent;
                    color: rgb(209, 213, 219);
                    font-size: 14px;
                    font-weight: 500;
                    transition: all 0.3s ease;
                    border: none;
                    cursor: pointer;
                }
                .switcher-button.active {
                    background-color: rgba(0, 194, 255, 0.7);
                    color: #ffffff;
                    font-weight: 700;
                    box-shadow: 0 0 12px rgba(0, 194, 255, 0.3);
                }
            `}</style>

            <div className="view-switcher">
                <button className="switcher-button" onClick={() => navigate('/feed')}>Feed</button>
                <button className="switcher-button active">Reels</button>
            </div>

            <div className="reels-container" onClick={togglePlay}>
                <video ref={videoRef} className="reels-video" src={mockReel.videoUrl} autoPlay muted loop />

                {!isPlaying && !isCommentPanelOpen && (
                    <div className="video-overlay">
                        <i className="fa-solid fa-play text-6xl text-white opacity-75"></i>
                    </div>
                )}
                
                <div className="reels-actions">
                    <IconeCurtidas 
                        curtido={curtido}
                        contagem={contagemCurtidas}
                        onClick={(e) => { e.stopPropagation(); handleLikeClick(); }}
                    />
                    <IconeComentarios 
                        contagem={mockReel.comments}
                        onClick={(e) => { e.stopPropagation(); handleCommentClick(); }}
                    />
                    <IconeCompartilhar 
                        onClick={(e) => { e.stopPropagation(); handleShareClick(); }}
                    />
                    <IconeVisualizacoes contagem={mockReel.views} />
                </div>

                <div className="reels-info">
                   <CardInformacoesReels user={mockReel.user} description={mockReel.description} />
                </div>
            </div>

            <PainelComentariosReels 
                isOpen={isCommentPanelOpen}
                onClose={closeCommentPanel}
                comments={mockComments}
            />
        </div>
    );
};
