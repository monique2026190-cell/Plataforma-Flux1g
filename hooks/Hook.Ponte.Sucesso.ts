
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../ServiçosFrontend/ServiçoDeAutenticação/Provedor.Autenticacao';
import { createHookLogger } from '../ServiçosFrontend/SistemaObservabilidade/Log.Hook';

const log = createHookLogger('HookPonteSucesso');

export const HookPonteSucesso = () => {
    const auth = useAuth(); // Corrigido: Acessa o serviço de autenticação pelo provedor
    const navigate = useNavigate();
    const location = useLocation();
    const [status, setStatus] = useState('validating'); // validating, ready, error
    const [message, setMessage] = useState('Aguarde enquanto verificamos suas credenciais...');

    useEffect(() => {
        const handleSuccess = async () => {
            log.logStart('handleSuccess');
            const query = new URLSearchParams(location.search);
            const sessionId = query.get('session_id');

            if (sessionId) {
                try {
                    // Acessa o método unificado do serviço de autenticação
                    const redirect = await auth.resolverRedirecionamentoLogin(sessionId);
                    log.logSuccess('handleSuccess', { redirect });

                    // Lógica de redirecionamento
                    if (redirect?.type === 'feed') {
                        navigate('/feed');
                    } else if (redirect?.type === 'complete-profile') {
                        navigate('/complete-profile');
                    } else if (redirect?.type === 'group') {
                        navigate(`/g/${redirect.groupId}`);
                    } else {
                        navigate(redirect?.fallbackUrl || '/');
                    }

                } catch (error) {
                    log.logError('handleSuccess', error);
                    setStatus('error');
                    setMessage('Não foi possível verificar sua sessão. Por favor, tente fazer login novamente.');
                    setTimeout(() => navigate('/login'), 5000);
                }
            } else {
                log.logError('handleSuccess', 'Nenhum session_id encontrado na URL.');
                navigate('/login');
            }
        };

        handleSuccess();
    }, [location, navigate, auth]); // Adicionado `auth` ao array de dependências

    return { status, message }; 
};
