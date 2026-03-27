
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { servicoAutenticacao } from '../ServiçosFrontend/ServiçoDeAutenticação/Auth.Application';
const authService = servicoAutenticacao;


export const HookVerificarEmail = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState<string[]>(Array(6).fill(''));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const user = authService.getCurrentUser();
  const email = user?.email;

  useEffect(() => {
    if (!email) {
      navigate('/register');
      return;
    }

    inputsRef.current[0]?.focus();

    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [email, navigate]);

  const handleVerify = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || loading) return;

    setLoading(true);
    setError('');
    try {
      await authService.verifyCode(email, code.join(''));
      navigate('/complete-profile');
    } catch (err: any) {
      setError(err.message || 'Código inválido ou expirado.');
      setCode(Array(6).fill(''));
      inputsRef.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  }, [email, code, navigate, loading]);

  const handleResend = useCallback(async () => {
    if (!canResend || !email) return;

    setCanResend(false);
    setTimer(30);
    setError('');

    try {
      await authService.sendVerificationCode(email);
    } catch (err: any) {
      setError(err.message || 'Falha ao reenviar o código.');
      setCanResend(true);
    }
  }, [canResend, email]);

  const handleBack = () => navigate('/register');

  return {
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
  };
};
