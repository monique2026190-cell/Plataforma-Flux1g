
/**
 * @file Sistema Grupo Supremo: Ponto de entrada unificado para TODAS as operações de grupo.
 *
 * Este módulo implementa o padrão de fachada (Facade) para simplificar a interação com grupos.
 * Ele consolida a CRIAÇÃO, a CONFIGURAÇÃO, e a GESTÃO DE LISTAS de grupos
 * em uma única interface, `SistemaGrupoSupremo`.
 *
 * Qualquer parte da aplicação pode importar este sistema para acessar qualquer funcionalidade de grupo.
 * Ex: `SistemaGrupoSupremo.criarGrupoPublico(dados);`
 * Ex: `SistemaGrupoSupremo.atualizarCargo(dados);`
 * Ex: `SistemaGrupoSupremo.buscarMeusGrupos();`
 */

// Importações de Criação
import * as publicGroupCreation from './Criação.Grupo.Publico';
import * as privateGroupCreation from './Criação.Grupo.Privado';
import * as paidGroupCreation from './Criação.Grupo.Pago';

// Importação de Configuração
import { sistemaConfiguracoesGrupo } from './Sistema.Configuracoes.Grupo';

// Importação de Gestão de Listas
import * as groupListService from './Servico.Gestao.Lista.Grupo';

/**
 * O Sistema Grupo Supremo agrega e expõe TODOS os métodos de criação, configuração e listagem de grupos
 * a partir de uma interface única e simplificada.
 */
export const SistemaGrupoSupremo = {
    // Métodos de Criação
    ...publicGroupCreation,
    ...privateGroupCreation,
    ...paidGroupCreation,

    // Métodos de Configuração e Gestão
    ...sistemaConfiguracoesGrupo,

    // Métodos de Gestão de Listas de Grupo
    ...groupListService,
};
