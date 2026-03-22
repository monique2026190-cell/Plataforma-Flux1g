import { Grupo, VipDoor, Pixel } from "../types/Saida/Types.Estrutura.Grupos";

/**
 * Representa o modelo de um Grupo no frontend.
 * Garante que os dados do grupo sejam consistentes e fáceis de manipular em toda a aplicação.
 */
export class GroupModel implements Grupo {
    id: string;
    nome: string;
    descricao: string;
    tipo: "publico" | "privado" | "pago";
    preco?: number;
    moeda?: string;
    donoId: string;
    dataCriacao: string;
    limiteMembros?: number;
    imagemCapa?: string;
    tipoAcesso: "direto" | "convite";
    accessConfig?: any;
    provedorPagamentoId?: string;
    dataExpiracao?: string;
    vipDoor?: VipDoor;
    pixel?: Pixel;

    constructor(data: Grupo) {
        this.id = data.id;
        this.nome = data.nome;
        this.descricao = data.descricao;
        this.tipo = data.tipo;
        this.preco = data.preco;
        this.moeda = data.moeda;
        this.donoId = data.donoId;
        this.dataCriacao = data.dataCriacao;
        this.limiteMembros = data.limiteMembros;
        this.imagemCapa = data.imagemCapa;
        this.tipoAcesso = data.tipoAcesso;
        this.accessConfig = data.accessConfig;
        this.provedorPagamentoId = data.provedorPagamentoId;
        this.dataExpiracao = data.dataExpiracao;
        this.vipDoor = data.vipDoor;
        this.pixel = data.pixel;
    }

    /**
     * Cria uma instância de GroupModel a partir de um objeto de dados brutos (ex: da API).
     * @param data O objeto com os dados do grupo, que deve ser do tipo `Partial<Grupo>`.
     * @returns Uma nova instância de GroupModel ou null se os dados forem insuficientes.
     */
    static fromObject(data: Partial<Grupo>): GroupModel {
        if (!data || !data.id || !data.nome || !data.donoId) {
            // Retorna null se dados essenciais estiverem faltando para evitar erros.
            console.warn("Tentativa de criar GroupModel com dados insuficientes.", data);
            return null;
        }

        // Preenche com valores padrão seguros para garantir a integridade do objeto.
        const completeData: Grupo = {
            id: data.id,
            nome: data.nome,
            donoId: data.donoId,
            descricao: data.descricao || '',
            tipo: data.tipo || 'privado',
            dataCriacao: data.dataCriacao || new Date().toISOString(),
            tipoAcesso: data.tipoAcesso || 'convite',
            ...data, // Mantém os outros campos que possam ter sido passados
        };

        return new GroupModel(completeData);
    }

    /**
     * Converte a instância do modelo para um objeto simples (plain object).
     * Útil para enviar dados atualizados para a API.
     * @returns Um objeto literal que corresponde à interface `Grupo`.
     */
    toObject(): Grupo {
        return {
            id: this.id,
            nome: this.nome,
            descricao: this.descricao,
            tipo: this.tipo,
            preco: this.preco,
            moeda: this.moeda,
            donoId: this.donoId,
            dataCriacao: this.dataCriacao,
            limiteMembros: this.limiteMembros,
            imagemCapa: this.imagemCapa,
            tipoAcesso: this.tipoAcesso,
            accessConfig: this.accessConfig,
            provedorPagamentoId: this.provedorPagamentoId,
            dataExpiracao: this.dataExpiracao,
            vipDoor: this.vipDoor,
            pixel: this.pixel,
        };
    }
}
