
import React from 'react';
import { createRoot } from 'react-dom/client';
import SistemaNucleoApp from './Sistema.Nucleo.App';
import { GoogleOAuthProvider } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function iniciarApp() {
  try {
    montaReact();
  } catch (erro) {
    console.error("Erro crítico durante a inicialização", erro);
  }
}

function montaReact() {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error("Elemento 'root' não foi encontrado.");
  }

  if (!GOOGLE_CLIENT_ID) {
    console.error("VITE_GOOGLE_CLIENT_ID não está definido. O login com Google não funcionará.");
  }

  const root = createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID!}>
        <SistemaNucleoApp />
      </GoogleOAuthProvider>
    </React.StrictMode>
  );
}

document.addEventListener('DOMContentLoaded', iniciarApp);
