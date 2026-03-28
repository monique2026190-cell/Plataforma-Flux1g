
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../ServiçosFrontend/serviços/provedor/AuthProvider'; // Corrigido: Usando o hook central
import { servicoAutenticacao } from '../ServiçosFrontend/ServiçoDeAutenticação/Auth.Application'; // Importando o serviço para a ação do Google
import { CardOpcoesLogin } from '../Componentes/ComponentesDeAuth/Componentes/Card.Opcoes.Login';
import { CardLoginEmailSenha } from '../Componentes/ComponentesDeAuth/Componentes/Card.Login.Email.Senha';

export const Login: React.FC = () => {
    const navigate = useNavigate();
    // Estado e ações agora vêm diretamente do provedor de autenticação principal
    const { autenticado, processando, erro, login } = useAuth(); 

    const [mostrarFormEmail, setMostrarFormEmail] = useState(false);
    const [email, definirEmail] = useState('');
    const [senha, definirSenha] = useState('');

    useEffect(() => {
        if (autenticado) {
            // O redirecionamento pode ser tratado aqui ou em um componente de nível superior
            // que observa a mudança no estado de `autenticado`.
            console.log("Usuário autenticado, redirecionando...");
            // Exemplo: navigate('/dashboard');
        }
    }, [autenticado, navigate]);

    const submeterLoginEmail = (e: React.FormEvent) => {
        e.preventDefault();
        login({ email, senha }); // A função agora é simplesmente `login`
    };

    // Função para iniciar o fluxo de login com o Google
    const iniciarLoginComGoogle = () => {
        // A lógica do Google é chamada diretamente do serviço
        servicoAutenticacao.iniciarLoginComGoogle();
    };

    const CamadaDeProcessamento = () => (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm rounded-[32px] flex items-center justify-center z-50">
            <i className="fa-solid fa-circle-notch fa-spin text-[#00c2ff] text-2xl"></i>
        </div>
    );

    const BotaoGoogle = () => {
        return (
            <button
                onClick={iniciarLoginComGoogle} // Chama a função correta
                disabled={processando} // Desabilita o botão durante o processamento
                className="w-full bg-[#1a73e8] hover:bg-[#1a73e8]/90 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <i className="fa-brands fa-google text-xl"></i>
                Entrar com Google
            </button>
        );
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#050505] text-white font-['Inter'] relative overflow-hidden">
            {/* ... Efeitos de fundo ... */}
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
                
                {/* A camada de processamento agora é controlada pelo estado central */}
                {processando && <CamadaDeProcessamento />}
            </div>
        </div>
    );
};
