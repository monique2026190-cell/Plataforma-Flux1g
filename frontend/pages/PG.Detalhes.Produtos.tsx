
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CardDescricaoMarkplace } from '../Componentes/ComponentesDeMarketplace/Card.Descricao.Markplace';
import { HookComentariosMarketplace } from '../hooks/Hook.ComentariosMarketplace';
import { CardComentarioMarketplace } from '../Componentes/ComponenteDeInterfaceDeUsuario/comments/Card.Comentario.Marketplace';
import { CardMarketplacePrevia } from '../Componentes/ComponentesDeMarketplace/Card.Marketplace.Previa';
import { CardMarketplaceDetalhes } from '../Componentes/ComponentesDeMarketplace/Card.Marketplace.Detalhes';
import { CardZoomPrevia } from '../Componentes/ComponentesDeMarketplace/Card.Zoom.Previa';

const mockProduct = {
  id: 'prod123',
  name: 'Curso Completo de Edição de Vídeo com DaVinci Resolve',
  price: 'R$ 249,90',
  seller: {
    name: 'Flux Creative',
    avatar: 'https://placehold.co/40x40/00c2ff/white?text=F',
    rating: 4.9,
    reviews: 234
  },
  images: [
    'https://via.placeholder.com/1280x720/1a1a1a/fff?text=Capa+do+Curso',
    'https://via.placeholder.com/1280x720/2a2a2a/fff?text=Módulo+1:+Interface',
    'https://via.placeholder.com/1280x720/3a3a3a/fff?text=Módulo+2:+Edição',
    'https://via.placeholder.com/1280x720/4a4a4a/fff?text=Módulo+3:+Color+Grading'
  ],
  description: `Leve suas habilidades de edição para o próximo nível com nosso curso completo de DaVinci Resolve. Aprenda desde a interface básica até técnicas avançadas de color grading, edição de áudio e efeitos visuais. Este curso é perfeito para iniciantes e editores intermediários que desejam dominar o software padrão da indústria.\n\nO que você vai aprender:\n- Navegação e organização de projetos\n- Ferramentas de corte e montagem\n- Tratamento e correção de cor profissional\n- Mixagem de áudio e sound design\n- Exportação para diferentes plataformas`,
};

export const PGDetalhesProdutos: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { comentarios, isLoading, error, carregarComentarios, postarComentario } = HookComentariosMarketplace(id || 'prod123');
  const [novoComentario, setNovoComentario] = useState('');
  const [zoomState, setZoomState] = useState<{ images: string[], startIndex: number } | null>(null);

  const openZoom = (startIndex: number) => {
    setZoomState({ images: mockProduct.images, startIndex });
  };

  const closeZoom = () => {
    setZoomState(null);
  };

  const handlePostarComentario = async () => {
    if (novoComentario.trim()) {
        await postarComentario(novoComentario);
        setNovoComentario('');
    }
  };

  const handleConverse = () => {
    console.log("Redirect to chat...");
  };

  return (
    <div className="min-h-[100dvh] font-['Inter'] bg-[#0c0f14] text-white">
      <header className="flex items-center justify-between p-4 bg-[#0c0f14]/80 backdrop-blur-lg fixed w-full top-0 z-40 border-b border-white/10 h-[65px]">
        <button onClick={() => navigate(-1)} className="text-[#00c2ff] text-xl p-2 hover:bg-white/5 rounded-full transition-all">
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <span className="text-xs font-black uppercase tracking-[2px]">Produto</span>
        <div className="w-10"></div>
      </header>

      <div className="pt-[65px]">
        <CardMarketplacePrevia images={mockProduct.images} onImageClick={openZoom} />
      </div>

      <main className="w-full max-w-[1000px] mx-auto flex-grow px-4 pb-10">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 mt-6 animate-fade-in">
          <CardMarketplaceDetalhes 
            name={mockProduct.name}
            seller={mockProduct.seller}
            price={mockProduct.price}
            onConverse={handleConverse}
          />
        </div>
        <CardDescricaoMarkplace title="Descrição" description={mockProduct.description} />
        
        <div className="bg-white/5 rounded-2xl p-6 mt-8 w-full">
            <h2 className="font-bold text-lg mb-4 text-white">Perguntas e Respostas</h2>
            <div className="flex gap-3 mb-6">
                <input 
                    type="text" 
                    value={novoComentario}
                    onChange={(e) => setNovoComentario(e.target.value)}
                    placeholder="Escreva sua pergunta..." 
                    className="flex-grow bg-black/20 border border-white/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00c2ff] transition-all"
                />
                <button onClick={handlePostarComentario} className="bg-[#00c2ff] text-black font-bold px-6 py-2 rounded-lg text-sm hover:bg-white transition-all" disabled={isLoading}>
                    {isLoading ? 'Enviando...' : 'Enviar'}
                </button>
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error.geral}</p>}
            <div className="flex flex-col gap-4">
                {isLoading && comentarios.length === 0 && <p className="text-gray-400">Carregando comentários...</p>}
                {!isLoading && comentarios.length === 0 && <p className="text-gray-400">Nenhuma pergunta ainda. Seja o primeiro a perguntar!</p>}
                {comentarios.map(comentario => (
                    <CardComentarioMarketplace key={comentario.id} comentario={comentario} />
                ))}
            </div>
        </div>
      </main>

      {zoomState && (
        <CardZoomPrevia images={zoomState.images} startIndex={zoomState.startIndex} onClose={closeZoom} />
      )}
    </div>
  );
};
