
export interface ISessao {
    id?: string;
    idUsuario: string;
    token: string;
    expiraEm: Date;
    userAgent: string;
    enderecoIp: string;
    dataCriacao: Date;
}
