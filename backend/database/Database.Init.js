import pool from './Processo.Conexao.Banco.Dados.js';
import { db } from './Processo.Inicializacao.js';
import { auditorDoPostgreSQL } from './AuditoresDeBancos/AuditorDoPostgreSQL.js';

const initDatabase = async () => {
  try {
    const client = await pool.connect();
    console.log('Banco de dados conectado com sucesso!');
    client.release();

    await db.init();
    console.log('Banco de dados inicializado com sucesso!');
    
    await auditorDoPostgreSQL.inspectDatabases();
    console.log('Auditoria do banco de dados concluída com sucesso!');
  } catch (error) {
    console.error('Erro durante a inicialização ou auditoria do banco de dados:', error);
    process.exit(1);
  }
};

export default initDatabase;
