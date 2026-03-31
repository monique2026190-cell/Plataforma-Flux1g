# Skill: Analisar Componentes React

## Descrição
Analisa a organização dos componentes React por domínio funcional.

## Como usar
Execute o comando: `/analisar-componentes`

## Estrutura de Componentes

Os componentes estão organizados em `Componentes/` por domínio:

### Domínios Identificados

| Pasta | Domínio | Descrição |
|-------|---------|-----------|
| `ComponentesDeAuth/` | Autenticação | Componentes de login, registro, recuperação de senha |
| `ComponentesDeChats/` | Mensagens | Chat, conversas, mensagens |
| `ComponentesDeFeed/` | Feed | Posts, feed principal |
| `ComponentesDeGroups/` | Grupos | Gerenciamento de grupos |
| `ComponentesDeMarketplace/` | Marketplace | Produtos, loja virtual |
| `ComponentesDeProvedores/` | Provedores | Integrações de pagamento |
| `ComponentesReels/` | Reels | Vídeos curto tipo Reels |
| `ComponentesPerfilProprio/` | Perfil | Perfil do usuário |
| `ComponentesDeAdmin/` | Administração | Painel admin |
| `ComponentesDeConfiguracaoAppFlux/` | Configurações | Configurações do app |
| `ComponentesDeNotification/` | Notificações | Sistema de notificações |
| `ComponentesDeLeaderboard/` | Ranking | Quadro de líderes |
| `ComponentesDeGeolocalizacao/` | Geolocalização | Mapa, localização |
| `ComponentesDePaginasDeVendas/` | Vendas | Páginas de vendas |
| `ComponentesDePrevençãoDeErros/` | Erros | Tratamento de erros |
| `ComponentesDeHelp/` | Ajuda | Suporte e ajuda |
| `ads/` | Publicidade | Componentes de anúncios |
| `financial/` | Financeiro | Componentes financeiros |
| `layout/` | Layout | Layout global (Header, Footer, MainLayout) |
| `store/` | Estado | Zustand stores |
| `Icones/` | Ícones | Componentes de ícones |
| `cabeçalhos/` | Cabeçalhos | Componentes de header |
| `ComponenteDeInterfaceDeUsuario/` | Interface UI | Componentes genéricos de UI |
| `groups/` | Grupos | Componentes de grupos |

### Componentes de Layout (raiz do Componentes/)
- `layout/MainLayout.tsx` - Layout principal
- `layout/MainHeader.tsx` - Header global
- `layout/Footer.tsx` - Rodapé
- `layout/GlobalTracker.tsx` - Rastreamento global

### Stores (Estado Global)
- `store/CampaignStoreList.tsx` - Estado de campanhas de ads
- `store/ProductStoreList.tsx` - Estado de produtos

## Padrão de Componentes

Cada domínio segue um padrão:
- Componentes funcionais com TypeScript
- Props tipadas
- Uso de hooks customizados
- Integração com Zustand store

## Como encontrar um componente

1. **Por domínio**: Acesse `Componentes/ComponentesDe[Domínio]/`
2. **Por tipo funcional**: Verifique subpastas específicas
3. **Genéricos**: Veja em `ComponenteDeInterfaceDeUsuario/`
