
// backend/models/Models.Estrutura.Sessao.ts

interface ISessaoData {
    id?: string;
    user_id?: string;
    idUsuario?: string;
    token?: string;
    expires_at?: Date;
    expiraEm?: Date;
    user_agent?: string;
    userAgent?: string;
    ip_address?: string;
    enderecoIp?: string;
    created_at?: Date;
    dataCriacao?: Date;
}

class Sessao {
    id?: string;
    idUsuario: string;
    token: string;
    expiraEm: Date;
    userAgent: string;
    enderecoIp: string;
    dataCriacao: Date;

    constructor(data: ISessaoData) {
        const userId = data.user_id || data.idUsuario;
        if (!userId) {
            throw new Error('User ID is required to create a session.');
        }

        this.id = data.id;
        this.idUsuario = userId;
        this.token = data.token || '';
        this.expiraEm = data.expires_at || data.expiraEm || new Date();
        this.userAgent = data.user_agent || data.userAgent || '';
        this.enderecoIp = data.ip_address || data.enderecoIp || '';
        this.dataCriacao = data.created_at || data.dataCriacao || new Date();
    }

    paraBancoDeDados() {
        if (!this.idUsuario) {
            throw new Error('O ID do usuário é obrigatório para salvar a sessão.');
        }
        return {
            id: this.id,
            user_id: this.idUsuario,
            token: this.token,
            expires_at: this.expiraEm,
            user_agent: this.userAgent,
            ip_address: this.enderecoIp,
            created_at: this.dataCriacao
        };
    }

    static deBancoDeDados(dbData: any): Sessao | null {
        if (!dbData) {
            return null;
        }

        return new Sessao({
            id: dbData.id,
            idUsuario: dbData.user_id,
            token: dbData.token,
            expiraEm: dbData.expires_at,
            userAgent: dbData.user_agent,
            enderecoIp: dbData.ip_address,
            dataCriacao: dbData.created_at
        });
    }

    paraRespostaHttp() {
        return {
            id: this.id,
            idUsuario: this.idUsuario,
            expiraEm: this.expiraEm,
            dataCriacao: this.dataCriacao
        };
    }
}

export default Sessao;
