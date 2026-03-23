import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { servicoGestaoSessao } from '../ServiçosFrontend/ServiçoDeAutenticação/Servico.Gestao.Sessao';
import { LogSupremo } from '../ServiçosFrontend/SistemaObservabilidade/Log.Supremo';

export const HookPonteSucesso = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [status, setStatus] = useState('validating'); // validating, ready, error
    const [message, setMessage] = useState('Aguarde enquanto verificamos suas credenciais...');

    useEffect(() => {
        const handleSuccess = async () => {
            const query = new URLSearchParams(location.search);
            const sessionId = query.get('session_id');

            if (sessionId) {
                try {
                    LogSupremo.Log.info('HookPonteSucesso', 'Resolvendo sessão de login...', { sessionId });
                    // O servicoGestaoSessao irá lidar com o armazenamento de token/usuário
                    const redirect = await servicoGestaoSessao.resolverRedirecionamentoLogin(sessionId);
                    
                    LogSupremo.Log.success('HookPonteSucesso', 'Sessão resolvida com sucesso!', { redirect });

                    // Lógica de redirecionamento baseada na resposta do backend
                    if (redirect?.type === 'feed') {
                        navigate('/feed');
                    } else if (redirect?.type === 'complete-profile') {
                        navigate('/complete-profile');
                    } else if (redirect?.type === 'group') {
                        navigate(`/g/${redirect.groupId}`);
                    } else {
                        // Um fallback sensato caso a resposta não seja o esperado
                        navigate(redirect?.fallbackUrl || '/');
                    }

                } catch (error) {
                    LogSupremo.Log.error('HookPonteSucesso', 'Falha ao resolver a sessão de login', error);
                    setStatus('error');
                    setMessage('Não foi possível verificar sua sessão. Por favor, tente fazer login novamente.');
                    // Opcional: redirecionar para a página de login após um tempo
                    setTimeout(() => navigate('/login'), 5000);
                }
            } else {
                LogSupremo.Log.warn('HookPonteSucesso', 'Nenhum session_id encontrado na URL.');
                navigate('/login'); // Redireciona para o login se não houver sessionId
            }
        };

        handleSuccess();
    }, [location, navigate]);

    // O status e a mensagem podem ser retornados e usados no componente `SuccessBridge`
    return { status, message }; 
};