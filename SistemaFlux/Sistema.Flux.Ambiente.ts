
import SistemaLog from './Sistema.Log'; // Importa o novo sistema de log

/**
 * Configura e valida o ambiente da aplicação (Nível 2).
 */
export function configurarAmbiente() {
  const isProduction = import.meta.env.MODE === 'production';

  if (!isProduction) {
    SistemaLog.aviso("AMBIENTE", "Modo de Desenvolvimento ATIVADO. A simulação foi desativada.");
  } else {
    SistemaLog.info("AMBIENTE", "Modo de Produção ATIVADO.");
  }

  SistemaLog.info("AMBIENTE", "Ambiente (Nível 2) configurado.");
}
