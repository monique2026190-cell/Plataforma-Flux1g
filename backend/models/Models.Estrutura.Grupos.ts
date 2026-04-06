
interface IGrupo {
    id?: number;
    nome: string;
    descricao?: string;
    tipo: 'publico' | 'privado' | 'pago';
    preco?: number;
    moeda?: string;
    donoId: number;
    dataCriacao?: Date;
    limiteMembros?: number;
    imagemCapa?: string | null;
    tipoAcesso?: string | null;
    accessConfig?: any | null;
    provedorPagamentoId?: string | null;
    dataExpiracao?: Date | null;
    vipDoor?: {
        text: string;
        buttonText: string;
        media: {
            url: string;
            type: string;
        }[];
    } | null;
    pixel?: {
        id: string;
        token: string;
    } | null;
}

class Grupo {
    id?: number;
    nome: string;
    descricao?: string;
    tipo: 'publico' | 'privado' | 'pago';
    preco: number;
    moeda?: string;
    donoId: number;
    dataCriacao: Date;
    limiteMembros: number;
    imagemCapa?: string | null;
    tipoAcesso?: string | null;
    accessConfig?: any | null;
    provedorPagamentoId?: string | null;
    dataExpiracao?: Date | null;
    vipDoor?: {
        text: string;
        buttonText: string;
        media: {
            url: string;
            type: string;
        }[];
    } | null;
    pixel?: {
        id: string;
        token: string;
    } | null;

    constructor({
        id,
        nome,
        descricao,
        tipo, 
        preco = 0,
        moeda,
        donoId,
        dataCriacao,
        limiteMembros = 0,
        imagemCapa = null,
        tipoAcesso = null,
        accessConfig = null,
        provedorPagamentoId = null,
        dataExpiracao = null,
        vipDoor = null,
        pixel = null,
    }: IGrupo) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.tipo = tipo;
        this.preco = parseFloat(preco.toString()) || 0;
        this.moeda = moeda;
        this.donoId = donoId;
        this.dataCriacao = dataCriacao || new Date();
        this.limiteMembros = limiteMembros;
        this.imagemCapa = imagemCapa;
        this.tipoAcesso = tipoAcesso;
        this.accessConfig = accessConfig;
        this.provedorPagamentoId = provedorPagamentoId;
        this.dataExpiracao = dataExpiracao;
        this.vipDoor = vipDoor;
        this.pixel = pixel;

        this.validar();
    }

    validar(): void {
        if (!this.nome || this.nome.trim().length === 0) {
            throw new Error('O nome do grupo é obrigatório.');
        }
        if (!this.donoId) {
            throw new Error('O grupo precisa ter um dono.');
        }
        if (!['publico', 'privado', 'pago'].includes(this.tipo)) {
            throw new Error(`Tipo de grupo inválido: ${this.tipo}`);
        }
        if (this.tipo === 'pago') {
            if (!this.preco || this.preco <= 0) {
                throw new Error('Grupos pagos devem ter um preço maior que zero.');
            }
            if (!this.moeda) {
                throw new Error('A moeda é obrigatória para grupos pagos.');
            }
        }
        if (this.tipo !== 'pago') {
            this.preco = 0;
            this.moeda = undefined;
        }
    }

    paraBancoDeDados() {
        return {
            id: this.id,
            name: this.nome,
            description: this.descricao,
            group_type: this.tipo,
            price: this.preco,
            currency: this.moeda,
            creator_id: this.donoId,
            created_at: this.dataCriacao,
            member_limit: this.limiteMembros,
            cover_image: this.imagemCapa,
            access_type: this.tipoAcesso,
            access_config: this.accessConfig,
            selected_provider_id: this.provedorPagamentoId,
            expiration_date: this.dataExpiracao,
            vip_door: this.vipDoor,
            pixel_id: this.pixel ? this.pixel.id : null,
            pixel_token: this.pixel ? this.pixel.token : null,
            is_vip: this.tipo === 'pago',
            status: 'active'
        };
    }

    static deBancoDeDados(dados: any): Grupo | null {
        if (!dados) return null;
        return new Grupo({
            id: dados.id,
            nome: dados.name,
            descricao: dados.description,
            tipo: dados.group_type,
            preco: dados.price,
            moeda: dados.currency,
            donoId: dados.creator_id,
            dataCriacao: dados.created_at,
            limiteMembros: dados.member_limit,
            imagemCapa: dados.cover_image,
            tipoAcesso: dados.access_type,
            accessConfig: dados.access_config,
            provedorPagamentoId: dados.selected_provider_id,
            dataExpiracao: dados.expiration_date,
            vipDoor: dados.vip_door,
            pixel: (dados.pixel_id) ? {
                id: dados.pixel_id,
                token: dados.pixel_token
            } : null
        });
    }

    paraRespostaHttp() {
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
            pixel: this.pixel
        };
    }
}

export default Grupo;
