
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../SistemaFlux/hooks/useAuth';
import { useGoogleLogin } from '@react-oauth/google'; // 1. Importar o hook do Google diretamente aqui
import { CardOpcoesLogin } from '../Componentes/ComponentesDeAuth/Componentes/Card.Opcoes.Login';
import { CardLoginEmailSenha } from '../Componentes/ComponentesDeAuth/Componentes/Card.Login.Email.Senha';

export const Login: React.FC = () => {
    const navigate = useNavigate();
    // 2. Pegar a nova função `processarLoginGoogle` do hook useAuth
    const { autenticado, processando, erro, usuario, loginComEmail, processarLoginGoogle } = useAuth(); 

    const [mostrarFormEmail, setMostrarFormEmail] = useState(false);
    const [email, definirEmail] = useState('');
    const [senha, definirSenha] = useState('');

    // 3. O hook useGoogleLogin é chamado aqui, na UI, e não no provedor global.
    const iniciarLoginComGoogle = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            // Em caso de sucesso, chamamos a função do provedor para atualizar o estado global
            await processarLoginGoogle(tokenResponse);
        },
        onError: (error) => {
            // O erro pode ser tratado aqui ou no provedor, se desejado
            console.error('Erro no login Google:', error);
        },
    });

    useEffect(() => {
        if (autenticado) {
            if (usuario && !usuario.perfilCompleto) {
                navigate('/CompleteProfile'); 
            } else {
                navigate('/Feed');
            }
        }
    }, [autenticado, usuario, navigate]);

    const submeterLoginEmail = (e: React.FormEvent) => {
        e.preventDefault();
        loginComEmail({ email, senha });
    };

    const CamadaDeProcessamento = () => (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-[32px] flex items-center justify-center z-50">
            <i className="fa-solid fa-circle-notch fa-spin text-[#00c2ff] text-2xl"></i>
        </div>
    );

    const BotaoGoogle = () => {
        return (
            <button
                // 4. O botão agora chama a função `iniciarLoginComGoogle` criada pelo hook `useGoogleLogin`
                onClick={() => iniciarLoginComGoogle()}
                disabled={processando}
                className="w-full bg-[#1a73e8] hover:bg-[#1a73e8]/90 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <i className="fa-brands fa-google text-xl"></i>
                Entrar com Google
            </button>
        );
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#050505] text-white font-['Inter'] relative overflow-hidden">
            <div className="w-full max-w-[400px] mx-4 bg-white/5 backdrop-blur-2xl rounded-[32px] p-10 border border-white/10 shadow-2xl relative z-10 flex flex-col items-center">
                {mostrarFormEmail ? (
                    <CardLoginEmailSenha 
                        email={email}
                        definirEmail={definirEmail}
                        senha={senha}
                        definirSenha={definirSenha}
                        aoSubmeter={submeterLoginEmail}
                        aoVoltar={() => setMostrarFormEmail(false)}
                        carregando={processando}
                        erro={erro}
                    />
                ) : (
                    <CardOpcoesLogin 
                        onSelecionarEmail={() => setMostrarFormEmail(true)}
                        slotBotaoGoogle={<BotaoGoogle />}
                    />
                )}
                
                {processando && <CamadaDeProcessamento />}
            </div>
        </div>
    );
};
