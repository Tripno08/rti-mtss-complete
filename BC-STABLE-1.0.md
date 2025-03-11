# BC Stable 1.0

Esta é a versão estável BC Stable 1.0 do projeto Innerview (anteriormente RTI/MTSS Complete). Esta versão inclui correções para compatibilidade com React 19 e outros bugs, além de novas funcionalidades para visualização da pirâmide de suporte multi-nível.

## Detalhes da Versão

- **Nome da Versão**: BC Stable 1.0
- **Data de Lançamento**: 11 de março de 2025
- **Branch**: bc-stable-1.0
- **Tag**: v1.0-bc-stable

## Identidade Visual

- **Nome do Produto**: Innerview
- **Logotipo**: Novo logotipo implementado, representando a visão interna dos dados educacionais
- **Cores Principais**: Azul (#4D6A8B) e Turquesa (#40E0D0)
- **Tipografia**: Fonte moderna sans-serif para melhor legibilidade

## Estrutura do Projeto

O projeto está organizado nas seguintes pastas principais:

- **frontend**: Aplicação frontend em Next.js 15.2.2 com React 19
- **backend**: API backend em NestJS
- **docker**: Configurações Docker para desenvolvimento e produção
- **infra**: Scripts e configurações de infraestrutura

## Requisitos

- Node.js 20.x ou superior
- Docker e Docker Compose
- Git

## Configuração e Instalação

### Clonando o Repositório

```bash
git clone https://github.com/Tripno08/innerview.git
cd innerview
git checkout bc-stable-1.0
```

### Configuração do Frontend

```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

O frontend estará disponível em http://localhost:3002

### Configuração do Backend

```bash
cd backend
npm install
npm run start:dev
```

O backend estará disponível em http://localhost:3001

### Usando Docker Compose

Para iniciar todo o ambiente usando Docker Compose:

```bash
docker-compose up -d
```

## Novas Funcionalidades

### Visualização da Pirâmide de Suporte Multi-nível

1. **Componente RtiPyramidChart**
   - Implementado componente interativo para visualização da pirâmide de suporte
   - Exibição de detalhes sobre cada tier, incluindo características, tipos de intervenções e exemplos de estudantes
   - Suporte para seleção de tiers e visualização detalhada

2. **Página de Análise da Pirâmide**
   - Adicionada página `/analytics/rti-pyramid` para análise detalhada da pirâmide
   - Visualização da distribuição de estudantes por tier
   - Tabela de estudantes com filtros por tier
   - Gráfico de tendências ao longo do tempo

3. **Página da Pirâmide no Dashboard**
   - Adicionada página `/dashboard/rti-pyramid` para visualização rápida da pirâmide
   - Cards informativos sobre cada tier
   - Recomendações para implementação eficaz do modelo de suporte multi-nível

4. **Integração no Dashboard Principal**
   - Adicionados cards no dashboard principal com resumo da pirâmide
   - Links diretos para as páginas detalhadas da pirâmide

5. **Rebranding para Innerview**
   - Implementação do novo nome "Innerview" em toda a interface
   - Integração do novo logotipo na barra de navegação e tela de login
   - Atualização das referências de "RTI/MTSS" para "Innerview" em toda a aplicação

## Correções Implementadas

### Correções de erros

1. **Corrigido erro "element.ref was removed in React 19"**
   - Atualizado componentes que usavam `React.forwardRef` para usar a nova API de refs do React 19
   - Executado codemods `types-react-codemod` para atualizar tipos e referências
   - Criado script `fix-forwardref.js` para automatizar a correção em todos os componentes UI

2. **Corrigido erro de acesso a parâmetros de rota no Next.js 15**
   - Atualizado o tipo de parâmetros de `{ params: { id: string } }` para `{ params: Promise<{ id: string }> }`
   - Implementado `React.use()` para acessar parâmetros de rota
   - Criado script `fix-route-params.js` para automatizar a correção em todos os componentes de página
   - Substituído acesso direto a `params.id` por constantes extraídas de `resolvedParams`

3. **Corrigido erro "SelectItem value cannot be empty"**
   - Criado script `fix-select-items.js` para corrigir todos os `SelectItem` com valor vazio
   - Substituído valores vazios por valores significativos como `all-categories`, `all-types`, etc.
   - Atualizado a lógica de filtro para lidar com os novos valores

4. **Corrigido erro "ReferenceError: matchesStatus is not defined"**
   - Corrigido erro de referência no arquivo `frontend/src/app/(dashboard)/screening/page.tsx`
   - Substituído `matchesStatus` por `matchesstatusFilter` para manter consistência com a variável definida
   - Corrigido valor de filtro de "all-statusFilters" para "all-statuses"

5. **Corrigido incompatibilidades com Next.js 15 e React 19**
   - Atualizado `next-auth` para versão `^5.0.0-beta.15` compatível com Next.js 15
   - Atualizado `next-themes` para versão `^0.3.0`
   - Atualizado `eslint-config-next` para versão `^15.2.2`
   - Implementado uso de `--legacy-peer-deps` para resolver conflitos de dependências

### Dependências atualizadas

- Atualizado pacotes principais:
  - `next`: "^15.2.2"
  - `react`: "^19.0.0"
  - `react-dom`: "^19.0.0"
  - `next-auth`: "^5.0.0-beta.15"
  - `next-themes`: "^0.3.0"
  - `eslint-config-next`: "^15.2.2"

- Atualizado pacotes do Radix UI para versões compatíveis com React 19:
  - `@radix-ui/react-select`: "^2.1.6"
  - `@radix-ui/react-slot`: "^1.1.2"
  - `@radix-ui/react-checkbox`: "1.0.4"
  - `@radix-ui/react-dialog`: "^1.0.5"
  - `@radix-ui/react-dropdown-menu`: "2.0.6"
  - `@radix-ui/react-label`: "2.0.2"
  - `@radix-ui/react-popover`: "1.0.7"
  - `@radix-ui/react-separator`: "1.0.3"
  - `@radix-ui/react-tabs`: "1.0.4"

## Scripts de Manutenção

1. **fix-select-items.js**
   - Script para corrigir todos os `SelectItem` com valor vazio no projeto
   - Mapeia valores vazios para valores significativos
   - Atualiza a lógica de filtro para lidar com os novos valores

2. **fix-forwardref.js**
   - Script para identificar componentes que usam `React.forwardRef`
   - Prepara para a execução do codemod `types-react-codemod`

3. **update-branding.js**
   - Script para atualizar todas as referências de "RTI/MTSS" para "Innerview"
   - Atualiza referências no código, comentários e strings de interface
   - Implementa o novo logotipo em componentes relevantes

## Solução de Problemas Comuns

1. **Erro "ENOENT: no such file or directory, open 'app-paths-manifest.json'"**
   - Solução: Limpar o cache do Next.js com `rm -rf .next`
   - Em casos persistentes, realizar limpeza completa: `rm -rf .next node_modules package-lock.json` seguido de `npm install --legacy-peer-deps`

2. **Erro "Cannot read properties of undefined (reading 'clientModules')"**
   - Solução: Reinstalar dependências com `npm install --legacy-peer-deps`
   - Verificar compatibilidade entre versões do Next.js e React

3. **Avisos de useLayoutEffect no servidor**
   - Estes avisos são esperados e não afetam a funcionalidade da aplicação
   - Relacionados ao uso de componentes que utilizam useLayoutEffect no servidor

## Contato

Para mais informações, entre em contato com a equipe de desenvolvimento do Innerview. 