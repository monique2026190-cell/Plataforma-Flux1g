
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getInstanciaSuprema } from '../ServiçosFrontend/ServiçoDeAutenticação/Sistema.Autenticacao.Supremo';
const authService = getInstanciaSuprema();
import { useAuth } from '../ServiçosFrontend/ServiçoDeAutenticação/Provedor.Autenticacao';
import { createHookLogger } from '../ServiçosFrontend/SistemaObservabilidade/Log.Hook';

const hookLogger = createHookLogger('useLogout');

export const useLogout = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [processando, setProcessando] = useState(false);
    const [erro, setErro] = useState('');

    const submeterLogout = async () => {
        hookLogger.logStart('submeterLogout', { userId: user?.id });
        setProcessando(true);
        setErro('');
        
        try {
            await authService.logout();
            hookLogger.logSuccess('submeterLogout', { userId: user?.id });
            navigate('/login');
        } catch (err: any) {
            hookLogger.logError('submeterLogout', err, { userId: user?.id });
            setErro(err.message || 'Falha ao fazer logout.');
        } finally {
            setProcessando(false);
        }
    };

    return {
        processando,
        erro,
        setErro,
        submeterLogout,
    };
};
