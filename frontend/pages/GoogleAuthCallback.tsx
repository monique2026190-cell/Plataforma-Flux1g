import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../SistemaFlux/Provedores/Provedor.Autenticacao';

export const GoogleAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { finalizarLoginComGoogle } = useAuth();

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const idToken = params.get('id_token');

    if (!idToken) {
      navigate('/login?error=auth_failed');
      return;
    }

    finalizarLoginComGoogle(idToken)
      .then((redirectRoute) => {
        navigate('/' + redirectRoute);
      })
      .catch(() => {
        navigate('/login?error=auth_failed');
      });
  }, [navigate, finalizarLoginComGoogle]);

  return (
    <div className="h-screen w-full bg-[#0c0f14] flex flex-col items-center justify-center gap-4">
      <i className="fa-solid fa-circle-notch fa-spin text-[#00c2ff] text-2xl"></i>
      <span className="text-[10px] font-black text-gray-500 uppercase tracking-[3px]">
        Finalizando autenticação...
      </span>
    </div>
  );
};
