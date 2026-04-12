
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HookEsqueciSenha } from '../hooks/Hook.Esqueci.Senha';
import { CardEsqueceuSenha } from '../Componentes/ComponentesDeAuth/Componentes/Card.Esqueceu.Senha';
import { CardVerificacaoCodigo } from '../Componentes/ComponentesDeAuth/Componentes/Card.Verificacao.Codigo';

export const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const {
    email, setEmail,
    code, 
    stage,
    timer,
    loading,
    error,
    btnText,
    btnColorClass,
    inputsRef,
    handleEmailSubmit,
    handleVerifyCode,
    handleInput,
    handleKeyDown,
    handlePaste,
    goBackToEmail,
  } = HookEsqueciSenha();

  return (
    <div className="h-screen w-full bg-[#0c0f14] text-white font-['Inter'] flex items-center justify-center p-5 relative">
        <header className="fixed top-0 left-0 w-full p-5 z-10">
            <button 
                onClick={() => stage === 'code' ? goBackToEmail() : navigate('/')} 
                className="bg-white/10 p-2 rounded-full w-10 h-10 flex items-center justify-center border border-[#00c2ff] text-[#00c2ff]"
            >
                <i className="fa-solid fa-arrow-left"></i>
            </button>
        </header>

        {stage === 'email' ? (
            <CardEsqueceuSenha 
                email={email} 
                setEmail={setEmail} 
                loading={loading}
                btnText={btnText} 
                btnColorClass={btnColorClass} 
                onSubmit={handleEmailSubmit}
                error={error}
            />
        ) : (
            <CardVerificacaoCodigo 
                email={email} 
                code={code} 
                onInput={handleInput} 
                onKeyDown={handleKeyDown} 
                onPaste={handlePaste}
                onSubmit={handleVerifyCode} 
                onResend={handleEmailSubmit}
                timer={timer} 
                canResend={timer === 0} 
                loading={loading} 
                error={error}
                inputsRef={inputsRef} 
                title="Redefinir Senha"
            />
        )}
    </div>
  );
};
