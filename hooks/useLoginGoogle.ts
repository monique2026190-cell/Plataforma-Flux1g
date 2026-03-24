
import { useState, useCallback } from 'react';
import SistemaAutenticacaoSupremo from '../ServiçosFrontend/ServiçoDeAutenticação/Sistema.Autenticacao.Supremo';
import LogLoginGoogle from '../ServiçosFrontend/SistemaObservabilidade/Log.Hook.Login.Google';

export const useLoginGoogle = () => {
    const [processando, setProcessando] = useState(false);
    const [erro, setErro] = useState('');

    const loginComGoogle = useCallback(async (credentialResponse: any) => {
        if (!credentialResponse || !credentialResponse.credential) {
            const errorMessage = "A credencial do Google fornecida é inválida ou nula.";
            LogLoginGoogle.loginFalha(new Error(errorMessage), 'validacao_credencial');
            setErro(errorMessage);
            return;
        }

        setProcessando(true);
        setErro('');

        try {
            await SistemaAutenticacaoSupremo.loginWithGoogle(credentialResponse.credential, undefined);
        } catch (err: any) {
            // O erro já foi logado dentro do SistemaAutenticacaoSupremo.
            // Apenas atualizamos o estado para a UI.
            setErro(err.message || 'Falha no login com Google.');
        } finally {
            setProcessando(false);
        }
    }, []);

    return {
        processandoLoginGoogle: processando,
        erroLoginGoogle: erro,
        setErroLoginGoogle: setErro,
        loginComGoogle,
    };
};
