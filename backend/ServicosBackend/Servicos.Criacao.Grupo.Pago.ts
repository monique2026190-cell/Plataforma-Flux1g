
// backend/ServicosBackend/Servicos.Criacao.Grupo.Pago.ts
import Grupo from '../models/Models.Estrutura.Grupos.js';
import repositorioGrupo from '../Repositorios/Repositorio.Estrutura.Grupos.js';

class GrupoPagoService {
    async criar(dadosGrupo: any, idUsuario: any) {
        if (!idUsuario) {
            throw new Error("Usuário não autenticado.");
        }

        const grupo = new Grupo({
            ...dadosGrupo,
            tipo: 'pago',
            donoId: idUsuario,
            preco: dadosGrupo.preco ? parseFloat(dadosGrupo.preco) : 0
        });

        const novoGrupo = await repositorioGrupo.criar(grupo.paraBancoDeDados());
        return Grupo.deBancoDeDados(novoGrupo);
    }
}

export default new GrupoPagoService();
