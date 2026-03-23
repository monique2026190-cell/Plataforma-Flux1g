
import { inicializarBoot } from './Sistema.Flux.Boot';
import { configurarAmbiente } from './Sistema.Flux.Ambiente';
import { montarNucleoReact } from './Sistema.Nucleo.Inicializador';
import SistemaLog from './Sistema.Log'; // Importa o novo sistema de log

/**
 * App.Flux (Camada 1 - Orquestração)
 */
class AppFlux {
    public static iniciar(): void {
        SistemaLog.info("APPFLUX", "Iniciando orquestração da aplicação.");

        try {
            // Camada 2: Inicialização de baixo nível
            inicializarBoot();

            // Camada 2.5: Configuração de ambiente
            configurarAmbiente();

            // Camada 3: Montagem do React
            montarNucleoReact();

            SistemaLog.info("APPFLUX", "Orquestração concluída com sucesso. A aplicação está pronta.");

        } catch (erro) {
            SistemaLog.erro("APPFLUX", "Erro Crítico durante a orquestração", erro);
        }
    }
}

export default AppFlux;
