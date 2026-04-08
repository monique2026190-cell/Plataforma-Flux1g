
// backend/ServicosBackend/Servicos.Criacao.Grupo.Privado.ts
import Grupo from '../models/Models.Estrutura.Grupos.js';
import repositorioGrupo from '../Repositorios/Repositorio.Estrutura.Grupos.js';

class GrupoPrivadoService {
    async criar(dadosGrupo: any, idUsuario: any) {
        if (!idUsuario) {
            throw new Error("Usuário não autenticado.");
        }

        const grupo = new Grupo({
            ...dadosGrupo,
            tipo: 'privado',
            donoId: idUsuario
        });

        const novoGrupo = await repositorioGrupo.criar(grupo.paraBancoDeDados());
        return Grupo.deBancoDeDados(novoGrupo);
    }
}

export default new GrupoPrivadoService();
