
// Componentes/ComponentesDeProvedores/CardsOpcoesDePagamentos/ProcessadorDePagamentoStripe.tsx
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

// IMPORTANTE: Substitua pela sua chave publicável da Stripe!
// Você pode encontrar essa chave no seu Dashboard da Stripe.
const stripePromise = loadStripe('pk_test_YOUR_PUBLISHABLE_KEY');

interface ProcessadorDePagamentoStripeProps {
    groupId: string; // ID do grupo para o qual o pagamento está sendo feito
    amount: number;  // Valor a ser cobrado (em centavos)
    children: React.ReactNode; // <- Aqui é onde os formulários visuais (cards) entrarão
}

/**
 * Componente LÓGICO (não visual) que orquestra o processo de pagamento da Stripe.
 * 1. Pede uma "intenção de pagamento" ao backend.
 * 2. Prepara o ambiente da Stripe com a chave recebida.
 * 3. Renderiza os componentes filhos (os formulários de pagamento) dentro deste ambiente.
 */
export const ProcessadorDePagamentoStripe: React.FC<ProcessadorDePagamentoStripeProps> = ({ groupId, amount, children }) => {
    const [clientSecret, setClientSecret] = useState<string | null>(null);

    useEffect(() => {
        // Esta função assíncrona é chamada assim que o componente monta.
        const criarIntencaoDePagamento = async () => {
            try {
                // Rota do SEU BACKEND que precisa ser criada.
                const response = await fetch('/api/pagamentos/criar-intencao', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ amount, groupId }),
                });

                const data = await response.json();

                if (!response.ok) {
                    // Se o backend retornar um erro, ele será capturado aqui.
                    throw new Error(data.error || 'Falha ao criar intenção de pagamento no servidor.');
                }

                setClientSecret(data.clientSecret);
            } catch (error) {
                console.error("Erro ao inicializar pagamento:", error);
                // Você pode querer definir um estado de erro aqui para mostrar uma mensagem ao usuário.
            }
        };

        if (groupId && amount > 0) {
            criarIntencaoDePagamento();
        }
    }, [groupId, amount]);

    // Aparência dos formulários da Stripe (tema escuro para combinar com o app)
    const appearance = {
        theme: 'night' as const,
        variables: {
            colorPrimary: '#635bff',
            colorBackground: '#1a1a1a',
            colorText: '#ffffff',
        },
    };

    // Enquanto o clientSecret não chega do backend, mostramos um loader.
    if (!clientSecret) {
        return <div>Inicializando pagamento seguro...</div>;
    }

    // Uma vez que temos o clientSecret, montamos o ambiente da Stripe
    // e renderizamos os {children} (os formulários) dentro dele.
    return (
        <Elements options={{ clientSecret, appearance }} stripe={stripePromise}>
            {children}
        </Elements>
    );
};
