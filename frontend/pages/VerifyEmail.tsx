
import React from 'react';
import { HookVerificarEmail } from '../hooks/Hook.Verificar.Email';
import { CardVerificacaoCodigo } from '../Componentes/ComponentesDeAuth/Componentes/Card.Verificacao.Codigo';

export const VerifyEmail: React.FC = () => {
  const {
    email,
    code,
    error,
    loading,
    timer,
    canResend,
    inputsRef,
    setCode,
    handleVerify,
    handleResend,
    handleBack,
  } = HookVerificarEmail();

  // Funções de manipulação de input que interagem com o estado do hook
  const handleInputChange = (index: number, value: string) => {
    if (loading) return;
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (loading) return;
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (loading) return;
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newCode = Array(6).fill('');
    pasteData.split('').forEach((char, index) => {
      newCode[index] = char;
    });
    setCode(newCode);
    inputsRef.current[pasteData.length - 1]?.focus();
  };

  return (
    <div className="h-screen w-full bg-[#0c0f14] text-white font-['Inter'] flex items-center justify-center p-5">
      <header className="fixed top-0 left-0 w-full p-5 z-10">
        <button onClick={handleBack} className="bg-white/10 p-2 rounded-full border border-[#00c2ff] text-[#00c2ff]" aria-label="Voltar">
            <i className="fa-solid fa-arrow-left"></i>
        </button>
      </header>

      <CardVerificacaoCodigo 
        email={email || ''}
        code={code}
        onInput={handleInputChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onSubmit={handleVerify}
        onResend={handleResend}
        timer={timer}
        canResend={canResend}
        loading={loading}
        error={error}
        inputsRef={inputsRef}
        title="Verificação de E-mail"
        subtitle="Enviamos o código para o seu e-mail cadastrado."
      />
    </div>
  );
};
