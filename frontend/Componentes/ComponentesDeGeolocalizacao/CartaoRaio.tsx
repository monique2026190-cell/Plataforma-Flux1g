
import React from 'react';

interface CartaoRaioProps {
  value: number;
  onChange: (value: number) => void;
}

export const CartaoRaio: React.FC<CartaoRaioProps> = ({ value, onChange }) => (
  <div className="animate-fade-in">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-[10px] font-black text-white uppercase">Raio de Alcance</h3>
      <div className="flex items-center gap-2 bg-black/40 rounded-lg px-2 border border-white/10">
        <input 
          type="number" 
          value={value} 
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-14 text-center bg-transparent appearance-none p-2 font-bold"
        />
        <span className="text-xs text-gray-400">KM</span>
      </div>
    </div>
    <input 
      type="range" 
      min="1" 
      max="500" 
      value={value} 
      onChange={(e) => onChange(parseInt(e.target.value))} 
      className="w-full"
    />
    <div className="flex justify-between mt-2 text-[9px] text-gray-500 uppercase font-bold">
      <span>Perto</span>
      <span>Longe</span>
    </div>
  </div>
);
