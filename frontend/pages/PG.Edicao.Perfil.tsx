
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CardEdicaoPerfil } from '../Componentes/ComponentesPerfilProprio/Card.Edicao.Perfil';

export const PG_Edicao_Perfil: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen bg-[radial-gradient(circle_at_top_left,_#0c0f14,_#0a0c10)] text-white font-['Inter'] flex flex-col overflow-hidden">
      <header className="flex items-center p-4 bg-[#0c0f14] fixed w-full top-0 z-10 border-b border-white/10 h-[65px]">
        <button onClick={() => navigate(-1)} className="back-btn"><i className="fas fa-arrow-left"></i></button>
        <h1 className="font-bold text-lg text-white ml-4">Editar Perfil</h1>
      </header>

      <main className="pt-[85px] pb-[100px] w-full max-w-[600px] mx-auto px-5 overflow-y-auto flex-grow">
        <CardEdicaoPerfil />
      </main>
    </div>
  );
};
