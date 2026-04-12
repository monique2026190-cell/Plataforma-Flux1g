
import React, { useState } from 'react';

export const PGGrupoConfiguracoesPlataformaVendas: React.FC = () => {
  const [isHubMode, setIsHubMode] = useState(false);

  const handleToggleHubMode = () => {
    setIsHubMode(!isHubMode);
  };

  return (
    <div style={{ padding: '20px', color: 'white' }}>
      <h1>Configurações da Plataforma de Vendas</h1>
      <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
        <span style={{ marginRight: '10px' }}>Modo Hub</span>
        <label className="switch">
          <input type="checkbox" checked={isHubMode} onChange={handleToggleHubMode} />
          <span className="slider round"></span>
        </label>
      </div>
      <p style={{ marginTop: '10px' }}>
        Quando o Modo Hub está ativado, clicar no grupo redireciona para a página de conteúdo de vendas.
      </p>
    </div>
  );
};
