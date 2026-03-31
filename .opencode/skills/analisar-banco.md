# Skill: Analisar Banco de Dados (Models/Schemas)

## Descrição
Analisa os models e schemas do MongoDB, identificando entidades e relações.

## Como usar
Execute o comando: `/analisar-banco`

## Models do Banco

Os models estão em `backend/models/`:

| Model | Arquivo | Descrição |
|-------|---------|-----------|
| Usuário | `Models.Estrutura.Usuario.js` | Entidade de usuário |
| Sessão | `Models.Estrutura.Sessao.js` | Sessões de usuário |
| Feed/Publicação | `Models.Estrutura.Publicacao.Feed.js` | Posts do feed |
| Reels | `Models.Estrutura.Publicacao.Reels.js` | Vídeos cortos |
| Marketplace | `Models.Estrutura.Publicacao.Marketplace.js` | Produtos venda |
| Grupos | `Models.Estrutura.Grupos.js` | Grupos (públicos/privados/pagos) |
| Configurações Grupo | `Models.Estrutura.Configuracoes.Grupo.js` | Config de grupos |
| Comentários | `Models.Estrutura.Comentarios.js` | Comentários (Feed/Reels/Marketplace) |

---

## Estrutura de Entidades

### Usuário
```
- id, nome, email, senha_hash
- apelido, bio, site, urlFoto
- privado, perfilCompleto
- seguidores[], seguindo[]
- dataCriacao, dataAtualizacao
```

### Publicação (Feed)
```
- id, autorId, conteudo
- midia[], tipo (texto/imagem/video)
- curtidas[], comentarios[]
- dataCriacao
```

### Grupo
```
- id, nome, descricao, tipo (publico/privado/pago)
- administradorId, membros[]
- precos[], configuracoes
- dataCriacao
```

---

## Acesso aos Dados

### Repositories (`backend/Repositorios/`)
- `Repositorio.Usuario.js` - CRUD usuário
- `Repositorio.Publicacao.js` - CRUD publicações
- `Repositorio.Grupo.js` - CRUD grupos
- `Repositorio.Sessao.js` - Gerenciamento sessão
- `Repositorio.Metricas.js` - Métricas

### Database (`backend/database/`)
- `Database.Init.js` - Inicialização
- `Processo.Conexao.js` - Conexão MongoDB
- `Processo.Inicializacao.js` - Setup inicial
- `Processo.Sincronizacao.js` - Sincronização

---

## Como usar

1. **Criar**: Use o Model para instanciar
2. **Salvar**: Use o Repository para persistir
3. **Consultar**: Queries no Repository

**Fluxo**: `Model` → `Repository` → `MongoDB`
