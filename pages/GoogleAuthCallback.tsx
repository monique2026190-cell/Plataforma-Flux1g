
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
// Importação corrigida para usar a exportação padrão
import SistemaAutenticacaoSupremo from '../ServiçosFrontend/ServiçoDeAutenticação/Sistema.Autenticacao.Supremo';

const GoogleAuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const code = searchParams.get('code');

    if (code) {
      console.log("INFO: [GoogleAuthCallback] Código de autorização recebido:", code);
      
      // Chamada corrigida para usar a função handleGoogleCallback
      SistemaAutenticacaoSupremo.handleGoogleCallback(code)
        .then(response => {
          console.log("INFO: [GoogleAuthCallback] Autenticação com Google bem-sucedida!", response);
          // O SistemaAutenticacaoSupremo já atualizou seu estado interno.
          // A navegação dependerá se o usuário é novo ou não.
          if (response.isNewUser) {
              navigate('/completar-perfil'); // Redireciona para completar o perfil
          } else {
              navigate('/'); // Redireciona para a página inicial
          }
        })
        .catch(err => {
          console.error("ERRO: [GoogleAuthCallback] Falha na troca do código do Google:", err);
          setError("Falha ao autenticar com o Google. Por favor, tente novamente.");
          setLoading(false);
        });
    } else {
      const errorDescription = searchParams.get('error');
      console.error("ERRO: [GoogleAuthCallback] Erro no callback do Google:", errorDescription);
      setError(`Ocorreu um erro: ${errorDescription || 'Nenhum código de autorização foi fornecido.'}`);
      setLoading(false);
    }
  }, [searchParams, navigate]);

  if (loading) {
    return <div>Processando autenticação...</div>;
  }

  if (error) {
    return (
      <div>
        <h1>Erro de Autenticação</h1>
        <p>{error}</p>
        <button onClick={() => navigate('/login')}>Voltar para o Login</button>
      </div>
    );
  }

  // A renderização padrão é um loader, pois o redirecionamento ocorre no final do useEffect.
  return <div>Redirecionando...</div>;
};

export default GoogleAuthCallback;
