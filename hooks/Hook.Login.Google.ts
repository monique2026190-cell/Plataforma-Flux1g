import { useState, useCallback, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SistemaAutenticacaoSupremo from '../ServiçosFrontend/ServiçoDeAutenticação/Sistema.Autenticacao.Supremo';
import { trackingService } from '../ServiçosFrontend/ServiçoDeRastreamento/ServiçoDeRastreamento.js';

export const useGoogleLogin = () => {
    const location = useLocation();
    const [processando, setProcessando] = useState(false);
    const [erro, setErro] = useState<any>(null);

    useEffect(() => {
        try {
            trackingService.captureUrlParams();
        } catch (error) {
            console.error("Falha ao capturar parâmetros de URL para rastreamento:", error);
        }
    }, [location]);

    const submeterLoginGoogle = useCallback(async (credentialResponse: any) => {
        if (!credentialResponse || !credentialResponse.credential) {
            setErro(new Error("Credencial do Google inválida."));
            return;
        }

        setProcessando(true);
        setErro(null);

        try {
            const referredBy = trackingService.getAffiliateRef() || undefined;
            await SistemaAutenticacaoSupremo.loginWithGoogle(credentialResponse.credential, referredBy);
        } catch (err) {
            setErro(err);
        } finally {
            setProcessando(false);
        }
    }, []);

    return {
        processando,
        erro,
        submeterLoginGoogle,
    };
};
