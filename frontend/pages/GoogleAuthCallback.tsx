import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../SistemaFlux/Provedores/Provedor.Autenticacao';

// Interface para maior clareza na tipagem, espelhando o provedor
interface GoogleTokenResponse {
  access_token: string;
}

export const GoogleAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  // Atualizado para usar a nova convenção de nomenclatura
  const { possibilitaFinalizarLoginComGoogle } = useAuth();

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const accessToken = params.get('access_token');

    if (!accessToken) {
      console.error("Token de acesso do Google não encontrado na URL.");
      navigate('/login?error=google_auth_failed', { replace: true });
      return;
    }

    const tokenResponse: GoogleTokenResponse = { access_token: accessToken };

    // Atualizado para usar a nova convenção de nomenclatura
    possibilitaFinalizarLoginComGoogle(tokenResponse)
      .then((usuario) => {
        // A lógica de navegação agora vive aqui, na camada de UI
        const rotaDestino = usuario.perfilCompleto ? '/feed' : '/complete-profile';
        navigate(rotaDestino, { replace: true });
      })
      .catch((err) => {
        console.error("Falha ao finalizar login com Google:", err);
        navigate('/login?error=google_auth_failed', { replace: true });
      });
      // A dependência foi atualizada para a nova função
  }, [navigate, possibilitaFinalizarLoginComGoogle]);

  return (
    // Um componente de loading para indicar ao usuário que algo está acontecendo
    <div className="h-screen w-full bg-[#0c0f14] flex flex-col items-center justify-center gap-4">
      <i className="fa-solid fa-circle-notch fa-spin text-[#00c2ff] text-2xl"></i>
      <span className="text-[10px] font-black text-gray-500 uppercase tracking-[3px]">
        Finalizando autenticação com Google...
      </span>
    </div>
  );
};
