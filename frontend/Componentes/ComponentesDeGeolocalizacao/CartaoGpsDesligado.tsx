
import React from 'react';

interface CartaoGpsDesligadoProps {
  onAtivar: () => void;
}

export const CartaoGpsDesligado: React.FC<CartaoGpsDesligadoProps> = ({ onAtivar }) => (
  <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 text-center mt-4 animate-fade-in">
    <div className="w-20 h-20 bg-[#00c2ff1a] rounded-[30px] flex items-center justify-center mx-auto mb-6 border border-[#00c2ff33]">
      <i className="fa-solid fa-satellite text-3xl text-[#00c2ff]"></i>
    </div>
    <h2 className="text-lg font-bold mb-2">GPS Desconectado</h2>
    <p className="text-xs text-gray-500 px-10 mb-8">Ative o sinal para ver conteúdos baseados na sua localização.</p>
    <button onClick={onAtivar} className="w-full py-4 bg-[#00c2ff] text-black font-black rounded-2xl uppercase text-xs">
      Ativar Localização
    </button>
  </div>
);
