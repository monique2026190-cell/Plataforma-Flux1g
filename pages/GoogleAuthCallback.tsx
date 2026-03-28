
import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../ServiçosFrontend/serviços/provedor/AuthProvider'; // Importa o hook correto
import { servicoAutenticacao } from '../ServiçosFrontend/ServiçoDeAutenticação/Auth.Application'; // Importa o serviço

export const GoogleAuthCallback: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    // Usa o estado do hook centralizado
    const { erro, autenticado } = useAuth(); 

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            // A lógica de negócio é chamada diretamente do serviço
            servicoAutenticacao.finalizarLoginComToken(token);
        } else {
            console.error("Nenhum token encontrado no callback do Google.");
            navigate('/login?error=auth_failed');
        }
        // Roda apenas uma vez quando o componente é montado
    }, [searchParams, navigate]);
    
    useEffect(() => {
        // Reage a erros durante o processo de finalização
        if (erro) {
            navigate(`/login?error=${erro}`);
        }
    }, [erro, navigate]);

    useEffect(() => {
        // Reage ao sucesso da autenticação
        if (autenticado) {
            navigate('/'); // Redireciona para a página principal após o login
        }
    }, [autenticado, navigate]);

    return (
        <div className="h-screen w-full bg-[#0c0f14] flex flex-col items-center justify-center gap-4">
            <i className="fa-solid fa-circle-notch fa-spin text-[#00c2ff] text-2xl"></i>
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-[3px]">
                Finalizando autenticação...
            </span>
        </div>
    );
};
