import { handleError } from '../ServiçosFrontend/ServiçosDePrevençãoDeErros/ServicoDeTratamentoDeErro';

export const useErrorHandler = () => {
  const captureError = (error: Error, context?: any) => {
    handleError(error, context);
  };

  return { captureError };
};
