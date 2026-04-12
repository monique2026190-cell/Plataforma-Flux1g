
import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { PaginaErroDetectado } from './PaginaErroDetectado.jsx';
import { handleError } from '../../ServiçosFrontend/ServiçosDePrevençãoDeErros/ServicoDeTratamentoDeErro';

const MonitorDeErrosDeInterface = ({ children }) => (
  <ErrorBoundary FallbackComponent={PaginaErroDetectado} onError={handleError}>
    {children}
  </ErrorBoundary>
);

export default MonitorDeErrosDeInterface;
