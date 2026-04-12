
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartaoGpsDesligado } from '../Componentes/ComponentesDeGeolocalizacao/CartaoGpsDesligado';
import { CartaoTerritorio } from '../Componentes/ComponentesDeGeolocalizacao/CartaoTerritorio';
import { CartaoFiltroConteudo } from '../Componentes/ComponentesDeGeolocalizacao/CartaoFiltroConteudo';

export const LocationSelector = () => {
  const navigate = useNavigate();

  // Estados para controlar a interface
  const [isGpsOn, setIsGpsOn] = useState(false);
  const [territory, setTerritory] = useState('city'); // 'city', 'state', 'country'
  const [showRadius, setShowRadius] = useState(false);
  const [radiusKm, setRadiusKm] = useState(50);
  const [activePlacements, setActivePlacements] = useState<string[]>(['feed']);

  // Definições dos conteúdos filtráveis
  const placements = [
    { id: 'feed', label: 'Feed', icon: 'fa-newspaper', desc: 'Posts e enquetes' },
    { id: 'reels', label: 'Reels', icon: 'fa-clapperboard', desc: 'Vídeos curtos' },
    { id: 'marketplace', label: 'Mercado', icon: 'fa-cart-shopping', desc: 'Ofertas e vendas' }
  ];

  // Funções para manipular o estado
  const handlePlacementClick = (id: string) => {
    setActivePlacements(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleGpsActivation = () => {
    setIsGpsOn(true);
  };

  return (
    <div className="min-h-screen bg-[#0c0f14] text-white font-['Inter'] flex flex-col overflow-x-hidden">
      <style>{`
        .placement-card-item { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 18px; padding: 14px 18px; display: flex; align-items: center; gap: 16px; cursor: pointer; transition: all 0.2s ease-in-out; }
        .placement-card-item.active { background: rgba(0, 194, 255, 0.08); border-color: rgba(0, 194, 255, 0.5); }
        .p-icon-box { width: 44px; height: 44px; border-radius: 12px; background: rgba(255, 255, 255, 0.05); display: flex; align-items: center; justify-content: center; color: #777; font-size: 18px; transition: all 0.2s ease-in-out; }
        .placement-card-item.active .p-icon-box { background: #00c2ff; color: #000; }
        .territory-btn { background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); padding: 18px 20px; border-radius: 20px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; transition: all 0.2s ease-in-out; }
        .territory-btn.active { background: rgba(0, 194, 255, 0.1); border-color: rgba(0, 194, 255, 0.5); }
        .radius-toggle-btn { width: 100%; padding: 14px; background: rgba(255,255,255,0.02); border: 1px dashed rgba(255,255,255,0.1); border-radius: 16px; color: #888; font-size: 11px; font-weight: 800; text-transform: uppercase; cursor: pointer; }
        input[type='range'] { -webkit-appearance: none; appearance: none; width: 100%; height: 8px; background: rgba(0,0,0,0.3); border-radius: 5px; outline: none; } 
        input[type='range']::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 20px; height: 20px; background: #00c2ff; cursor: pointer; border-radius: 50%; border: 3px solid #0c0f14; box-shadow: 0 0 5px rgba(0,194,255,0.5); }
      `}</style>

      <header className="flex items-center p-[16px_22px] border-b border-white/10 h-[65px] flex-shrink-0">
        <button onClick={() => navigate(-1)} className="text-white text-[22px] pr-[15px]">
          <i className="fa-solid fa-xmark"></i>
        </button>
        <h1 className="text-[18px] font-bold text-[#00c2ff] uppercase tracking-tighter">
          Explorar Mapa Flux
        </h1>
      </header>

      <main className="pt-[20px] pb-10 w-full max-w-[500px] mx-auto px-5 flex flex-col gap-6 overflow-y-auto">
        
        {!isGpsOn ? (
          <CartaoGpsDesligado onAtivar={handleGpsActivation} />
        ) : (
          <>
            <CartaoTerritorio
              territory={territory}
              setTerritory={setTerritory}
              showRadius={showRadius}
              setShowRadius={setShowRadius}
              radiusKm={radiusKm}
              setRadiusKm={setRadiusKm}
            />
            
            <CartaoFiltroConteudo
              placements={placements}
              activePlacements={activePlacements}
              onPlacementClick={handlePlacementClick}
            />

            <button className="w-full py-5 bg-[#00c2ff] text-black font-black rounded-2xl uppercase text-sm mt-2">
              Confirmar Filtro
            </button>
          </>
        )}
      </main>
    </div>
  );
};

export default LocationSelector;
