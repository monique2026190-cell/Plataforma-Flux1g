import React from 'react';
import { recoverApplication } from '../../ServiçosFrontend/ServiçosDePrevençãoDeErros/ServicoDeRecuperacaoDeErro';

export const ErrorFallback = ({ error, onReset }) => {
  const isDev = process.env.NODE_ENV === 'development';

  const handleReset = () => {
    recoverApplication();
    onReset();
  };

  return (
    <div>
      <h1>Erro crítico</h1>

      {isDev && error && (
        <pre>{error.message}</pre>
      )}

      <button onClick={handleReset}>
        Recuperar
      </button>
    </div>
  );
};
