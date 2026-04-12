
import React from 'react';
import { CartaoRaio } from './CartaoRaio';

interface CartaoTerritorioProps {
  territory: string;
  setTerritory: (territory: string) => void;
  showRadius: boolean;
  setShowRadius: (show: boolean) => void;
  radiusKm: number;
  setRadiusKm: (km: number) => void;
}

export const CartaoTerritorio: React.FC<CartaoTerritorioProps> = ({ 
  territory, setTerritory, showRadius, setShowRadius, radiusKm, setRadiusKm 
}) => {
  return (
    <div className="bg-white/5 border border-white/10 rounded-[32px] p-6">
      <h3 className="text-[10px] font-black text-[#00c2ff] uppercase tracking-[2px] mb-4">
        Alcance da Descoberta
      </h3>

      {!showRadius ? (
        <div className="grid grid-cols-1 gap-2">
          <div onClick={() => setTerritory('city')} className={`territory-btn ${territory === 'city' ? 'active' : ''}`}>
            <span>Sua Cidade</span> <i className="fa-solid fa-city"></i>
          </div>
          <div onClick={() => setTerritory('state')} className={`territory-btn ${territory === 'state' ? 'active' : ''}`}>
            <span>Seu Estado</span> <i className="fa-solid fa-map"></i>
          </div>
          <div onClick={() => setTerritory('country')} className={`territory-btn ${territory === 'country' ? 'active' : ''}`}>
            <span>Seu País</span> <i className="fa-solid fa-flag"></i>
          </div>
        </div>
      ) : (
        <CartaoRaio value={radiusKm} onChange={setRadiusKm} />
      )}

      <button onClick={() => setShowRadius(!showRadius)} className="radius-toggle-btn mt-4">
        {showRadius ? 'Definir por Território' : 'Ajustar Raio (KM)'}
      </button>
    </div>
  );
};
