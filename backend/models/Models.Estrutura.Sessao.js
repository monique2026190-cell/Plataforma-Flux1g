
// backend/models/Models.Estrutura.Sessao.js

import createModelLogger from '../config/Log.Models.js';

const logger = createModelLogger('Models.Estrutura.Sessao.js');

class Sessao {
    constructor(data) {
        // Padroniza o recebimento do ID do usuário, aceitando ambos os formatos.
        const userId = data.user_id || data.idUsuario;
        logger.info('Criando nova instância de Sessão.', { sessionId: data.id, userId });
        
        this.id = data.id;
        this.idUsuario = userId; // Utiliza o ID padronizado.
        this.token = data.token;
        this.expiraEm = data.expires_at || data.expiraEm;
        this.userAgent = data.user_agent || data.userAgent;
        this.enderecoIp = data.ip_address || data.enderecoIp;
        this.dataCriacao = data.created_at || data.dataCriacao || new Date();
    }

    paraBancoDeDados() {
        logger.info('Convertendo modelo de sessão para formato de banco de dados.', { sessionId: this.id });
        if (!this.idUsuario) {
            logger.error('Erro crítico: idUsuario está nulo ao preparar dados para o banco.', { session: this });
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

    static deBancoDeDados(dbData) {
        if (!dbData) {
            logger.warn('Tentativa de criar modelo de sessão a partir de dados nulos do banco de dados.');
            return null;
        }
        logger.info('Convertendo dados do banco de dados para modelo de sessão.', { sessionId: dbData.id });

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
        logger.info('Convertendo modelo de sessão para formato de resposta HTTP.', { sessionId: this.id });
        return {
            id: this.id,
            idUsuario: this.idUsuario,
            expiraEm: this.expiraEm,
            dataCriacao: this.dataCriacao
        };
    }
}

export default Sessao;
