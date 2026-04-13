
import { useRetornoGoogle } from '../hooks/useRetornoGoogle';

/**
 * Componente de página que exibe uma tela de carregamento durante o callback do Google Auth.
 * A lógica de autenticação e redirecionamento é encapsulada no hook `useRetornoGoogle`.
 */
export const RetornoAutenticacaoGoogle: React.FC = () => {
  // O hook gerencia todo o fluxo de autenticação e redirecionamento.
  useRetornoGoogle();

  // O componente se concentra apenas em fornecer feedback visual ao usuário.
  return (
    <div className="h-screen w-full bg-[#0c0f14] flex flex-col items-center justify-center gap-4">
      <i className="fa-solid fa-circle-notch fa-spin text-[#00c2ff] text-2xl"></i>
      <span className="text-[10px] font-black text-gray-500 uppercase tracking-[3px]">
        Finalizando autenticação com o Google...
      </span>
    </div>
  );
};
