
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';

// --- Serviços de provedores de pagamento ---
import { ServicoGestaoCredencialPayPal } from '../ServiçosFrontend/ServiçoDeProvedoresDePagamentos/ServiçoGestãoCredencialPayPal.js';
import { ServicoGestaoCredencialStripe } from '../ServiçosFrontend/ServiçoDeProvedoresDePagamentos/ServiçoGestãoCredencialStripe.js';
import { ServicoGestaoCredencialSyncPay } from '../ServiçosFrontend/ServiçoDeProvedoresDePagamentos/ServiçoGestãoCredencialSyncPay.js';

import { Group } from '../types';

/**
 * Hook customizado para gerenciar a configuração de provedores de pagamento.
 * NOTA: A funcionalidade de grupo foi removida. Este hook foi mantido mas neutralizado
 * para preservar a lógica de integração com os provedores de pagamento.
 */
export const HookConfiguracaoProvedor = () => {
    const { groupId } = useParams<{ groupId: string }>(); // Mantido para referência, pode ser alterado para userId
    const [group, setGroup] = useState<Group | null>(null);
    const [activeProviderId, setActiveProviderId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const updateGroupState = useCallback(async () => {
        if (!groupId) return;
        setIsLoading(true);
        // CORREÇÃO: A chamada ao groupService foi removida. O hook agora retorna um estado nulo.
        setGroup(null);
        setActiveProviderId(null);
        setIsLoading(false);
    }, [groupId]);

    useEffect(() => {
        updateGroupState();
    }, [updateGroupState]);

    const handleCredentialsSubmit = useCallback(async (providerId: string, credentials: any) => {
        if (!groupId || providerId !== 'syncpay') return;
        setIsLoading(true);
        setError(null);
        try {
            await ServicoGestaoCredencialSyncPay.salvarCredenciais(credentials);
            await updateGroupState(); 
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Falha ao salvar credenciais.';
            setError(message);
        }
    }, [groupId, updateGroupState]);

    const handleConnect = useCallback(async (providerId: string) => {
        setError(null);
        try {
            // A URL de retorno pode precisar ser ajustada para um contexto de usuário, não de grupo
            const returnUrl = `${window.location.origin}/settings/payments?provider=${providerId}&status=success`;
            const refreshUrl = `${window.location.origin}/settings/payments`;

            if (providerId === 'stripe') {
                await ServicoGestaoCredencialStripe.conectarConta(returnUrl, refreshUrl);
            } else if (providerId === 'paypal') {
                await ServicoGestaoCredencialPayPal.conectarConta(returnUrl);
            }
        } catch (err) {
             const message = err instanceof Error ? err.message : `Falha ao iniciar conexão com ${providerId}.`;
             setError(message);
        }
    }, [groupId]);

    const handleDisconnect = useCallback(async (providerId: string) => {
        if (!groupId) return;
        setIsLoading(true);
        setError(null);

        const serviceMap: { [key: string]: () => Promise<any> } = {
            paypal: ServicoGestaoCredencialPayPal.desconectarConta,
            stripe: ServicoGestaoCredencialStripe.desconectarConta,
            syncpay: ServicoGestaoCredencialSyncPay.desconectarConta,
        };

        try {
            await serviceMap[providerId]();
            await updateGroupState();
        } catch (err) {
            const message = err instanceof Error ? err.message : `Falha ao desconectar ${providerId}.`;
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }, [groupId, updateGroupState]);

    const handleSelectProvider = useCallback(async (providerId: string) => {
        if (!groupId) return;
        setIsLoading(true);
        try {
            // A lógica de backend para definir o provedor ativo precisaria ser ajustada
            await updateGroupState();
        } catch (err) {
             const message = err instanceof Error ? err.message : `Falha ao selecionar ${providerId}.`;
             setError(message);
        } finally {
            setIsLoading(false);
        }
    }, [groupId, updateGroupState]);

    return {
        group,
        activeProviderId,
        isLoading,
        error,
        handleCredentialsSubmit,
        handleConnect,
        handleDisconnect,
        handleSelectProvider
    };
};
