
// backend/Repositorios/Repositorio.Estrutura.Grupos.ts
// Arquivo mock para resolver dependências de compilação.

class RepositorioGrupoMock {
  async criar(dados) {
    console.log('Método criar do mock chamado', dados);
    return Promise.resolve({ ...dados, id: 'mock-id' });
  }

  async encontrarPorId(id) {
    console.log('Método encontrarPorId do mock chamado', id);
    return Promise.resolve({ id, nome: 'Grupo Mock' });
  }
}

export default new RepositorioGrupoMock();
