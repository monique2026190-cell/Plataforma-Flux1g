
import { initAuditorDeRequisições } from '../ServiçosFrontend/ServiçoDeTelemetria/AuditorDeRequisições.js';
import SistemaLog from './Sistema.Log'; // Importa o novo sistema de log

/**
 * Inicializa os serviços de boot da aplicação (Nível 1).
 */
export function inicializarBoot() {
  // Inicializa o auditor de requisições para telemetria.
  initAuditorDeRequisições();
  SistemaLog.info("BOOT", "Auditor de Requisições para telemetria inicializado.");

  // A importação do i18n (se existir) garante sua inicialização.
  SistemaLog.info("BOOT", "Boot (Nível 1) inicializado: Erros, Telemetria, i18n.");
}
