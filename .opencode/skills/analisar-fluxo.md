# Skill: Analisar Fluxo de Dados (Pages → Hooks → Services → Backend)

## Descrição
Analisa o fluxo completo de dados do projeto: Páginas → Hooks → Application Layer → Services → Provider → Backend.

## Como usar
Execute o comando: `/analisar-fluxo`

## Arquitetura do Fluxo de Dados

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           FRONTEND (React)                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────┐      ┌─────────────┐      ┌─────────────────────────┐     │
│  │   PAGES    │ ───► │    HOOKS    │ ───► │  APPLICATION LAYER      │     │
│  │  (Views)   │      │ (Lógica UI) │      │  (ServicosFrontend)     │     │
│  └─────────────┘      └─────────────┘      └───────────┬─────────────┘     │
│                                                        │                   │
│                                               ┌────────▼────────┐           │
│                                               │   PROVIDERS     │           │
│                                               │ (Zustand Store)│           │
│                                               └────────┬────────┘           │
│                                                        │                   │
├────────────────────────────────────────────────────────┼───────────────────┤
│                           BACKEND (Node.js)           │                    │
│                                                        ▼                    │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         APPLICATION LAYER                          │   │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────┐   │   │
│  │  │   CONTROLES     │◄─┤     ROTAS      │─►│    SERVICOS        │   │   │
│  │  │  (Controllers)  │  │  (Endpoints)   │  │  (Business Logic) │   │   │
│  │  └────────┬────────┘  └─────────────────┘  └──────────┬──────────┘   │   │
│  │           │                                             │             │   │
│  │  ┌────────▼────────────────────────────────────────────────────────┐  │   │
│  │  │                    INFRASTRUCTURE / PROVIDERS                   │  │   │
│  │  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐    │  │   │
│  │  │  │ REPOSITORIES│  │   MODELS    │  │   VALIDATORS       │    │  │   │
│  │  │  │ (Data Access)│ │(DB Schemas) │  │  (Input Validation)│    │  │   │
│  │  │  └─────────────┘  └─────────────┘  └─────────────────────┘    │  │   │
│  │  └──────────────────────────────────────────────────────────────────┘  │   │
│  │                                                                         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│                              │                                               │
│                              ▼                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      DATABASE (MongoDB)                            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Camadas Detalhadas

### 1. PAGES (src/pages/)
**Finalidade**: Componentes de visualização (Views)
**Responsabilidade**: Renderizar UI, capturar interações do usuário

**Exemplos de arquivos**:
- `Feed.tsx` - Página principal do feed
- `Chat.tsx` - Página de chat
- `PG.Grupo.tsx` - Página de grupo
- `Marketplace.tsx` - Página de marketplace

### 2. HOOKS (src/hooks/)
**Finalidade**: Lógica de negócio do frontend, conectar UI com dados
**Responsabilidade**: Gerenciar estado, chamar services, tratar eventos

**Exemplos de arquivos**:
- `Hook.Feed.ts` - Hook para carregar feed
- `Hook.Conversa.ts` - Hook para gerenciar conversas
- `Hook.Criacao.Grupo.ts` - Hook para criação de grupos
- `Hook.Acoes.Post.ts` - Hook para ações em posts

**Padrão de uso**:
```typescript
const { dados, carregando, erro } = Hook.AlgumaCoisa()
```

### 3. APPLICATION LAYER (src/ServicosFrontend/)
**Finalidade**: Transformar dados entre frontend e backend
**Responsabilidade**: Formatar requisições, tratar respostas, tipos compartilhados

**Observação**: Esta pasta parece não existir no seu projeto atual. Os serviços podem estar em:
- Dentro de cada hook
- Em `src/` (ex: `src/constants/api.ts`)

### 4. PROVIDERS/STATE (src/Componentes/store/)
**Finalidade**: Gerenciamento de estado global (Zustand)
**Responsabilidade**: Cache de dados, estado compartilhado entre componentes

**Exemplos**:
- `CampaignStoreList.tsx` - Estado de campanhas
- `ProductStoreList.tsx` - Estado de produtos

### 5. SISTEMA CORE (src/SistemaFlux/)
**Finalidade**: Núcleo da aplicação
**Responsabilidade**: Inicialização, providers globais, configuração

**Arquivos principais**:
- `Sistema.Nucleo.Inicializador.tsx` - Inicialização do sistema
- `Sistema.Nucleo.App.tsx` - Componente raiz
- `App.Flux.ts` - App principal

**Provedores**:
- `Provedor.Interface.tsx` - Provider de interface
- `Provedor.Navegacao.tsx` - Provider de navegação
- `Provedor.Telemetria.tsx` - Provider de telemetria

---

### 6. BACKEND ROTAS (backend/RotasBackend/)
**Finalidade**: Definição de endpoints API
**Responsabilidade**: Rotas, métodos HTTP, autenticação

**Exemplos**:
- `Rotas.Sessao.js` - Rotas de sessão
- `Rotas.Usuario.js` - Rotas de usuários
- `Rotas.js` - Rota principal

### 7. BACKEND CONTROLES (backend/controles/)
**Finalidade**: Controllers - ponto de entrada das requisições
**Responsabilidade**: Receber requisição, validar input, chamar serviços

**Exemplos**:
- `Controle.Sessao.js` - Controle de sessão
- `Controle.Usuario.js` - Controle de usuários

### 8. BACKEND SERVICES (backend/ServicosBackend/)
**Finalidade**: Lógica de negócio (Business Logic)
**Responsabilidade**: Regras de negócio, validações específicas

**Exemplos**:
- `Servico.Usuario.js` - Serviço de usuário
- `Servico.Gestao.js` - Serviço de gestão

### 9. INFRASTRUCTURE / PROVIDERS
**Finalidade**: Camada de infraestrutura
**Responsabilidade**: Acesso a dados, validação, configurações

**Componentes**:
- **Repositories** (`backend/Repositorios/`) - Acesso a dados, queries, CRUD
- **Models** (`backend/models/`) - Esquemas do banco (MongoDB)
- **Validators** (`backend/validators/`) - Validação de entrada
- **Config** (`backend/config/`) - Configurações, middleware, logging
- **Database** (`backend/database/`) - Conexão e inicialização do banco

---

## Exemplo de Fluxo Completo

### Cenário: Criar post no feed

```
1. USER ACTION
   ┌─────────────────────────────────────────┐
   │  pages/CreatePost.tsx                  │
   │  Usuário clica em "Publicar"           │
   └────────────────────┬──────────────────┘
                        │
2. HOOK CHAIN
   ┌─────────────────────────────────────────┐
   │  hooks/Hook.Criacao.Feed.Padrao.ts     │
   │  Chama função de criar post            │
   └────────────────────┬──────────────────┘
                        │
3. API CALL (no hook)
   ┌─────────────────────────────────────────┐
   │  axios.post('/api/publicacoes', data)  │
   └────────────────────┬──────────────────┘
                        │
4. BACKEND ROUTE
   ┌─────────────────────────────────────────┐
   │  backend/RotasBackend/Rotas.Publicacoes │
   │  Recebe requisição POST                │
   └────────────────────┬──────────────────┘
                        │
5. CONTROLLER
   ┌─────────────────────────────────────────┐
   │  backend/controles/Controles.Publicacoes│
   │  Chama serviço de criação              │
   └────────────────────┬──────────────────┘
                        │
6. SERVICE
   ┌─────────────────────────────────────────┐
   │  backend/ServicosBackend/Servico.Pub   │
   │  Executa lógica de negócio             │
   └────────────────────┬──────────────────┘
                        │
7. REPOSITORY
   ┌─────────────────────────────────────────┐
   │  backend/Repositorios/Repositorio.Pub   │
   │  Salva no banco                         │
   └────────────────────┬──────────────────┘
                        │
8. DATABASE
   ┌─────────────────────────────────────────┐
   │  MongoDB                                │
   │  Armazena documento                    │
   └─────────────────────────────────────────┘
```

**Fluxo HTTP: Route → Controller → Service → Repository → Database**

## Como identificar o fluxo de uma feature

1. **Página**: Procure em `pages/` pelo nome da feature
2. **Hook**: Procure em `hooks/Hook.*` relacionado à feature
3. **API Call**: No hook, procure a chamada axios/fetch
4. **Rota**: Procure em `backend/RotasBackend/Rotas.*`
5. **Controller**: Procure em `backend/controles/Controle.*`
6. **Service**: Procure em `backend/ServicosBackend/Servico.*`
7. **Repository/Model**: Procure em `backend/Repositorios/` e `backend/models/`

**Ordem: Pages → Hooks → API → Routes → Controllers → Services → Repositories → Models → Database**
