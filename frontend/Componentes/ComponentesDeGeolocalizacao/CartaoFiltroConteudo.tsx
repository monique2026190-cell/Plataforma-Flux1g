
import React from 'react';

interface Placement {
  id: string;
  label: string;
  icon: string;
  desc: string;
}

interface CartaoFiltroConteudoProps {
  placements: Placement[];
  activePlacements: string[];
  onPlacementClick: (id: string) => void;
}

export const CartaoFiltroConteudo: React.FC<CartaoFiltroConteudoProps> = ({ placements, activePlacements, onPlacementClick }) => (
  <div className="bg-white/5 border border-white/10 rounded-[32px] p-6">
    <h3 className="text-[10px] font-black text-[#00c2ff] uppercase tracking-[2px] mb-4">
      O que deseja filtrar?
    </h3>
    <div className="flex flex-col gap-2">
      {placements.map(p => (
        <div key={p.id} onClick={() => onPlacementClick(p.id)} className={`placement-card-item ${activePlacements.includes(p.id) ? 'active' : ''}`}>
          <div className="p-icon-box"><i className={`fa-solid ${p.icon}`}></i></div>
          <div className="flex-1">
            <h4 className="text-sm font-bold">{p.label}</h4>
            <p className="text-[10px] text-gray-500 uppercase">{p.desc}</p>
          </div>
          {activePlacements.includes(p.id) && <i className="fa-solid fa-check-circle text-[#00c2ff]"></i>}
        </div>
      ))}
    </div>
  </div>
);
