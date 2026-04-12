
import { useNavigate } from 'react-router-dom';

/**
 * @description Define a estrutura de dados esperada para um grupo, focando nas propriedades essenciais para a navegação.
 */
interface GrupoParaNavegacao {
    id: string;
    modoHubAtivo: boolean;
}

/**
 * @description Hook customizado para determinar a ação de clique em um item de grupo.
 * Centraliza a lógica de navegação com base na configuração 'Modo Hub' do grupo.
 * 
 * @returns Um objeto contendo a função `resolverAcaoDoClique`.
 */
export const useConfiguracaoGrupo = () => {
    const navigate = useNavigate();

    /**
     * @description Decide para qual página navegar com base no estado do 'Modo Hub' do grupo.
     * @param grupo O objeto do grupo que foi clicado. Deve conter 'id' e 'modoHubAtivo'.
     */
    const resolverAcaoDoClique = (grupo: GrupoParaNavegacao) => {
        if (grupo.modoHubAtivo) {
            // Se o Modo Hub estiver ativo, navega para a página de hospedagem de arquivos do grupo.
            navigate(`/group/${grupo.id}/files`);
        } else {
            // Caso contrário, navega para a página de chat padrão do grupo.
            navigate(`/group-chat/${grupo.id}`);
        }
    };

    return { resolverAcaoDoClique };
};
