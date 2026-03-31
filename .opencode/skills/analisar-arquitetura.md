# Skill: Analisar Arquitetura de Projeto

## Descrição
Analisa a estrutura de pastas do projeto e identifica o padrão arquitetural utilizado.

## Como usar
Execute o comando: `/analisar-arquitetura`

## O que faz
1. Lista a estrutura de diretórios do projeto
2. Identifica o padrão arquitetural (MVC, Clean Architecture, Domain-Driven Design, etc.)
3. Detecta as tecnologias/frameworks utilizados (React, Node.js, etc.)
4. Explica a finalidade de cada pasta principal
5. Gera um resumo da arquitetura

## Padrões identificados
- **Frontend**: React + Vite + TypeScript + TailwindCSS
- **Backend**: Node.js + Express
- **Padrão Backend**: Camadas (Controllers, Services, Repositories, Models)
- **State Management**: Zustand (store em Componentes/store)
- **Mobile**: Capacitor

## Estrutura típica detectada

### Frontend (raiz)
- `src/` - Código fonte principal
- `Componentes/` - Componentes React organizados por funcionalidade
- `hooks/` - Custom React hooks
- `pages/` - Páginas da aplicação
- `routes/` - Configuração de rotas
- `viewmodels/` - View models para estado
- `SistemaFlux/` - Sistema principal
- `ServiçosFrontend/` - Serviços/API do frontend

### Backend (pasta backend/)
- `config/` - Configurações (ambiente, logging, middleware)
- `controles/` - Controllers/Controles de negócio
- `database/` - Conexão e esquemas de banco
- `models/` - Modelos de dados
- `Repositorios/` - Repositories (acesso a dados)
- `RotasBackend/` - Definição de rotas API
- `ServicosBackend/` - Lógica de negócio
- `util/` - Utilitários
- `validators/` - Validações de entrada
