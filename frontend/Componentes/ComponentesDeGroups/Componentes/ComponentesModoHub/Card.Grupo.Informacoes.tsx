
import React from 'react';

interface CardGrupoInformacoesProps {
  nome: string;
  descricao: string;
  imagemCapaUrl: string;
}

const CardGrupoInformacoes: React.FC<CardGrupoInformacoesProps> = ({ nome, descricao, imagemCapaUrl }) => {
  return (
    <div 
      className="relative bg-cover bg-center rounded-2xl shadow-2xl overflow-hidden w-full h-64 md:h-80 flex flex-col items-center justify-center text-center p-8 text-white" 
      style={{ backgroundImage: `url(${imagemCapaUrl || '/path/to/default/cover.jpg'})` }}
    >
      {/* Sobreposição para maior contraste */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Borda interna sutil */}
      <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-2xl"></div>

      {/* Conteúdo de Texto Centralizado */}
      <div className="relative z-10 flex flex-col items-center">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-shadow-lg mb-3">{nome}</h1>
        <p className="text-md md:text-lg font-light text-gray-300 text-shadow-md max-w-2xl">{descricao}</p>
      </div>
    </div>
  );
};

export default CardGrupoInformacoes;
