
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../SistemaFlux/hooks/useAuth';
import { useGoogleLogin } from '@react-oauth/google';
import { CardOpcoesLogin } from '../Componentes/ComponentesDeAuth/Componentes/Card.Opcoes.Login';
import { CardLoginEmailSenha } from '../Componentes/ComponentesDeAuth/Componentes/Card.Login.Email.Senha';

export const Login: React.FC = () => {
    const navigate = useNavigate();
    const { processando, erro, possibilitaLoginComEmail, possibilitaFinalizarLoginComGoogle } = useAuth(); 

    const [mostrarFormEmail, setMostrarFormEmail] = useState(false);
    const [email, definirEmail] = useState('');
    const [senha, definirSenha] = useState('');

    const iniciarLoginComGoogle = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                const usuario = await possibilitaFinalizarLoginComGoogle(tokenResponse);
                const rota = usuario.perfilCompleto ? '/feed' : '/CompleteProfile';
                navigate(rota);
            } catch (err) {
                console.error("Falha no login com Google (onSuccess):", err);
            }
        },
        onError: (error) => {
            console.error('Erro no login Google (hook):', error);
        },
    });

    const submeterLoginEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const usuario = await possibilitaLoginComEmail({ email, senha });
            const rota = usuario.perfilCompleto ? '/feed' : '/CompleteProfile';
            navigate(rota);
        } catch(err) {
            console.error("Falha no login com Email:", err);
        }
    };

    const CamadaDeProcessamento = () => (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-[32px] flex items-center justify-center z-50">
            <i className="fa-solid fa-circle-notch fa-spin text-[#00c2ff] text-2xl"></i>
        </div>
    );

    const BotaoGoogle = () => {
        return (
            <button
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
