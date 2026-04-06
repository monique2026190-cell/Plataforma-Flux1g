
interface IConfiguracoesGrupo {
    idGrupo: string;
    nome?: string;
    descricao?: string;
    privacidade?: 'publico' | 'privado';
    diretrizes?: string;
    notificacoes?: {
        todosOsPosts: boolean;
        mencoes: boolean;
    };
}

/**
 * Representa as configurações de um grupo, garantindo a validação e consistência dos dados.
 */
class ModelsEstruturaConfiguracoesGrupo {
    idGrupo: string;
    nome?: string;
    descricao?: string;
    privacidade?: 'publico' | 'privado';
    diretrizes?: string;
    notificacoes?: {
        todosOsPosts: boolean;
        mencoes: boolean;
    };

    constructor({ idGrupo, nome, descricao, privacidade, diretrizes, notificacoes }: IConfiguracoesGrupo) {
        this.idGrupo = idGrupo;
        this.nome = nome;
        this.descricao = descricao;
        this.privacidade = privacidade;
        this.diretrizes = diretrizes;
        this.notificacoes = notificacoes;

        this.validar();
    }

    /**
     * Valida os dados essenciais do modelo.
     * Lança um erro se a validação falhar.
     */
    validar(): void {
        if (!this.idGrupo) {
            const erro = 'ID do grupo é obrigatório para as configurações.';
            throw new Error(erro);
        }
        if (this.nome !== undefined && (typeof this.nome !== 'string' || this.nome.trim().length === 0)) {
            const erro = 'O nome do grupo, se fornecido, não pode ser vazio.';
            throw new Error(erro);
        }
        // Adicionar outras validações essenciais aqui
    }

    /**
     * Converte a instância do modelo para um objeto simples, ideal para ser enviado em respostas de API ou salvo no banco.
     * @returns {IConfiguracoesGrupo} Um objeto com os dados do modelo.
     */
    toObject(): IConfiguracoesGrupo {
        return {
            idGrupo: this.idGrupo,
            nome: this.nome,
            descricao: this.descricao,
            privacidade: this.privacidade,
            diretrizes: this.diretrizes,
            notificacoes: this.notificacoes,
        };
    }

    /**
     * Cria uma instância de ModelsEstruturaConfiguracoesGrupo a partir de um objeto de dados.
     * @param {IConfiguracoesGrupo} data - O objeto com os dados.
     * @returns {ModelsEstruturaConfiguracoesGrupo} Uma nova instância do modelo.
     */
    static fromObject(data: IConfiguracoesGrupo): ModelsEstruturaConfiguracoesGrupo {
        return new ModelsEstruturaConfiguracoesGrupo(data);
    }
}

export default ModelsEstruturaConfiguracoesGrupo;
