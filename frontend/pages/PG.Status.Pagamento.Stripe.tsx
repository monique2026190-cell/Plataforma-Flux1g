
import React, { useState, useEffect } from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import { NextPage } from 'next';
import Link from 'next/link';

const PGStatusPagamentoStripe: NextPage = () => {
    const stripe = useStripe();
    const [message, setMessage] = useState<string | null>(null);
    const [status, setStatus] = useState<'success' | 'error' | 'loading'>('loading');

    useEffect(() => {
        if (!stripe) {
            setStatus('error');
            setMessage('A conexão com o sistema de pagamento não pôde ser estabelecida.');
            return;
        }

        const clientSecret = new URLSearchParams(window.location.search).get('payment_intent_client_secret');

        if (!clientSecret) {
            setStatus('error');
            setMessage('O identificador do pagamento não foi encontrado. Por favor, contate o suporte.');
            return;
        }

        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
            switch (paymentIntent?.status) {
                case 'succeeded':
                    setStatus('success');
                    setMessage('Seu pagamento foi aprovado com sucesso! Bem-vindo(a) ao grupo.');
                    break;
                case 'processing':
                    setStatus('loading');
                    setMessage('Seu pagamento está sendo processado. Atualizaremos você em breve.');
                    break;
                case 'requires_payment_method':
                    setStatus('error');
                    setMessage('Falha no pagamento. Por favor, tente um método de pagamento diferente.');
                    break;
                default:
                    setStatus('error');
                    setMessage('Algo deu errado com o seu pagamento. Por favor, tente novamente.');
                    break;
            }
        });
    }, [stripe]);

    const renderIcon = () => {
        switch (status) {
            case 'loading':
                return <i className="fa-solid fa-circle-notch fa-spin text-5xl text-blue-500"></i>;
            case 'success':
                return <i className="fa-solid fa-circle-check text-5xl text-green-500"></i>;
            case 'error':
                return <i className="fa-solid fa-circle-exclamation text-5xl text-red-500"></i>;
        }
    };

    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            minHeight: '100vh', 
            backgroundColor: '#111', 
            color: 'white', 
            fontFamily: '"Inter", sans-serif' 
        }}>
            <div style={{ 
                padding: '40px', 
                backgroundColor: '#1a1a1a', 
                borderRadius: '20px', 
                textAlign: 'center', 
                maxWidth: '400px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
            }}>
                <div style={{ marginBottom: '24px' }}>
                    {renderIcon()}
                </div>
                <h1 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '16px' }}>
                    {status === 'loading' ? 'Verificando Pagamento...' : (status === 'success' ? 'Pagamento Concluído' : 'Erro no Pagamento')}
                </h1>
                <p style={{ fontSize: '14px', color: '#aaa', lineHeight: '1.6', marginBottom: '32px' }}>
                    {message || 'Aguarde um momento...'}
                </p>
                <Link href="/">
                    <a style={{
                        display: 'inline-block',
                        padding: '12px 24px',
                        backgroundColor: '#00c2ff',
                        color: '#000',
                        borderRadius: '12px',
                        fontWeight: 'bold',
                        textDecoration: 'none',
                        transition: 'transform 0.2s'
                    }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}>
                        Voltar para a Página Inicial
                    </a>
                </Link>
            </div>
        </div>
    );
};

export default PGStatusPagamentoStripe;
